import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { Link } from "react-router-dom";

export default function SearchResults({ query }) {
  const axiosSecure = useAxiosSecure();

  const { data: inventories = [], isLoading, isError } = useQuery({
    queryKey: ["searchResults", query],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/api/inventory/search?query=${query}`);
      return data; // array of inventories
    },
    enabled: !!query, // only fetch if query is not empty
  });

  if (!query) {
    return <p className="text-gray-500 text-center py-6">Please enter a search term or select a tag.</p>;
  }

  if (isLoading) return <p className="text-gray-500 text-center py-6">Loading...</p>;
  if (isError) return <p className="text-red-500 text-center py-6">Error loading search results.</p>;
  if (inventories.length === 0) return <p className="text-gray-500 text-center py-6">No inventories found for "{query}".</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventories.map((inv) => (
          <div key={inv._id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            {inv.image && (
              <img src={inv.image} alt={inv.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{inv.title}</h3>
              {inv.description && (
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">{inv.description}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">By: {inv.creatorName || inv.creator?.name}</p>
              <Link
                to={`/inventory/${inv._id}`}
                className="mt-4 inline-block px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
