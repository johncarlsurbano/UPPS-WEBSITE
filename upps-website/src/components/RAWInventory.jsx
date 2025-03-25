
import Button from '../components/Button.jsx';
export const RAWInventory = ({ RAWItem, generateStockCard }) => {
    const inventoryItem = RAWItem.inventory_item

    return {
      "Item Name": RAWItem.inventory_item_name|| "N/A",
      "Item ID": RAWItem.id || "N/A",
      Category: inventoryItem.category || "N/A",
      Unit: inventoryItem.unit || "N/A",
      "Unit Value" : inventoryItem.unit_value || "N/A",
      Stocks: RAWItem.stock_quantity,
      Status: RAWItem.status || "N/A",
      Action: (
        <Button
          title="Details"
          style="bg-navy px-[1rem] py-[0.2rem] text-white rounded-2"
          onClick={() => console.log("Details clicked for:", RAWItem.id)}
        />
      ),
      "Stock Card": (
        <Button
          title="Generate"
          style="bg-[#6fb84c] px-[1rem] py-[0.2rem] text-white rounded-2"
          onClick={() => generateStockCard(RAWItem.id)}
        />
      ),
    };
  };
  