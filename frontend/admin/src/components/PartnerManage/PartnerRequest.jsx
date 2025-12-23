import React, { useState } from "react";
import usePartners from "../../hooks/usePartner";
import { TbListDetails } from "react-icons/tb";
import { GiCancel } from "react-icons/gi";
import { SiTicktick } from "react-icons/si";
import { FaSort } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const PartnerRequest = () => {
  const [page, setPage] = useState(1);
  const [selectedRegisPartner, setSelectedRegisPartner] = useState(null);
  const [selectedCheckBox, setSelectedCheckBox] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("asc");
  const [searchKey, setSearchKey] = useState("");

  const {
    partners = [],
    loading,
    error,
    totalPages,
    approvePartner,
    denyPartner,
  } = usePartners("regispartner", page, fieldSort, orderSort, searchKey);

  const handleSort = (field) => {
    setOrderSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setFieldSort(field);
  };

  const handleApprove = () => {
    if (selectedCheckBox.length === 0) {
      alert("Please select at least one account.");
      return;
    }
    if (window.confirm("Are you sure you want to approve selected accounts")) {
      approvePartner(selectedCheckBox);
      setSelectedCheckBox([]);
    }
  };

  const handleDeny = () => {
    if (selectedCheckBox.length === 0) {
      alert("Please select at least one account.");
      return;
    }
    if (window.confirm("Are you sure you want to deny selected accounts")) {
      denyPartner(selectedCheckBox);
      setSelectedCheckBox([]);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedRegisPartner(user);
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedRegisPartner(null);
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

  return (
    <div className="p-4 bg-white rounded-lg">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex items-center">
        <select
          className="border border-black p-2 mb-4"
          defaultValue="choose"
          onChange={(e) => {
            if (e.target.value === "approve") {
              handleApprove();
              e.target.value === "choose";
            }
            if (e.target.value === "deny") {
              handleDeny();
              e.target.value === "choose";
            }
          }}
        >
          <option value="choose" disabled>
            Choose action...
          </option>
          <option value="approve">Approve to partner</option>
          <option value="deny">Deny request partners</option>
        </select>
        <div className="w-full flex border-2 border-gray-200 mb-4 p-1 ml-4">
          <div className="flex w-full mx-10 rounded bg-white">
            <input
              className=" w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
              type="search"
              name="search"
              placeholder="Search by username..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button type="submit" className="m-2 rounded text-blue-600">
              <FaSearch />
            </button>
          </div>
        </div>
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
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Username <FaSort onClick={() => handleSort("username")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Email <FaSort onClick={() => handleSort("email")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Phone <FaSort onClick={() => handleSort("phone")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Address <FaSort onClick={() => handleSort("address")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(partners) && partners.length > 0 ? (
              partners.map((user) => (
                <tr key={user._id} className="border">
                  <td className="text-sm px-4 py-2 text-center">
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

      {isPopupOpen && selectedRegisPartner && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">User Details</h2>
            <div className="flex justify-center mb-4">
              <img
                src={selectedRegisPartner.avatar_url}
                alt="Avatar"
                className="rounded-full h-24 w-24"
              />
            </div>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border px-4 py-2 font-bold">Name</td>
                  <td className="border px-4 py-2">
                    {selectedRegisPartner.name}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Email</td>
                  <td className="border px-4 py-2">
                    {selectedRegisPartner.email}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Phone</td>
                  <td className="border px-4 py-2">
                    {selectedRegisPartner.phone}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Address</td>
                  <td className="border px-4 py-2">
                    {selectedRegisPartner.address}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={closePopup}
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

export default PartnerRequest;
