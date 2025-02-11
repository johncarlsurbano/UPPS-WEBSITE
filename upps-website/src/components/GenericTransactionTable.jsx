import { useState } from "react";

export const GenericTransactionTable = ({
  headers,
  data,
  thStyle,
  tableStyle,
  trStyle,
  editableFields = [], // Array of fields that should be editable
}) => {
  const [tableData, setTableData] = useState(data);

  const handleInputChange = (rowIndex, field, value) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][field] = value;
    setTableData(updatedData);
  };

  return (
    <div className="generic-table flex justify-center">
      <div className={tableStyle}>
        <div className="generic-table-container flex flex-col w-full">
          <div className="generic-table-content flex flex-col w-full">
            <table className="w-full min-w-full border-collapse">
              <thead>
                <tr className={trStyle}>
                  {headers.map((header, index) => (
                    <th key={index} className={thStyle}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => {
                  if (
                    row["DATE RECEIVE OR ISSUED"] === "Balance Carried Forward"
                  ) {
                    return (
                      <tr key={rowIndex}>
                        <td
                          colSpan={3}
                          className="px-2 py-2 border-[1px] border-black text-center"
                        >
                          {row["DATE RECEIVE OR ISSUED"]}
                        </td>
                        <td className="px-2 py-2 border-[1px] border-black text-center">
                          {row["Quantity Received"]}
                        </td>
                        <td className="px-2 py-2 border-[1px] border-black text-center">
                          {row["Quantity Issued"]}
                        </td>
                        <td className="px-2 py-2 border-[1px] border-black text-center">
                          {row["Quantity On Hand"]}
                        </td>
                        <td className="px-2 py-2 border-[1px] border-black text-center">
                          {row.REMARKS}
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr key={rowIndex}>
                        {headers.map((header, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-2 py-2 border-[1px] border-black text-center"
                          >
                            {editableFields.includes(header) ? (
                              <input
                                type="text"
                                value={row[header] || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    rowIndex,
                                    header,
                                    e.target.value
                                  )
                                }
                                className="w-full border-none text-center bg-transparent"
                              />
                            ) : (
                              row[header] || ""
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
