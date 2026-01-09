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

export default function UrlRow({ url }) {
  const dispatch = useDispatch();
  const [openAnalytics, setOpenAnalytics] = useState(false);

  const shortUrl = `${import.meta.env.VITE_API_BASE_URL}/urls/${url.shortCode}`;

  const toggleStatus = () => {
    dispatch(toggleUrlStatusRequest({ id: url._id }));
  };

  const deleteUrl = () => {
    if (confirm("Are you sure you want to delete this URL? This action cannot be undone.")) {
      dispatch(deleteUrlRequest({ shortCode: url.shortCode }));
    }
  };

  const openAnalyticsModal = () => {
    setOpenAnalytics(true);
    dispatch(getUrlAnalyticsRequest({ id: url._id }));
  };

  const isExpired =
    url.expiryAt && new Date(url.expiryAt) < new Date();

  return (
    <>
      <tr className="hidden md:table-row border-b last:border-none hover:bg-slate-50 transition">
        {/* Original URL */}
        <td className="px-4 sm:px-6 py-4 max-w-xs truncate text-slate-700 text-sm">
          <a
            href={url.originalUrl}
            target="_blank"
            rel="noreferrer"
            title={url.originalUrl}
            className="hover:text-slate-900 hover:underline break-all line-clamp-1"
          >
            {url.originalUrl}
          </a>
        </td>

        {/* Short URL */}
        <td className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-2 text-sm break-all"
            >
              {shortUrl}
            </a>
            <CopyUrl url={shortUrl} />
          </div>
        </td>

        {/* Clicks */}
        <td className="px-4 sm:px-6 py-4 text-center">
          <span className="inline-block bg-slate-100 text-slate-900 px-3 py-1 rounded-full font-semibold text-sm">
            {url.clicks ?? 0}
          </span>
        </td>

        {/* Status */}
        <td className="px-4 sm:px-6 py-4 text-center">
          {isExpired ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">
              <AlertCircle size={14} />
              Expired
            </span>
          ) : (
            <button
              onClick={toggleStatus}
              className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                url.isActive
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {url.isActive ? (
                <>
                  <CheckCircle size={14} />
                  Active
                </>
              ) : (
                "Inactive"
              )}
            </button>
          )}
        </td>

        {/* Actions */}
        <td className="px-4 sm:px-6 py-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={openAnalyticsModal}
              className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
              title="View Analytics"
            >
              <BarChart3 size={16} />
              <span className="hidden lg:inline">Analytics</span>
            </button>
            <button
              onClick={deleteUrl}
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
              <span className="hidden lg:inline">Delete</span>
            </button>
          </div>
        </td>
      </tr>

      {/* Analytics Modal */}
      <AnalyticsModal
        open={openAnalytics}
        onClose={() => setOpenAnalytics(false)}
      />
    </>
  );
}
