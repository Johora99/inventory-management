import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import SearchResults from "../../Components/SearchResults";
import useAllInventory from "../../Hooks/useAllInventory";
import LatestInventory from "../../Components/LatestInventory";

export default function Home() {
  const axiosSecure = useAxiosSecure();
  const [selectedTag, setSelectedTag] = useState(null);
 const { allInventory, isLoading, refetch } = useAllInventory()
 console.log(allInventory)
  // Fetch latest inventories
  const { data: latestInventories = [], isLoading: loadingLatest } = useQuery({
    queryKey: ["latestInventories"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/inventory/latest");
      return data; // array of inventories
    },
  });

  // Fetch top 5 popular inventories
  const { data: topInventories = [], isLoading: loadingTop } = useQuery({
    queryKey: ["topInventories"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/inventory/top");
      return data; // array of top inventories
    },
  });

  // Fetch all tags for tag cloud
  const { data: allTags = [], isLoading: loadingTags } = useQuery({
    queryKey: ["allTags"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/inventory/tags");
      return data; // array of tags
    },
  });

  if (selectedTag) {
    return (
      <div className="p-6">
        <button
          onClick={() => setSelectedTag(null)}
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back
        </button>
        <SearchResults query={selectedTag} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-12">
      {/* Latest Inventories Table */}
      <section>
      <LatestInventory />
      </section>

      {/* Top 5 Popular Inventories */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Top 5 Popular Inventories</h2>
        {loadingTop ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Item Count</th>
              </tr>
            </thead>
            <tbody>
              {topInventories.map((inv) => (
                <tr key={inv._id} className="hover:bg-gray-50">
                  <td className="border p-2">{inv.title}</td>
                  <td className="border p-2">{inv.itemCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Tag Cloud */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Tags</h2>
        {loadingTags ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
