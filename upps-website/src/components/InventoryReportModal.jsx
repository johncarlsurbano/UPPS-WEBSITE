import Button from "./Button.jsx";

export const InventoryReportModal = ({ closeModal }) => {
  return (
    <div className="inventory-report-modal flex flex-col items-center justify-center  h-[100vh]">
      <div className="inventory-report-modal-content bg-white flex flex-col max-w-[600px] w-full items-center justify-between h-[300px] p-[2rem] rounded-[10px]">
        <h1>Generate Inventory Report</h1>
        <div>
          <select
            name="Select Month"
            id=""
            className="px-[2rem] py-[0.5rem] rounded-[5px] font-bold"
          >
            <option>January, 2025</option>
            <option>February, 2025</option>
            <option>March, 2025</option>
          </select>
        </div>
        <div className="self-end flex gap-[1.5rem]">
          <Button
            title={"Back"}
            style={
              "bg-blue-500 text-center h-[fit-content] px-[2rem] py-[0.5rem] rounded-[5px] self-end font-bold text-white hover:bg-navy"
            }
            onClick={closeModal}
          ></Button>
          <Button
            title={"Generate"}
            style={
              "bg-navy text-center h-[fit-content] px-[2rem] py-[0.5rem] rounded-[5px] self-end font-bold text-white hover:bg-navy"
            }
          ></Button>
        </div>
      </div>
    </div>
  );
};
