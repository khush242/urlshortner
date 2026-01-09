import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUrlsRequest } from "../features/urls/urlSlice";
import UrlTable from "../components/UrlTable";
import { Link2, BarChart3, Zap } from "lucide-react";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { urls, loading, error } = useSelector((state) => state.urls);

  useEffect(() => {
    dispatch(getUrlsRequest());
  }, [dispatch]);

  // Calculate stats
  const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);
  const activeUrls = urls.filter(url => url.isActive && (!url.expiryAt || new Date(url.expiryAt) >= new Date())).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 text-sm mt-1">Manage and monitor all your shortened URLs</p>
            </div>
            <Link to="/" className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto">
              <Link2 size={18} />
              Create New
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Stats Cards */}
        {urls.length > 0 && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Total URLs */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total URLs</p>
                  <p className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">{urls.length}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Link2 size={24} className="text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Active URLs */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Active URLs</p>
                  <p className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">{activeUrls}</p>
                </div>
                <div className="p-3 bg-teal-100 rounded-lg">
                  <Zap size={24} className="text-teal-600" />
                </div>
              </div>
            </div>

            {/* Total Clicks */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Clicks</p>
                  <p className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">{totalClicks.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <BarChart3 size={24} className="text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin"></div>
              <p className="text-slate-600 font-medium">Loading your URLs...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
            <p className="text-red-800 font-medium">⚠️ Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && urls.length === 0 && !error && (
          <div className="text-center py-12 sm:py-16">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Link2 size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">No URLs yet</h3>
              <p className="text-slate-600 text-sm mb-6">Start creating short URLs to manage them here</p>
              <Link to="/create" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Create Your First URL
              </Link>
            </div>
          </div>
        )}

        {/* URLs Table */}
        {!loading && urls.length > 0 && <UrlTable urls={urls} />}
      </div>
    </div>
  );
}
