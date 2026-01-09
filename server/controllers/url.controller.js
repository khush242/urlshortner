import {ApiError} from "../utils/ApiError.js"
import {Response} from "../utils/Response.js"
import {asyncWrapper} from "../utils/asyncWrapper.js"
import {generateShortCode} from "../utils/shortCodeGenerator.js"
import {Url} from "../model/url.model.js"
import redisClient from "../cache/radis_client.js"

export const registerUrl = asyncWrapper(async (req, res) => {
  const { originalUrl, expiryAt } = req.body;

  if (!originalUrl) {
    throw new ApiError("Url is required", 400);
  }

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError("User not authenticated", 401);
  }

let expiryDate = null;
const now = new Date();

if (expiryAt) {
  expiryDate = (() => {
    const [date, time] = expiryAt.split("T");
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm);
  })();

  if (isNaN(expiryDate.getTime())) {
    throw new ApiError("Invalid expiry date", 400);
  }

  if (expiryDate <= now) {
    throw new ApiError("Expiry date must be in the future", 400);
  }
}


  let url;
  while (true) {
    const shortCode = generateShortCode();
    try {
      url = await Url.create({
        shortCode,
        userId,
        expiryAt: expiryDate,
        originalUrl
      });
      break;
    } catch (err) {
      if (err.code !== 11000) {
        throw err;
      }
    }
  }

  if (!url) {
    throw new ApiError("Url shortening failed", 500);
  }

  res.status(201).json(
    new Response(
      201,
      {
        shortCode: url.shortCode,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`
      },
      "Url shortened successfully"
    )
  );
});


export const redirectToOriginalUrl = asyncWrapper(async (req, res) => {
  const { shortCode } = req.params;

  // Redis first
  const cachedUrl = await redisClient.get(`url:${shortCode}`);
  if (cachedUrl) {
    redisClient.incr(`clicks:${shortCode}`).catch(() => {});
    return res.redirect(cachedUrl);
  }

  const url = await Url.findOne({ shortCode, isActive: true });

  if (!url) throw new ApiError("Invalid short URL", 404);
  if (url.expiryAt && url.expiryAt < new Date())
    throw new ApiError("URL expired", 410);

  // Cache original URL
  const ttl = url.expiryAt
    ? Math.floor((url.expiryAt - Date.now()) / 1000)
    : undefined;

  await redisClient.set(
    `url:${shortCode}`,
    url.originalUrl,
    ttl ? { EX: ttl } : {}
  );

  redisClient.incr(`clicks:${shortCode}`).catch(() => {});

  return res.redirect(url.originalUrl);
});



export const getUserUrls = asyncWrapper(async (req, res) => {
  const userId = req.user._id;

  const urls = await Url.find({ userId })
    .sort({ createdAt: -1 })
    .select("-__v")
    .lean(); // IMPORTANT

  // Attach Redis clicks
  for (const url of urls) {
    try {
      const redisClicks = await redisClient.get(`clicks:${url.shortCode}`);
      url.clicks = redisClicks !== null ? Number(redisClicks) : url.clicks;
    } catch {
      // fallback to DB clicks
    }
  }

  res.status(200).json(
    new Response(200, urls, "User URLs fetched successfully")
  );
});



export const getUrlAnalytics = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const url = await Url.findOne({ _id: id, userId });

  if (!url) {
    throw new ApiError("URL not found", 404);
  }

  let clicks = url.clicks;

  try {
    const redisClicks = await redisClient.get(`clicks:${url.shortCode}`);
    if (redisClicks !== null) {
      clicks = Number(redisClicks);
    }
  } catch (err) {
    console.error("Redis analytics read failed:", err.message);
  }

  res.status(200).json(
    new Response(
      200,
      {
        _id: url._id,
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        clicks,
        isActive: url.isActive,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
        expiryAt: url.expiryAt
      },
      "Analytics fetched successfully"
    )
  );
});




export const toggleUrlStatus = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // Find URL first
  const url = await Url.findOne({ _id: id, userId });

  if (!url) {
    throw new ApiError("URL not found", 404);
  }

  // Toggle status
  url.isActive = !url.isActive;
  await url.save();

  res.status(200).json(
    new Response(200, url, "URL status toggled successfully")
  );
});


export const deleteUrl = asyncWrapper(async (req, res) => {
  const { shortCode } = req.params;
  const userId = req.user._id;

  const url = await Url.findOneAndDelete({ shortCode: shortCode, userId });

  if (!url) {
    throw new ApiError("URL not found", 404);
  }

  res.status(200).json(
    new Response(200, null, "URL deleted successfully")
  );
});
