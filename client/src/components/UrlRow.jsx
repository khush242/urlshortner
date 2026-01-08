import { useDispatch } from "react-redux";
import {
  toggleUrlStatusRequest,
  deleteUrlRequest,
  getUrlAnalyticsRequest,
} from "../features/urls/urlSlice";
import { useState } from "react";
import CopyUrl from "./CopyUrl";
import AnalyticsModal from "./AnalyticsModal";

export default function UrlRow({ url }) {
  const dispatch = useDispatch();
  const [openAnalytics, setOpenAnalytics] = useState(false);

  const shortUrl = `${import.meta.env.VITE_API_BASE_URL}/urls/${url.shortCode}`;

  const toggleStatus = () => {
    dispatch(toggleUrlStatusRequest({ id: url._id }));
  };

  const deleteUrl = () => {
    if (confirm("Are you sure you want to delete this URL?")) {
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

      <tr className="hidden md:table-row border-b last:border-none hover:bg-gray-50 transition">
        <td className="px-4 py-4 max-w-xs truncate text-gray-700">
          <a
            href={url.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {url.originalUrl}
          </a>
        </td>

        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-emerald-600 underline"
            >
              {shortUrl}
            </a>
            <CopyUrl url={shortUrl} />
          </div>
        </td>

        <td className="px-4 py-4 text-center font-medium">
          {url.clicks ?? 0}
        </td>

        <td className="px-4 py-4 text-center">
          {isExpired ? (
            <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
              Expired
            </span>
          ) : (
            <button
              onClick={toggleStatus}
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                url.isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {url.isActive ? "Active" : "Inactive"}
            </button>
          )}
        </td>

        <td className="px-4 py-4 text-center space-x-4">
          <button
            onClick={openAnalyticsModal}
            className="text-sm text-indigo-600 hover:underline"
          >
            Analytics
          </button>
          <button
            onClick={deleteUrl}
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
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
