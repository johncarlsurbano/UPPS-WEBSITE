    
    import { useSelector } from "react-redux";
    export const GenericTable = ({ headers, data, style, thStyle }) => {

      const sortedData = [...data].sort((a, b) => {
        if (a.isUrgent && !b.isUrgent) return -1; // Move urgent requests to top
        if (!a.isUrgent && b.isUrgent) return 1;
        return 0; // Keep the original order for non-urgent rows
      });
      
      return (
        <div className="generic-table flex justify-center">
          <div className="generic-table-main flex flex-col bg-white h-[500px] w-full max-w-[100%] rounded-lg overflow-auto shadow-lg mt-8 mb-40">
            <div className="generic-table-container flex flex-col w-full">
              <div className="generic-table-content flex flex-col w-full">
                <table className="w-full min-w-full border-collapse">
                  <thead>
                    <tr>
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          className={`px-8 py-4 text-left whitespace-nowrap overflow-hidden text-ellipsis sticky top-0  ${thStyle}`}
                          style={style}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((row, rowIndex) => (
                      <tr key={rowIndex} className={`${row.isUrgent ? 'bg-red-500 text-white' : ''}`}>
                        {headers.map((header, colIndex) => (
                          <td key={colIndex} className="px-8 py-4">
                            {typeof row[header] === "string" || typeof row[header] === "number" ? (
                              row[header]
                            ) : (
                              row[header] // This can render JSX components
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    };
