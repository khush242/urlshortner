import UrlRow from "./UrlRow";
import UrlCard from "./UrlCard";

export default function UrlTable({ urls }) {
  return (
    <>
      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-3xl shadow border border-gray-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <th className="px-4 py-4">Original URL</th>
              <th className="px-4 py-4">Short URL</th>
              <th className="px-4 py-4 text-center">Clicks</th>
              <th className="px-4 py-4 text-center">Status</th>
              <th className="px-4 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <UrlRow key={url._id} url={url} />
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE CARDS ===== */}
      <div className="md:hidden space-y-4">
        {urls.map((url) => (
          <UrlCard key={url._id} url={url} />
        ))}
      </div>
    </>
  );
}
