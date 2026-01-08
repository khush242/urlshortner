import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearAnalytics } from "../features/urls/urlSlice";

export default function AnalyticsModal() {
  const dispatch = useDispatch();
  const { analytics, analyticsLoading, analyticsError } =
    useSelector((state) => state.urls);

  if (!analytics) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-lg relative">
        <button
          onClick={() => dispatch(clearAnalytics())}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold mb-4">
          URL Analytics
        </h2>

        {analyticsLoading && (
          <p className="text-gray-500">Loading analytics…</p>
        )}

        {analyticsError && (
          <p className="text-red-600">{analyticsError}</p>
        )}

        {!analyticsLoading && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500">Short Code</p>
              <p className="font-medium">
                {analytics.shortCode}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Original URL</p>
              <a
                href={analytics.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 underline break-all"
              >
                {analytics.originalUrl}
              </a>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <p className="text-sm text-emerald-700">
                Total Clicks
              </p>
              <p className="text-3xl font-bold text-emerald-800">
                {analytics.clicks}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
