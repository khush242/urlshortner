import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createUrlRequest,
  clearCreatedUrl
} from "../features/urls/urlSlice.js";
import CopyUrl from "../components/CopyUrl.jsx";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading, error, createdUrl } = useSelector(
    (state) => state.urls
  );

  const [originalUrl, setOriginalUrl] = useState("");
  const [expiryAt, setExpiryAt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(
      createUrlRequest({
        originalUrl,
        expiryAt: expiryAt || undefined
      })
    );
  };

  useEffect(() => {
    if (createdUrl) {
      setOriginalUrl("");
      setExpiryAt("");
    }
  }, [createdUrl]);

  useEffect(() => {
    return () => {
      dispatch(clearCreatedUrl());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-amber-50 px-4 py-24">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-5">
          <span className="bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent">
            Short links,
          </span>{" "}
          <span className="text-gray-900">big impact</span>
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto text-lg">
          Create clean, trackable short URLs in seconds.
          Built for speed, analytics, and control.
        </p>
      </div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-xl bg-white rounded-3xl shadow-lg border border-gray-100 p-8 space-y-6"
      >
        {/* URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Paste your long URL
          </label>
          <input
            type="url"
            placeholder="https://example.com/very-long-link"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Expiry */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Expiration (optional)
          </label>
          <input
            type="datetime-local"
            value={expiryAt}
            onChange={(e) => setExpiryAt(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Automatically disable the link after expiry
          </p>
        </div>

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-amber-500 to-orange-500
            hover:from-amber-600 hover:to-orange-600
            transition disabled:opacity-60"
        >
          {loading
            ? "Creating link..."
            : isAuthenticated
            ? "Create short link"
            : "Login to create link"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-6 mx-auto max-w-xl bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Success */}
      {createdUrl && (
        <div className="mt-8 mx-auto max-w-xl bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wide text-emerald-700 mb-2">
            Your short link
          </p>

          <div className="flex items-center justify-between gap-3">
            <a
              href={createdUrl.shortUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-emerald-900 underline break-all"
            >
              {createdUrl.shortUrl}
            </a>

            <CopyUrl url={createdUrl.shortUrl} />
          </div>
        </div>
      )}
    </div>
  );
}
