import cron from "node-cron";
import redisClient from "./radis_client.js";
import { Url } from "../model/url.model.js";


export const syncClicksToDB = async () => {
  try {
    let cursor = "0";

    do {
      const result = await redisClient.scan(cursor, {
        MATCH: "clicks:*",
        COUNT: 100
      });

      cursor = result.cursor;
      const keys = result.keys;

      for (const key of keys) {
        const shortCode = key.replace("clicks:", "");
        const clicks = Number(await redisClient.getDel(key)) || 0;

        if (clicks > 0) {
          await Url.updateOne(
            { shortCode },
            { $inc: { clicks } }
          );
        }
      }
    } while (cursor !== "0");

    console.log("Redis clicks synced to MongoDB");
  } catch (err) {
    console.error(" Click sync failed:", err.message);
  }
};


export const handleExpiredUrls = async () => {
  try {
    const now = new Date();

    const expiredUrls = await Url.find({
      expiryAt: { $lte: now },
      isActive: true
    }).select("shortCode");

    if (!expiredUrls.length) return;

    const bulkOps = expiredUrls.map((url) => ({
      updateOne: {
        filter: { shortCode: url.shortCode },
        update: { $set: { isActive: false } }
      }
    }));

    await Url.bulkWrite(bulkOps);

    // cleanup redis keys
    for (const url of expiredUrls) {
      await redisClient.del(`clicks:${url.shortCode}`);
    }

    console.log(` ${expiredUrls.length} URLs expired`);
  } catch (err) {
    console.error(" Expiry handler failed:", err.message);
  }
};


// every 1 minute
cron.schedule("*/1 * * * *", syncClicksToDB);

// every 5 minutes
cron.schedule("*/5 * * * *", handleExpiredUrls);
