import UrlRow from "./UrlRow";
import UrlCard from "./UrlCard";

export default function UrlTable({ urls }) {
  return (
    <>
      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 text-left border-b border-slate-200">
              <th className="px-4 sm:px-6 py-4 font-semibold">Original URL</th>
              <th className="px-4 sm:px-6 py-4 font-semibold">Short URL</th>
              <th className="px-4 sm:px-6 py-4 font-semibold text-center">Clicks</th>
              <th className="px-4 sm:px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-4 sm:px-6 py-4 font-semibold text-center">Actions</th>
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
