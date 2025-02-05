import Button from "./Button";
import axios from "axios";
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'

export const InventoryAddItem = ({ onClose }) => {
  const [itemName, setItemName] = useState([])
  const [formData, setFormData] = useState({
    "paper_type": {
      "paper_type": "",
      "price": null
    },
    "rim": null,
    "onHand": 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "rim") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: Number(value),
      }));
    } else if (name === "paper_type" || name === "price") {
      setFormData((prevData) => ({
        ...prevData,
        paper_type: {
          ...prevData.paper_type,
          [name]: name === "price" ? Number(value) : value,
        },
      }));
    }
  };

  const fetchItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/printinginventory/")
      const data = response.data;
      
      setItemName(data)
    }
    catch (err){
      console.error("Error fetching item:", err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/inventory/additem/", formData);
      const data = response.data;

      console.log("Added Item:", data);
      Swal.fire({
        title: "Added Item!",
        text: "You have Added an Item!",
        icon: "success"
      });
      onClose(); // Close the modal after adding the item
    } catch (e) {
      console.error("Error adding item:", e);
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} 
    >
      <div
        className="bg-white flex flex-col gap-6 w-full max-w-[600px] p-8 rounded-lg relative"
        style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)" }}
        onClick={(e) => e.stopPropagation()} 
      >
        <h1 className="text-center text-2xl font-bold text-[#17153a]">
          ADD <span className="text-yellow-500">INVENTORY</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="font-medium">Item Name</label>
              <input
                name="paper_type"
                value={formData.paper_type.paper_type}
                type="text"
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Category</label>
              <select
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              >
                <option value="Paper">Paper</option>
                <option value="Ink">Ink</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Ream</label>
              <input
                type="number"
                name="rim"
                value={formData.rim}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formData.paper_type.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-4 justify-end mt-6">
            <Button
              title="Save"
              style="bg-[#17153a] text-white px-6 py-2 rounded-md"
              type='submit'
            />
            <Button
              title="Cancel"
              style="bg-red-500 text-white px-6 py-2 rounded-md"
              onClick={onClose}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
