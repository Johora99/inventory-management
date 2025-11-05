import React from 'react';
import useAllInventory from '../Hooks/useAllInventory';

export default function LatestInventory() {
  const { allInventory = [], isLoading, refetch } = useAllInventory();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading inventories...</p>
        </div>
      </div>
    );
  }

  // Take only first 5 inventories
  const latestFive = allInventory.slice(0, 5);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Latest Inventories</h2>
          <p className="text-gray-600">View the most recent inventory additions</p>
        </div>

        {/* Table Container with Shadow and Border */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-teal-600 to-teal-500 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Description / Image
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Creator
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {latestFive.length > 0 ? (
                  latestFive.map((inv, index) => (
                    <tr 
                      key={inv._id} 
                      className="hover:bg-teal-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold mr-3">
                            {index + 1}
                          </div>
                          <span className="text-gray-800 font-medium">{inv.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {inv.description ? (
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {inv.description.slice(0, 80)}
                            {inv.description.length > 80 ? '...' : ''}
                          </p>
                        ) : inv.image ? (
                          <img 
                            src={inv.image} 
                            alt={inv.title} 
                            className="w-20 h-20 object-cover rounded-lg shadow-md border-2 border-gray-200"
                          />
                        ) : (
                          <span className="text-gray-400 italic">No description or image</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-2">
                            {inv.createdBy?.fullName?.charAt(0) || 'U'}
                          </div>
                          <span className="text-gray-700">
                            {inv.createdBy ? inv.createdBy.fullName : 'Unknown'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <svg 
                          className="w-16 h-16 text-gray-300 mb-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                          />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium">No inventories found</p>
                        <p className="text-gray-400 text-sm mt-1">Check back later for new additions</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        {latestFive.length > 0 && (
          <div className="mt-4 text-center text-gray-500 text-sm">
            Showing {latestFive.length} of {allInventory.length} total inventories
          </div>
        )}
      </div>
    </div>
  );
}