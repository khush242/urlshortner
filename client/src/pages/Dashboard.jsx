import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUrlsRequest } from "../features/urls/urlSlice";
import UrlTable from "../components/UrlTable";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { urls, loading, error } = useSelector((state) => state.urls);

  useEffect(() => {
    dispatch(getUrlsRequest());
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {loading && (
        <p className="text-gray-600">Loading your URLs...</p>
      )}

      {error && (
        <p className="text-red-600">{error}</p>
      )}

      {!loading && urls.length === 0 && (
        <p className="text-gray-500">
          You haven’t created any short URLs yet.
        </p>
      )}

      {urls.length > 0 && <UrlTable urls={urls} />}
    </div>
  );
}
