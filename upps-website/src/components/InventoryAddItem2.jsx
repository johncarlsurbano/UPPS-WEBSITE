import Button from "./Button";
import axios from "axios";
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'

export const InventoryAddItem2 = ({ onClose }) => {
  const [itemName, setItemName] = useState([])
  const [formData, setFormData] = useState({
    "paper_type": {
        "paper_type": ""
    },
    "onHand": null,
    "rim": null
  });

  const [paperType, setPaperType] = useState()
  const [rim, setRim] = useState()


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "rim" ? Number(value) : value,
    }));
  };

  console.log("This is Formdata",formData)

  const fetchItem = async (e) => {
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
        const response = await axios.post("http://127.0.0.1:8000/api/inventory/addream/", {
            "paper_type": {
                "paper_type": paperType
            },
            "onHand": null,
            "rim": rim
        });
        console.log("Updated Item:", response.data);
        Swal.fire({
          title: "Ream Added!",
          text: "Successfully updated the inventory.",
          icon: "success",
        });
        onClose();
      } catch (err) {
        console.error("Error updating inventory:", err);
        Swal.fire({
          title: "Error!",
          text: "Could not update inventory.",
          icon: "error",
        });
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
          ADD <span className="text-yellow-500">ITEM</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="font-medium">Item Name</label>
              <select
                name="paper_type"
                value={paperType}
                onChange={(e) => setPaperType(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                >
                {itemName.map((item) => {
                   return <option key={item.id} value={item.paper_type.paper_type}>
                    {item.paper_type.paper_type}
                    </option>

                })}
                </select>
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Category</label>
              <select
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              >
                <option value="Paper">Paper</option>
              </select>
            </div>
            <div className="flex flex-col mb-4">
                <label className="font-medium">Ream</label>
                <input
                type="number"
                name="rim"
                value={rim}
                onChange={(e) => setRim(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                />
            </div>
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
