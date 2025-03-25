
import Button from '../components/Button.jsx';

export const WIPInventory = ({ WIPItem, generateStockCard }) => {
    const inventoryItem = WIPItem.inventory_item

    return {
      "Item Name": WIPItem.inventory_item_name|| "N/A",
      "Item ID": WIPItem.id || "N/A",
      Category: inventoryItem.category || "N/A",
      Unit: inventoryItem.unit || "N/A",
      "Unit Value" : inventoryItem.unit_value || "N/A",
      Stocks: WIPItem.balance_per_card,
      Status: WIPItem.status || "N/A",
      Action: (
        <Button
          title="Details"
          style="bg-navy px-[1rem] py-[0.2rem] text-white rounded-2"
          onClick={() => console.log("Details clicked for:", WIPItem.id)}
        />
      ),
      "Stock Card": (
        <Button
          title="Generate"
          style="bg-[#6fb84c] px-[1rem] py-[0.2rem] text-white rounded-2"
          onClick={() => generateStockCard(WIPItem.id)}
        />
      ),
    };
  };
  