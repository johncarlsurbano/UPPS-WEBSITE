import { useState, useEffect } from "react";
import { GenericTransactionTable } from "../components/GenericTransactionTable";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const StockCard = () => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get("id");
  const [item, setItem] = useState([])

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/stockcard/${id}/`);
      const fetchedData = response.data;

      console.log(fetchedData)
      setItem(fetchedData)

  
      if (Array.isArray(fetchedData) && fetchedData.length > 0) {
        setItem(fetchedData[0]); // Select the first item
      } else {
        setItem(null); // If no data, set to null
      }
  
      const formattedData = fetchedData.map((item) => ({
        "DATE RECEIVE OR ISSUED": item.issued || "",
        "Requisition or Issue Order Number": item.requisition || "",
        "FROM WHOM RECEIVED OR TO WHOM ISSUED": item.receiver || "",
        "Quantity Received": item.quantity_received || "",
        "Quantity Issued": item.quantity_issued || "",
        "Quantity On Hand": item.quantity_on_hand || "",
        REMARKS: item.remarks || "",
      }));
  
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching stock card data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);


  const StockCardHeaders = [
    "DATE RECEIVE OR ISSUED",
    "Requisition or Issue Order Number",
    "FROM WHOM RECEIVED OR TO WHOM ISSUED",
    "Quantity Received",
    "Quantity Issued",
    "Quantity On Hand",
    "REMARKS",
  ];

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrinting(false);
    };

    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  return (
    <div className="stock-card flex flex-col pt-[5rem]">
      <div className="stock-card-content flex flex-col w-[900px] max-w-[100%] m-0 mx-auto">
        <p className="align-self-end">GENERAL FORM 77 (A)</p>
        <p className="align-self-center text-[clamp(16px,3vw,2rem)] font-bold">
          STOCK CARD
        </p>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <div className="flex gap-2">
              <p>Unit Price:</p>
              <p className="underline"></p>
            </div>
            <div className="flex gap-2">
              <p>Article:</p>
              <p className="underline">{item.printing_inventory.paper_type.paper_type}</p>
            </div>
            <div className="flex gap-2">
              <p>Description:</p>
              <p className="underline">
                description
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <p>Stock No.</p>
              <p className="underline">Stock No. Value </p>
            </div>
            <div className="flex gap-2">
              <p>Quantity Unit</p>
              <p className="underline">Ream</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col stock-card-table w-1200px max-w-[100%]">
          {data.length > 0 ? (
            <GenericTransactionTable
              headers={StockCardHeaders}
              data={data}
              editableFields={["Requisition or Issue Order Number"]}
              tableStyle="generic-table-main flex flex-col bg-white h-[fitcontent] w-full max-w-[100%] mt-8"
              thStyle="px-2 py-2 text-left text-center border-black border-[1px] text-black text-[clamp(16px,3vw,16px)] font-normal"
            />
          ) : (
            <p>No data available.</p>
          )}
          <p className="mt-2">Page no.</p>
          {!isPrinting && (
            <button
              className="w-[fit-content] px-[3rem] py-[0.5rem] bg-navy align-self-end text-white rounded-[5px]"
              onClick={handlePrint}
            >
              Print
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
