import { GenericTable } from "../components/GenericTable.jsx";

import Button from '../components/Button.jsx';
import axios from "axios";
import { useState, useEffect } from "react";
import { InventoryDetails } from "../components/InventoryDetails.jsx";
import { InventoryAddItem2} from "../components/InventoryAddItem2.jsx";
import { InventoryAddItem } from "./InventoryAddInventory.jsx";
import { FilterRequest } from "../components/FilterRequest.jsx";

export const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newPaperType, setNewPaperType] = useState("");
  const [editItemId, setEditItemId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [status, setStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredItem, setFilteredItem] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/printinginventory/"
      );
      const data = response.data;
      console.log(data);

      setStatus([...new Set(data.map((item) => item.status))]);

      const mappedInventory = data.map((inventoryDetails) =>
        InventoryDetails({
          inventoryDetails,
          newPaperType,
          isEditing: inventoryDetails.id === editItemId,
          handleEdit: () =>
            handleEdit(
              inventoryDetails.id,
              inventoryDetails.paper_type.paper_type
            ),
          handleSave,
          handleOnChangePaperType,
          cancelEdit,
          handleDelete
        })
      );

      setInventory(mappedInventory);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (id, currentPaperType) => {
    setNewPaperType(currentPaperType);
    setEditItemId(id);
    setIsEditing(true);
  };

  const handleOnChangePaperType = (value) => {
    setNewPaperType(value);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditItemId(null);
    setNewPaperType("");
  };


  const handleSave = async (id, updatedPaperType) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/updateinventory/printing/${id}/`,
        {
          paper_type: {
            paper_type: updatedPaperType,
          },
        }
      );

      await fetchInventory();
    } catch (e) {
      console.error(e);
    }
    setIsEditing(false);
    setEditItemId(null);
    setNewPaperType("");
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
    
  };
  const toggleAddItemModal = () => {
    setAddItemModalOpen(!addItemModalOpen)
  }

  useEffect(() => {
    
    fetchInventory();
    const interval = setInterval(fetchInventory, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [isEditing, newPaperType]);

  useEffect(() => {
    const filteredData = inventory.filter((request) => {
      // Convert JSX to a string if needed
      const itemName = typeof request["Item Name"] === "string" 
        ? request["Item Name"] 
        : request["Item Name"].props?.value || ""; // Extract value if it's an input
  
      return (
        (selectedStatus ? request["Status"] === selectedStatus : true) &&
        (filteredItem && typeof filteredItem === "string"
          ? itemName.toLowerCase().includes(filteredItem.toLowerCase())
          : true)
      );
    });
    setFilteredData(filteredData);
  }, [selectedStatus, filteredItem, inventory]);
  

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/deleteinventory/${id}/`
      );
      const data = response.data;
      console.log("Deleted data: " + data);
      await fetchInventory();
    } catch (e) {
      console.error(e);
    }
  };

  const printingInventoryHeader = [
    "Item Name",
    "Item ID",
    "Category",
    "Ream",
    "Price",
    "Updated",
    "Status",
    "Action",
  ];

  return (
    <div className="printing-inventory flex">
      <div className="printing-inventory-content flex flex-col w-full max-w-[1300px] m-auto my-0">
        <div className="flex w-full max-w-[100%] justify-between">
          <div className="flex justify-between w-full  max-w-[40rem]">
            <div className="flex flex-col gap-2">
              <p>Search</p>
              <input
                type="text"
                className="py-[1rem] pl-[1rem] border-black border-[1px] rounded-[5px]"
                placeholder="Search..."
                onChange={(e) => setFilteredItem(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>Category</p>
              <select
                name=""
                id=""
                className="px-[2rem] py-[1rem] rounded-[5px]"
                style={{ boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)" }}
              >
                <option value="">Paper</option>
                <option value="">Ink</option>
              </select>
            </div>
            <FilterRequest
              title="Status"
              selectVal={selectedStatus}
              options={status}
              handleSelectChange={setSelectedStatus}
              style={'mb-2'}
            />
          </div>
          <div className="flex gap-[1rem]">
          <Button
            title={"Add Inventory"}
            style={
              "bg-[#6fb84c] text-center h-[fit-content] px-[2rem] py-[1rem] rounded-[5px] self-end font-bold text-white"
            }
            onClick={toggleModal}
          ></Button>
          <Button
            title={"Add Item"}
            style={
              "bg-blue-500 text-center h-[fit-content] px-[2rem] py-[1rem] rounded-[5px] self-end font-bold text-white"
            }
            onClick={toggleAddItemModal}
          ></Button>
          </div>
        </div>

        <GenericTable
          headers={printingInventoryHeader}
          data={filteredData}
          thStyle={"text-white bg-[#18163a]"}
        ></GenericTable>
      </div>
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <InventoryAddItem onClose={toggleModal} />
        </div>
      )}

      {addItemModalOpen && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <InventoryAddItem2 onClose={toggleAddItemModal} />
        </div>
      )}
    </div>
  );
};
