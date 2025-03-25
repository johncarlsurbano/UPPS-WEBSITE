import React, { useEffect, useState } from "react";
import axios from 'axios';


const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

// Reusable Table Row Component
const RawPortraitDataRow = ({ data, className, showDate }) => {
  return (
    <tr className={className}>
      <td className="border-black border-[1px] text-center">{showDate ? showDate:""}</td> 
      <td className="border-black border-[1px] text-center">{data.responsibility_center_code || ""}</td>
      <td className="border-black border-[1px] text-center">{data.stock_number || ""}</td>
      <td className="border-black border-[1px] text-start pl-[10px]">{data.item}</td>
      <td className="border-black border-[1px] text-center">{data.unit}</td>
      <td className="border-black border-[1px] text-center">{data.quantity_issued}</td>
      <td className="border-black border-[1px] text-end pr-[10px]">{data.unit_cost}</td>
      <td className="border-black border-[1px] text-end pr-[10px]">{data.amount}</td>
      <td className="border-black border-[1px] text-center">{data.or_number || ""}</td>
    </tr>
  );
};

const RecapRow = ({ data }) => {
  return (
    <tr className="raw-portrait-data-2">
      <td className="border-black border-[1px] text-center"></td> 
      <td className="border-black border-[1px] text-center">{data.stock_number || ""}</td>
      <td className="border-black border-[1px] text-center">{data.quantity_issued}</td> {/* Same as Quantity Issued */}
      <td className="border-black border-[1px] text-start pl-[10px]">{data.item}</td>
      <td className="border-black border-[1px] text-center">{data.unit}</td>
      <td className="border-black border-[1px] text-end pr-[10px]">{data.unit_cost}</td> {/* Same as Unit Cost */}
      <td className="border-black border-[1px] text-end pr-[10px]">{data.amount}</td>
      <td className="border-black border-[1px] text-center">{data.account_code || ""}</td>
      <td className="border-black border-[1px] text-center">{data.remarks || ""}</td>
    </tr>
  );
};


// Main Component
export const RawPortrait = () => {
  const [data, setData] = useState([]);
  const [firstDay, setFirstDay] = useState("");
  const [lastDay, setLastDay] = useState("");
  
  
  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/items-issued-month/report");
      setData(response.data);

      if (response.data.length > 0) {
        setFirstDay(formatDate(response.data[0].first_day));
        setLastDay(formatDate(response.data[0].last_day));
      }

    } catch (error) {
      console.error("Failed to fetch data from API", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="raw-portrait flex flex-col">
      <div className="raw-portrait-content flex flex-col m-0 mx-auto w-[1000px] max-w-[100%] text-center">
        <p className="mb-[3rem] font-bold">REPORT OF SUPPLIES AND MATERIALS ISSUED</p>
        <div className="mb-[3rem] font-bold">
          <p>PRINTING PRESS</p>
          <p>RAW MATERIALS</p>
        </div>
        <table className="border-black border-[1px] w-[100%] max-w-[100%]">
          <thead>
            <tr>
              <th className="border-black border-[1px] text-center px-[1rem] font-normal">Date</th>
              <th className="border-black border-[1px] text-center font-normal">Responsibility Center Code</th>
              <th className="border-black border-[1px] text-center font-normal">Stock No.</th>
              <th className="border-black border-[1px] text-center px-[1.5rem] font-normal">Item</th>
              <th className="border-black border-[1px] text-center px-[1rem] font-normal">Unit</th>
              <th className="border-black border-[1px] text-center font-normal">Quantity Issued</th>
              <th className="border-black border-[1px] text-center font-normal">Unit Cost</th>
              <th className="border-black border-[1px] text-center font-normal">Amount</th>
              <th className="border-black border-[1px] text-center font-normal">OR No.</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 && (
              <RawPortraitDataRow data={data[0]} className="raw-portrait-data" showDate={firstDay} />
            )}
            {data.length > 1 && (
                <RawPortraitDataRow data={data[1]} className="raw-portrait-data" showDate={"to"} />
            )}
            {data.length > 2 && (
              <RawPortraitDataRow data={data[2]} className="raw-portrait-data" showDate={lastDay} />
            )}

            {data.slice(3).map((item, index) => (
              <RawPortraitDataRow key={index} data={item} className="raw-portrait-data" showDate={""} />
            ))}

            <tr>
              <td colSpan={7} className="border-black border-[1px] text-center font-bold"></td>
              <td className="border-black border-[1px] text-end pr-[10px] font-bold">
                {data.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2)}
              </td>
              <td className="border-black border-[1px] text-center"></td>
            </tr>
            {/* Recapitulation Section */}
            <tr>
              <th colSpan={4} className="border-black border-[1px] text-center font-normal">Recapitulation</th>
              <th colSpan={5} className="border-black border-[1px] text-center font-normal">Recapitulation</th>
            </tr>
            <tr>
              <th colSpan={9} className="text-white">data</th>
            </tr>
            <tr>
              <th className="border-black border-[1px] text-center font-normal"></th>
              <th className="border-black border-[1px] text-center font-normal">Stock No.</th>
              <th className="border-black border-[1px] text-center font-normal">Quantity</th>
              <th className="border-black border-[1px] text-center font-normal">Item</th>
              <th className="border-black border-[1px] text-center font-normal">Unit</th>
              <th className="border-black border-[1px] text-center font-normal">Unit Cost</th>
              <th className="border-black border-[1px] text-center font-normal px-3">Total Cost</th>
              <th className="border-black border-[1px] text-center font-normal">Account Code</th>
              <th className="border-black border-[1px] text-center font-normal">Remarks</th>
            </tr> 
            {data.map((item, index) => (
              <RecapRow key={index} data={item} className="raw-portrait-data-2" />
            ))}
            <tr>
              <td colSpan={6} className="border-black border-[1px] text-center font-bold"></td>
              <td className="border-black border-[1px] text-end pr-[10px] font-bold">
                {data.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2)}
              </td>
              <td className="border-black border-[1px] text-center"></td>
              <td className="border-black border-[1px] text-center"></td>
            </tr>
            <tr>
              <th colSpan={3} className="border-black border-[1px] text-start pl-[10px] pb-[2rem] font-normal">I HEREBY certify to the correctness of <br /> the above information:</th>
              <th className="border-black border-[1px] text-start pl-[10px] pb-[2rem] font-normal">Noted by:</th>
              <th colSpan={5} className="border-black border-[1px] text-start pl-[10px] pb-[2rem] font-normal">Posted by:/Date</th>
            </tr>
            <tr>
              <th colSpan={3} className="border-black border-[1px] text-center pl-[10px] pb-[2rem] font-normal py-[4rem]">
                <div>
                  <p className="underline font-bold">MA. CAROLINA P. DOMUGHO</p>
                  <p>Head, Printing Press</p>
                </div>
              </th>
              <th className="border-black border-[1px] text-center pl-[10px] pb-[2rem] font-normal py-[4rem]">
                <div>
                  <p className="underline font-bold">DR. VANESSA A. GARCIA</p>
                  <p>Director Enterprise Division</p>
                </div>
              </th>
              <th colSpan={5} className="border-black border-[1px] text-center pl-[10px] pb-[2rem] font-normal py-[4rem]">
                <div>
                  <p className="underline font-bold">LYRICA SOL M. FLORES</p>
                  <p>Fund 06-Senior Bookkeeper</p>
                </div>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
