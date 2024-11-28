    
    import { useSelector } from "react-redux";
    export const GenericTable = ({ headers, data, style, thStyle }) => {

      
      
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
                    {data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
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
