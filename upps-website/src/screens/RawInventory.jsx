import { InventoryReportHeader } from "../components/InventoryReportHeader";
import { PhysicalInventoryReportTable } from "../components/PhysicalReportInventoryTable";
import axios from "axios";
import { useState, useEffect } from "react";

export const RawInventory = () => {
  const inventoryData = [
    ["Item 1", "Description 1", "SN001", "Piece", "$10", "50", "", "48", "-2"],
  ];
  
  const [rawInventory, setRawInventory] = useState([]);

  const fetchRawInventory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/raw-materials/");

      const formattedData = response.data.map((item) => [
        " ", // Article (Item Name)
        item.inventory_item.name || "N/A", // Description (Category)
        "",
        item.inventory_item.unit || "N/A", // Unit of Measure
        item.inventory_item.unit_value || "N/A", // Unit Value
        item.inventory_item.balance_per_card || "N/A", // Balance Per Card (Quantity)
        item.inventory_item.unit_value * item.inventory_item.balance_per_card, // TOTAL 
        "", // On Hand Per Count (Quantity)
        "", // Shortage/Overage
      ]);
  
  
      setRawInventory(formattedData);
    } catch (error) {
      console.error("Error fetching WIP inventory:", error);
    }
  };

  useEffect(() => {
    fetchRawInventory();
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
          inventoryName="Raw Inventory"
        />
        <PhysicalInventoryReportTable data={rawInventory} />
      </div>
    </div>
  );
};
