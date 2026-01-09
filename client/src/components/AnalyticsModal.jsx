import { X, TrendingUp, Calendar, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearAnalytics } from "../features/urls/urlSlice";

export default function AnalyticsModal() {
  const dispatch = useDispatch();
  const { analytics, analyticsLoading, analyticsError } =
    useSelector((state) => state.urls);

  if (!analytics) return null;

  const createdDate = new Date(analytics.createdAt);
  const expiryDate = new Date(analytics.expiryAt);
  const now = new Date();
  
  const daysActive = Math.floor(
    (new Date() - createdDate) / (1000 * 60 * 60 * 24)
  );
  const avgClicksPerDay =
    daysActive > 0 ? (analytics.clicks / daysActive).toFixed(2) : 0;

  // Calculate time remaining
  const timeRemaining = expiryDate - now;
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const isExpired = timeRemaining <= 0;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => dispatch(clearAnalytics())}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Analytics
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Detailed statistics for your shortened URL
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {analyticsLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin"></div>
            </div>
          )}

          {analyticsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium text-sm">{analyticsError}</p>
            </div>
          )}

          {!analyticsLoading && !analyticsError && (
            <>
              {/* Short Code */}
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-600 text-sm font-medium mb-2">Short Code</p>
                <div className="flex items-center gap-3">
                  <code className="text-lg sm:text-xl font-mono font-bold text-emerald-600 break-all">
                    {analytics.shortCode}
                  </code>
                </div>
              </div>

              {/* Original URL */}
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Original URL</p>
                <a
                  href={analytics.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 underline break-all text-sm sm:text-base"
                >
                  {analytics.originalUrl}
                </a>
              </div>

              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Total Clicks */}
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <p className="text-emerald-700 text-xs sm:text-sm font-medium">Total Clicks</p>
                  <p className="text-3xl sm:text-4xl font-bold text-emerald-900 mt-2">
                    {analytics.clicks}
                  </p>
                </div>

                {/* Avg Clicks Per Day */}
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                  <p className="text-teal-700 text-xs sm:text-sm font-medium">Avg Daily Clicks</p>
                  <p className="text-3xl sm:text-4xl font-bold text-teal-900 mt-2">
                    {avgClicksPerDay}
                  </p>
                </div>
              </div>

              {/* Created Date & Days Active */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-700">
                  <Calendar size={18} className="text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600">Created</p>
                    <p className="font-medium">
                      {createdDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-700">
                  <TrendingUp size={18} className="text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600">Days Active</p>
                    <p className="font-medium">{daysActive} days</p>
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="flex items-center gap-3 text-slate-700">
                  <Calendar size={18} className="text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-600">Expires On</p>
                    <p className="font-medium">
                      {expiryDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>

                {/* Time Remaining */}
                <div className={`flex items-center gap-3 p-3 rounded-lg ${isExpired ? "bg-red-50" : "bg-amber-50"}`}>
                  <Clock size={18} className={`${isExpired ? "text-red-600" : "text-amber-600"} flex-shrink-0`} />
                  <div>
                    <p className={`text-sm ${isExpired ? "text-red-700" : "text-amber-700"}`}>
                      {isExpired ? "Expired" : "Time Remaining"}
                    </p>
                    <p className={`font-medium ${isExpired ? "text-red-900" : "text-amber-900"}`}>
                      {isExpired ? "This link has expired" : `${daysRemaining}d ${hoursRemaining}h ${minutesRemaining}m`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Copy to Clipboard Button */}
              <button
                onClick={() => {
                  const fullUrl = `${import.meta.env.VITE_API_BASE_URL}/urls/${analytics.shortCode}`;
                  navigator.clipboard.writeText(fullUrl);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Copy Short URL
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
