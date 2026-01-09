import { useDispatch } from "react-redux";
import {
  toggleUrlStatusRequest,
  deleteUrlRequest,
  getUrlAnalyticsRequest,
} from "../features/urls/urlSlice";
import { useState } from "react";
import CopyUrl from "./CopyUrl";
import AnalyticsModal from "./AnalyticsModal";
import { BarChart3, Trash2, Copy, CheckCircle, AlertCircle } from "lucide-react";

export default function UrlCard({ url }) {
  const dispatch = useDispatch();
  const [openAnalytics, setOpenAnalytics] = useState(false);

  const shortUrl = `${import.meta.env.VITE_API_BASE_URL}/urls/${url.shortCode}`;
  const isExpired = url.expiryAt && new Date(url.expiryAt) < new Date();

  return (
    <>
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
        
        {/* Header with Status */}
        <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex items-center justify-between ${
          isExpired ? "bg-red-50" : url.isActive ? "bg-emerald-50" : "bg-slate-50"
        }`}>
          <p className="text-xs sm:text-sm font-semibold text-slate-900">URL #{url.shortCode}</p>
          <div className="flex items-center gap-2">
            {isExpired ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                <AlertCircle size={14} />
                Expired
              </span>
            ) : url.isActive ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                <CheckCircle size={14} />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-medium">
                Inactive
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Original URL */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Original URL
            </p>
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-slate-700 hover:text-slate-900 break-all underline underline-offset-2 line-clamp-2"
            >
              {url.originalUrl}
            </a>
          </div>

          {/* Short URL */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Short URL
            </p>
            <div className="flex items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 break-all underline underline-offset-2 flex-1"
              >
                {shortUrl}
              </a>
              <CopyUrl url={shortUrl} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-500 mb-1">Clicks</p>
              <p className="text-2xl font-bold text-slate-900">{url.clicks ?? 0}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-500 mb-1">Status</p>
              <p className="text-lg font-bold text-slate-900">
                {isExpired ? "Expired" : url.isActive ? "✓ On" : "✕ Off"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="border-t border-slate-200 p-4 sm:p-6 flex gap-2 sm:gap-3">
          <button
            onClick={() => {
              setOpenAnalytics(true);
              dispatch(getUrlAnalyticsRequest({ id: url._id }));
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium transition-colors text-sm"
          >
            <BarChart3 size={16} />
            Analytics
          </button>

          {!isExpired && (
            <button
              onClick={() =>
                dispatch(toggleUrlStatusRequest({ id: url._id }))
              }
              className="flex-1 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors text-sm"
            >
              {url.isActive ? "Disable" : "Enable"}
            </button>
          )}

          <button
            onClick={() => {
              if (confirm("Delete this URL? This action cannot be undone.")) {
                dispatch(deleteUrlRequest({ shortCode: url.shortCode }));
              }
            }}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
          >
            <Trash2 size={16} />
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
