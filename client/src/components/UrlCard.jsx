import { useDispatch } from "react-redux";
import {
  toggleUrlStatusRequest,
  deleteUrlRequest,
  getUrlAnalyticsRequest,
} from "../features/urls/urlSlice";
import { useState } from "react";
import CopyUrl from "./CopyUrl";
import AnalyticsModal from "./AnalyticsModal";

export default function UrlCard({ url }) {
  const dispatch = useDispatch();
  const [openAnalytics, setOpenAnalytics] = useState(false);

  const shortUrl = `${import.meta.env.VITE_API_BASE_URL}/urls/${url.shortCode}`;
  const isExpired = url.expiryAt && new Date(url.expiryAt) < new Date();

  return (
    <>
      <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition p-5 space-y-5">

        {/* ===== ORIGINAL URL ===== */}
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            Original URL
          </p>
          <a
            href={url.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-800 break-all underline underline-offset-2"
          >
            {url.originalUrl}
          </a>
        </div>

        {/* ===== SHORT URL ===== */}
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            Short URL
          </p>
          <div className="flex items-center gap-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-sky-600 break-all underline underline-offset-2"
            >
              {shortUrl}
            </a>
            <CopyUrl url={shortUrl} />
          </div>
        </div>

        {/* ===== STATS + STATUS ===== */}
        <div className="flex justify-between items-center pt-1">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Clicks
            </p>
            <p className="text-lg font-semibold text-slate-800">
              {url.clicks ?? 0}
            </p>
          </div>

          {isExpired ? (
            <span className="px-3 py-1 text-xs rounded-full bg-rose-50 text-rose-600 font-medium">
              Expired
            </span>
          ) : (
            <button
              onClick={() =>
                dispatch(toggleUrlStatusRequest({ id: url._id }))
              }
              className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                url.isActive
                  ? "bg-sky-50 text-sky-600 hover:bg-sky-100"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {url.isActive ? "Active" : "Inactive"}
            </button>
          )}
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              setOpenAnalytics(true);
              dispatch(getUrlAnalyticsRequest({ id: url._id }));
            }}
            className="text-sm font-medium text-sky-600 hover:underline underline-offset-2"
          >
            View Analytics
          </button>

          <button
            onClick={() =>
              confirm("Delete this URL?") &&
              dispatch(deleteUrlRequest({ shortCode: url.shortCode }))
            }
            className="text-sm font-medium text-rose-600 hover:underline underline-offset-2"
          >
            Delete
          </button>
        </div>
      </div>

      <AnalyticsModal
        open={openAnalytics}
        onClose={() => setOpenAnalytics(false)}
      />
    </>
  );
}
