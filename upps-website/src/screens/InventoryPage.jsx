import { useParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { HeaderLoggedIn } from "../components/HeaderLoggedIn";
import { InventoryTable } from "../components/InventoryTable";
import { RawMaterialsInventory } from "../components/RawMaterialsInventory";

export const InventoryPage = () => {
  const { type } = useParams(); // Get the "type" from the URL

  const isRawMaterialsInventory = type === "RMIInventory";

  return (
    <div className="inventory-page flex flex-col">
      <HeaderLoggedIn />
      {/* <div className="flex flex-col w-full max-w-[1200px] m-auto my-0 gap-5">
        <h1 className="text-navy text-[clamp(1.5rem,3vw,3rem)] font-bold mt-[5rem]">
          {isRawMaterialsInventory ? "Raw Materials Inventory" : "Work In Process Inventory"}
        </h1>
        {isRawMaterialsInventory ? <RawMaterialsInventory /> : <InventoryTable />}
      </div> */}
      <div className="flex flex-col w-full max-w-[1200px] m-auto my-0 gap-5">
        <h1 className="text-navy text-[clamp(1.5rem,3vw,3rem)] font-bold mt-[5rem]">
          Inventory
        </h1>
        <InventoryTable />
      </div>
      <Footer />
    </div>
  );
};
