import React, { useState } from "react";
import usePartners from "../../hooks/usePartner";
import { TbListDetails } from "react-icons/tb";
import { GiCancel } from "react-icons/gi";

const PartnerList = () => {
  const [page, setPage] = useState(1);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedCheckBox, setSelectedCheckBox] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const {
    partners = [],
    loading,
    error,
    totalPages,
    deletePartner,
  } = usePartners("partner", page);

  const handleDeleteRolePartner = () => {
    if (selectedCheckBox.length === 0) {
      alert("Please select at least one account.");
      return;
    }
    if (window.confirm("Are you sure you want to deny selected accounts")) {
      deletePartner(selectedCheckBox);
      setSelectedCheckBox([]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCheckBox(partners.map((partner) => partner._id));
    } else {
      setSelectedCheckBox([]);
    }
  };

  const handleSelectOne = (partnerId) => {
    setSelectedCheckBox((prev) =>
      prev.includes(partnerId)
        ? prev.filter((id) => id != partnerId)
        : [...prev, partnerId]
    );
  };

  const handleViewDetails = (user) => {
    setSelectedPartner(user);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedPartner(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="">
        <select
          className="border border-black p-2 mb-4"
          defaultValue="choose"
          onChange={(e) => {
            if (e.target.value === "deleteRolePartners") {
              handleDeleteRolePartner();
              e.target.value === "choose";
            }
          }}
        >
          <option value="choose" disabled>
            Choose action...
          </option>
          <option value="deleteRolePartners">
            Delete selected role partners
          </option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
                <input
                  type="checkbox"
                  checked={
                    partners.length > 0 &&
                    selectedCheckBox.length === partners.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-2 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(partners) && partners.length > 0 ? (
              partners.map((user) => (
                <tr key={user._id} className="border">
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCheckBox.includes(user._id)}
                      onChange={() => handleSelectOne(user._id)}
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {user.username}
                  </td>
                  <td className="border px-2 py-2 text-center">{user.email}</td>
                  <td className="border px-4 py-2 text-center">{user.phone}</td>
                  <td className="border px-4 py-2 text-center">
                    {user.address}
                  </td>
                  <th className="border px-4 py-2">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      <TbListDetails />
                    </button>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  No users available.
                  {console.log(partners)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="px-3 py-1 mx-2">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {isPopupOpen && selectedPartner && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">User Details</h2>
            <div className="flex justify-center mb-4">
              <img
                src={selectedPartner.avatar_url}
                alt="Avatar"
                className="rounded-full h-24 w-24"
              />
            </div>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border px-4 py-2 font-bold">Name</td>
                  <td className="border px-4 py-2">{selectedPartner.name}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Email</td>
                  <td className="border px-4 py-2">{selectedPartner.email}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Phone</td>
                  <td className="border px-4 py-2">{selectedPartner.phone}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Address</td>
                  <td className="border px-4 py-2">
                    {selectedPartner.address}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closePopup}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerList;
