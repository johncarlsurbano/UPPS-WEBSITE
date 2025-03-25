export const InventoryReportHeader = ({
  headerInventoryReport,
  fundCluster,
  accountableOfficer,
  accountableOfficerRole,
  officialDesignation,
  entityName,
  inventoryName
}) => {
  // Function to get the last date of the current month
  const getLastDateOfMonth = () => {
    const today = new Date();
    const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="inventory-report-header flex flex-col">
      <div className="flex flex-col inventory-report-header-content w-[1400px] max-w-[100%] m-0 mx-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-center">
            {headerInventoryReport} REPORT ON THE PHYSICAL COUNT OF INVENTORIES
            <br />
            {inventoryName}
          </h1>
          <div className="flex gap-1 items-center">
            <p>As of</p>
            <p>{getLastDateOfMonth()}</p>
          </div>
          <p>Printing Press</p>
        </div>
        <div className="flex gap-1 mb-2 mt-[3rem]">
          <p>Fund Cluster:</p>
          <p>{fundCluster}</p>
        </div>
        <div className="flex gap-[1rem]">
          <p>For which</p>
          <div className="flex flex-col items-center">
            <p className="underline">{accountableOfficer},</p>
            <p>(Name of Accountable Officer)</p>
          </div>
          <p className="underline">{accountableOfficerRole}</p>
          <div className="flex flex-col items-center">
            <p className="underline">{officialDesignation}</p>
            <p>(Official Designation)</p>
          </div>
          <p>is accountable, having assumed such accountability on</p>
          <div className="flex flex-col items-center">
            <p className="underline">{entityName}</p>
            <p>(Entity Name)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
