import { GenericTable } from "../components/GenericTable.jsx";

import Button from "../components/Button.jsx";
import axios from "axios";
import { useState, useEffect } from "react";
import { InventoryDetails } from "../components/InventoryDetails.jsx";
import { InventoryAddItem2 } from "../components/InventoryAddItem2.jsx";
import { InventoryAddItem } from "./InventoryAddInventory.jsx";
import { FilterRequest } from "../components/FilterRequest.jsx";
import { WIPInventory } from "./WIPInventory.jsx";
import { RAWInventory } from "./RAWInventory.jsx";
import { InventoryReportModal } from "./InventoryReportModal.jsx";

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

  const [wipInventory, setWipInventory] = useState([]);
  const [rawInventory, setRawInventory] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const fetchWipInventory = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/work-in-process/"
      );
      const data = response.data;

      const mappedWIPInventory = data.map(
        (wipItem) =>
          WIPInventory({
            WIPItem: wipItem,
            generateStockCard,
          }) // Call as a function, NOT JSX
      );

      setWipInventory(mappedWIPInventory);
    } catch (error) {
      console.error("Error fetching WIP inventory:", error);
    }
  };

  const fetchRawInventory = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/raw-materials/"
      );
      const data = response.data;

      const mappedRawInventory = data.map((rawItem) =>
        RAWInventory({
          RAWItem: rawItem,
          generateStockCard,
        })
      );

      setRawInventory(mappedRawInventory);
    } catch (error) {
      console.log("Error fetching raw inventory:", error);
    }
  };

  useEffect(() => {
    fetchWipInventory();
    fetchRawInventory();
  }, []);

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
          handleDelete,
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

  const generateStockCard = (itemId) => {
    window.open(`/stockcard?id=${itemId}`, "_blank");
  };

  const generateWIPInventory = () => {
    setShowModal(!showModal);
    console.log(showModal);
  };

  const generateRAWInventory = () => {
    window.open(`/RawInventory`, "_blank");
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  const toggleAddItemModal = () => {
    setAddItemModalOpen(!addItemModalOpen);
  };

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(fetchInventory, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [isEditing, newPaperType]);

  useEffect(() => {
    const filteredData = inventory.filter((request) => {
      // Convert JSX to a string if needed
      const itemName =
        typeof request["Item Name"] === "string"
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

  const rawInventoryHeader = [
    "Item Name",
    "Item ID",
    "Category",
    "Unit",
    "Unit Value",
    "Stocks",
    "Status",
    "Action",
    "Stock Card",
  ];

  const rawData = [
    {
      "Item Name":
        "Looseleaf colore printing of inside pages of various unversity report/manuals, journals, brochures and others",
      "Item ID": "001",
      Category: "Paper",
      Unit: "Ream",
      Price: "100",
      Updated: "2022-01-15",
      Status: "Available",
      Action: (
        <Button
          title={"Details"}
          style={"bg-navy px-[1rem] py-[0.2rem] text-white rounded-2"}
          handleClick={() => handleDelete(1)}
        />
      ),
      "Stock Card": (
        <Button
          title={"Generate"}
          style={"bg-[#6fb84c] px-[1rem] py-[0.2rem] text-white rounded-2"}
          handleClick={() => generateStockCard(1)}
        />
      ),
    },
  ];

  const workInData = [
    {
      "Item Name": "Ink Cart, Epson C1T66300 (T6643) Magenta",
      "Item ID": "001",
      Category: "Paper",
      Unit: "Ream",
      Price: "100",
      Updated: "2022-01-15",
      Status: "Available",
      Action: (
        <Button
          title={"Details"}
          style={"bg-navy px-[1rem] py-[0.2rem] text-white rounded-2"}
          handleClick={() => handleDelete(1)}
        />
      ),
      "Stock Card": (
        <Button
          title={"Generate"}
          style={"bg-[#6fb84c] px-[1rem] py-[0.2rem] text-white rounded-2"}
          handleClick={() => generateStockCard(1)}
        />
      ),
    },
  ];

  return (
    <div className="printing-inventory flex flex-col">
      <div className="work-in-process-inventory-content flex flex-col w-full max-w-[1300px] m-auto my-0">
        <h1 className="text-navy text-[clamp(1.5rem,3vw,3rem)] font-bold mb-20 mt-20">
          Work In Process
        </h1>
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
              style={"mb-2"}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <GenericTable
            headers={rawInventoryHeader}
            data={wipInventory}
            thStyle={"text-white bg-[#18163a]"}
          ></GenericTable>
          <Button
            title={"Generate WIP Inventory Report"}
            style={
              "bg-blue-500 text-center h-[fit-content] px-[2rem] py-[1rem] rounded-[5px] self-end font-bold text-white hover:bg-navy"
            }
            onClick={generateWIPInventory}
          ></Button>
        </div>
        {showModal && (
          <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <InventoryReportModal closeModal={generateWIPInventory}>
              {" "}
            </InventoryReportModal>
          </div>
        )}
      </div>
      <div className="raw-material-inventory-content flex flex-col w-full max-w-[1300px] m-auto my-0">
        <h1 className="text-navy text-[clamp(1.5rem,3vw,3rem)] font-bold mb-20 mt-20">
          Raw Material
        </h1>
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
              style={"mb-2"}
            />
          </div>
          <div className="flex gap-[1rem]">
            <Button
              title={"Add Inventory"}
              style={
                "bg-[#6fb84c] text-center h-[fit-content] px-[2rem] py-[1rem] rounded-[5px] self-end font-bold text-white hover:bg-[#006400]"
              }
              onClick={toggleModal}
            ></Button>
            <Button
              title={"Add Item"}
              style={
                "bg-blue-500 text-center h-[fit-content] px-[2rem] py-[1rem] rounded-[5px] self-end font-bold text-white hover:bg-navy"
              }
              onClick={toggleAddItemModal}
            ></Button>
            <Button
              title={"Transfer Item"}
              style={
                "bg-[#f7b41f] text-center h-[fit-content] px-[2rem] py-[1rem] rounded-[5px] self-end font-bold text-white hover:bg-[#006400]"
              }
              onClick={toggleModal}
            ></Button>
          </div>
        </div>

        <div className="flex flex-col">
          <GenericTable
            headers={rawInventoryHeader}
            data={rawInventory}
            thStyle={"text-white bg-[#18163a]"}
          ></GenericTable>
          <div className="flex align-self-end gap-10">
            <Button
              title={"Generate Finished Goods"}
              style={
                "bg-[#6fb84c] text-center h-[fit-content] px-[2rem] py-[1rem] rounded-[5px] self-end font-bold text-white hover:bg-navy"
              }
              onClick={generateRAWInventory}
            ></Button>
            <Button
              title={"Generate Raw Inventory Report"}
              style={
                "bg-blue-500 text-center h-[fit-content] px-[2rem] py-[1rem] rounded-[5px] self-end font-bold text-white hover:bg-navy"
              }
              onClick={generateRAWInventory}
            ></Button>
          </div>
        </div>
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
