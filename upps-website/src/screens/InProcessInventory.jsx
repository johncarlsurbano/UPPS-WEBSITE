import { InventoryReportHeader } from "../components/InventoryReportHeader";
import { PhysicalInventoryReportTable } from "../components/PhysicalReportInventoryTable";
import axios from "axios";
import { useState, useEffect } from "react";

export const InProcessInventory = () => {
  const inventoryData = [
    ["Item 1", "Description 1", "SN001", "Piece", "$10", "50", "", "48", "-2"],
  ];
  
  const [wipInventory, setWipInventory] = useState([]);

  const fetchWipInventory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/work-in-process/");

      const formattedData = response.data.map((item) => [
        " ", // Article (Item Name)
        item.inventory_item.name || "N/A", // Description (Category)
        "",
        item.inventory_item.unit || "N/A", // Unit of Measure
        item.inventory_item.unit_value || "N/A", // Unit Value
        item.balance_per_card || "N/A", // Balance Per Card (Quantity)
        item.inventory_item.unit_value * item.balance_per_card, // TOTAL 
        "", // On Hand Per Count (Quantity)
        "", // Shortage/Overage
      ]);
  
  
      setWipInventory(formattedData);
    } catch (error) {
      console.error("Error fetching WIP inventory:", error);
    }
  };

  useEffect(() => {
    fetchWipInventory();
  }, [])
  

  return (
    <div className="work-inprocess-inventory flex flex-col pt-[5rem]">
      <div className="flex flex-col work-inprocess-inventory-content m-0 mx-auto">
        {/* Passing required props to InventoryReportHeader */}
        <InventoryReportHeader
          headerInventoryReport=""
          fundCluster="Business Type Income"
          accountableOfficer="Ambrosio B. Cultura II"
          accountableOfficerRole="President"
          officialDesignation="USTP-SYSTEM"
          entityName="Sample Entity"
          inventoryName="Work-In-Process Inventory"
        />
        <PhysicalInventoryReportTable data={wipInventory} />
      </div>
    </div>
  );
};
