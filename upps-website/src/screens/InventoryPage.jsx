import { Footer } from "../components/Footer";
import { HeaderLoggedIn } from "../components/HeaderLoggedIn";
import { InventoryTable } from "../components/InventoryTable";

export const InventoryPage = () => {
  return (
    <div className="inventory-page flex flex-col">
      <HeaderLoggedIn />
      <div className="flex flex-col w-full max-w-[1200px] m-auto my-0 gap-5">
        <h1 className="text-navy text-[clamp(1.5rem,3vw,3rem)] font-bold mt-[5rem]">
          Printing Inventory
        </h1>
        <InventoryTable />
      </div>
      <div className="flex flex-col w-full max-w-[1200px] m-auto my-0 gap-5">
        <h1 className="text-navy text-[clamp(1.5rem,3vw,3rem)] font-bold">
          Book Binding Inventory
        </h1>
        <InventoryTable />
      </div>
      <div className="flex flex-col w-full max-w-[1200px] m-auto my-0 gap-5">
        <h1 className="text-navy text-[clamp(1.5rem,3vw,3rem)] font-bold">
          Lamination Inventory
        </h1>
        <InventoryTable />
      </div>
      <Footer />
    </div>
  );
};