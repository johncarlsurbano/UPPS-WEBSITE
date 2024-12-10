import { GenericTable } from "../components/GenericTable";
import Button from "../components/Button";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { InventoryDetails } from '../components/InventoryDetails.jsx';
import { InventoryAddItem } from '../components/InventoryAddItem.jsx';
import { FilterRequest } from "../components/FilterRequest.jsx";

export const PrintingInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [onHandValue, setOnHandValue] = useState(null);
  const [priceValue, setPriceValue] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus ] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('')
  const [filteredItem, setFilteredItem] = useState([])
  const [filteredData, setFilteredData] = useState([])


  

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/printinginventory/');
      const data = response.data;
      console.log(data);

      setStatus([...new Set(data.map(item => item.status))]);

      const mappedInventory = data.map((inventoryDetails) =>
        InventoryDetails({
          inventoryDetails,
          onHandValue,
          isEditing: inventoryDetails.id === editItemId,
          handleEdit: () => handleEdit(inventoryDetails.id, inventoryDetails.onHand, inventoryDetails.paper_type.price) ,
          handleSave,
          handleOnHandChange,
          cancelEdit ,
          priceValue,
          handlePriceChange
        })
      );

      setInventory(mappedInventory);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (id, currentValue , currentPrice) => {
    setOnHandValue(currentValue)
    setPriceValue(currentPrice)
    setEditItemId(id);
    setIsEditing(true);
  };

  const handleOnHandChange = (value) => {
    setOnHandValue(value)
    
  };
  console.log(onHandValue)
  
  const handlePriceChange = (value) => {
    setPriceValue(value)
  };
  console.log(priceValue)

  const cancelEdit = () => {
    setIsEditing(false);
    setEditItemId(null);
    setOnHandValue(null);
  
  }

  console.log(priceValue)

  
  const handleSave = async (id, onHandValue, priceValue) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/updateinventory/printing/${id}/`, {
        paper_type: {
          price: priceValue
        },
        onHand: onHandValue
      });
      
     await fetchInventory(); 
    } catch (e) {
      console.error(e);
    }
    console.log('nasave')
    setIsEditing(false);
    setEditItemId(null); 
    setOnHandValue(null)
    setPriceValue(null); 
  };



  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  
  useEffect(() => {
    fetchInventory();
  }, [isEditing, onHandValue, priceValue]);

  useEffect(() => {
 
    const filteredData = inventory.filter((request) =>
      (selectedStatus ? request["Status"] === selectedStatus : true) &&
     (filteredItem ? request["Item Name"].toLowerCase().match(filteredItem) || request["Item Name"].match(filteredItem) : true)
  );  
    setFilteredData(filteredData)

  },[selectedStatus,filteredItem, inventory])

  

  const printingInventoryHeader = [
    "Item Name",
    "Item ID",
    "Category",
    "On-Hand",
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
              />
          </div>
          <Button
            title={"Add Item"}
            style={
              "bg-[#6fb84c] text-center h-[fit-content] px-[2rem] py-[1rem] rounded-[5px] self-end font-bold text-white"
            }
            onClick={toggleModal}
          ></Button>
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
    </div>
  );
};
