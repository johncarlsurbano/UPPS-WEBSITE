export const PhysicalInventoryReportTable = ({ data }) => {
  return (
    <div className="inventory-table">
      <div className="inventory-table-content">
        <table className="border-solid border-[1px] border-b-0 w-full text-center border-collapse mt-4">
          <thead>
            <tr className="border-solid border-[1px]">
              <th className="border-solid border-[1px] py-2" rowSpan={2}>
                Article
              </th>
              <th className="border-solid border-[1px] py-2" rowSpan={2}>
                Description
              </th>
              <th className="border-solid border-[1px] py-2" rowSpan={2}>
                Stock Number
              </th>
              <th className="border-solid border-[1px] py-2" rowSpan={2}>
                Unit of <br />
                Measure
              </th>
              <th className="border-solid border-[1px] py-2" rowSpan={2}>
                Unit Value
              </th>
              <th className="border-solid border-[1px] py-2">
                Balance Per Card
              </th>
              <th className="border-solid border-[1px] py-2 px-[3rem]"></th>
              <th className="border-solid border-[1px] py-2">
                On Hand Per <br />
                ount
              </th>
              <th className="border-solid border-[1px] py-2">
                Shortage/Overage
              </th>
            </tr>
            <tr className="border-solid border-[1px]">
              <td className="border-solid border-[1px]">(Quantity)</td>
              <td className="border-solid border-[1px]" colSpan={2}>
                (Quantity)
              </td>
              <td className="border-solid border-[1px]">Value</td>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((row, rowIndex) => (
                Array.isArray(row) ? (
                  <tr key={rowIndex} className="physical-inventory-report-data">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border-solid border-[1px] py-2 px-4">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ) : (
                  <tr key={rowIndex}>
                    <td colSpan="9" className="text-center">Invalid data format</td>
                  </tr>
                )
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex gap-[20rem] w-[100%] max-w-[100%] border-solid border-[1px] border-t-0 pt-[2rem] pb-[2rem] pl-[1rem]">
          <div className="flex gap-2 text-center">
            <p>Certified Correct by:</p>
            <div>
              <p className="underline"><br/></p>
              <p>
                Signature over Printed Name of Inventory
                <br />
                Committee Chair and Members
              </p>
            </div>
          </div>
          <div className="flex gap-2 text-center">
            <p>Approved by:</p>
            <p></p>
            <div>
              <p className="underline"><br/></p>
              <p>
                Signature over Printed Name of Head of Agency/Entity or
                Authorized
                <br />
                Representative
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
