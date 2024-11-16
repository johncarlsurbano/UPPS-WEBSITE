import  Button  from "../components/Button.jsx";

import { GenericTable } from "../components/GenericTable";
import { React, useState, useEffect} from 'react'
import axios from 'axios'
import  BillRequest  from '../components/BillRequest.jsx'
import {BillDetailsModal} from '../components/BillDetailsModal.jsx'
import { FilterRequest } from '../components/FilterRequest.jsx'
import {BillingForm} from './BillingForm.jsx'
import { useNavigate } from "react-router-dom";

export const PrintingTransaction = () => {
  const navigate = useNavigate();

  const [billRequest, setBillRequest] = useState([])
  const [showModal, setShowModal] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [requestTypes, setRequestTypes] = useState([]);
  const [jobOrderTypes, setJobOrderTypes] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]); 
  const [selectedRequestType, setSelectedRequestType] = useState('');
  const [selectedJobOrderType, setSelectedJobOrderType] = useState('');
  const [filteredCustomer, setFilteredCustomer] = useState('');
  const [selectedBill, setSelectedBill] = useState('');

  const generateBill = (requestDetail) => {
    // <BillingForm requestData={requestDetail}/>
    navigate("/officehead/billingform", {state: requestDetail})
    
    
  }

  const handleDetailsClick = (requestDetail) => {
    // console.log('bobo')
    setSelectedRequest(requestDetail)
    setShowModal(true)
  }

  const handleCloseModal = () => setShowModal(false);





  const handlePaidStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/updatepaidstatus/${id}/`, {
        paid_status: newStatus
      }) 

      fetchBillRequest()

    }catch (e) {
      console.error("Error updating paid status:", e);
    }
    
  }

  const fetchBillRequest = async () => {
    
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/displaybill/");

      const billdata = response.data
      console.log(response.data)

      setRequestTypes([...new Set(billdata.map(item => item.request.print_request_details.printing_type.printing_type_name))]);
      setJobOrderTypes([...new Set(billdata.map(item => item.type))]);

      const mappedData = billdata.map((requestDetail) =>
        BillRequest({
            requestDetail,
            handlePaidStatus,
            handleDetailsClick,
            generateBill,
            

        })
      )

      setBillRequest(mappedData);

      
    }catch(e) {
      console.error("Error fetching bill request:", e);
    }

  }


  

  useEffect(
    () => {
      fetchBillRequest();
    }, []
  )

  useEffect(() => {
 
      const filteredData = billRequest.filter((request) =>
        (selectedRequestType ? request["Request-Type"] === selectedRequestType : true) &&
        (selectedJobOrderType ? request["Type"] === selectedJobOrderType : true) &&
        (filteredCustomer ? request["Name"].toLowerCase().match(filteredCustomer) || request["Name"].match(filteredCustomer) : true)
    );  

      setFilteredRequests(filteredData)

    
    },[selectedRequestType, selectedJobOrderType, billRequest, filteredCustomer])

    console.log(filteredCustomer)



  const printingTransactionHeaderJobOrder = [
    "Name",
    "Time-In",
    "Request-Type",
    "Type",
    "Status",
    "Status Update",
    "Details",
    "Action",
  ];

  const printingTransactionDataJobOrder = [
    {
      Name: "Christine Marie Beto",
      "Time-In": "6:00 PM",
      Request: "Examinaton",
      Type: "Billing",
      Status: (
        <select>
          <option value="">Paid</option>
          <option value="">Unpaid</option>
        </select>
      ),
      "Status Update": "6:00 PM",
      Details: (
        <Button
          title={"Details"}
          style={"bg-[#17132e] text-white px-[1rem] py-[0.2rem] rounded-[5px]"}
        ></Button>
      ),
      Action: (
        <Button
          title={"Generate"}
          style={"bg-[#70c053] text-white px-[1rem] py-[0.2rem] rounded-[5px]"}
        ></Button>
      ),
    },
  ];

  const printingTransactionHeaderPaymentSlip = [
    "Name",
    "Time-In",
    "Request",
    "Status",
    "Status Update",
    "Details",
    "Action",
  ];

  const printingTransactionDataPaymentSlip = [
    {
      Name: "Christine Marie Beto",
      "Time-In": "6:00 PM",
      Request: "Examinaton",
      Status: (
        <select>
          <option value="">Paid</option>
          <option value="">Unpaid</option>
        </select>
      ),
      "Status Update": "6:00 PM",
      Details: (
        <Button
          title={"Details"}
          style={"bg-[#17132e] text-white px-[1rem] py-[0.2rem] rounded-[5px]"}
        ></Button>
      ),
      Action: (
        <Button
          title={"Generate"}
          style={"bg-[#70c053] text-white px-[1rem] py-[0.2rem] rounded-[5px]"}
        ></Button>
      ),
    },
  ];

  return (
    <>
      <div className="printing-transaction  flex flex-col">
        <div className="printing-transaction-content flex flex-col m-auto my-0 w-full max-w-[1200px]">
          <h1 className=" mb-10">Billing & Job Order A</h1>
          <div className="second-header flex justify-between">
            <div className="second-header-left flex gap-[2rem]">
              <div className="select-customer">
                <p className="mb-3">Select Customer</p>
                <div className="">
                  <input className="py-[14px] px-2" onChange={(e) => {
                     setFilteredCustomer(e.target.value)
                  }}/>
                </div>
                
              </div>

              <FilterRequest
              title="Job Order Type"
              selectVal={selectedJobOrderType} 
              options={jobOrderTypes}
              handleSelectChange={setSelectedJobOrderType}
              />
            
              <FilterRequest
                title="Request Type"
                selectVal={selectedRequestType}
                options={requestTypes}
                handleSelectChange={setSelectedRequestType}
              />
            </div>
            <Button
              title={"Remove"}
              style={
                "bg-[#f04714] text-white text-center py-[1rem] px-[2rem] self-end rounded-[5px]"
              }
            ></Button>
          </div>

          <GenericTable
            headers={printingTransactionHeaderJobOrder}
            data={filteredRequests}
            style={{backgroundColor: "#17132e" , color: "#fff"}}
          ></GenericTable>
        </div>
        {showModal && selectedRequest && (
            <BillDetailsModal
              requestData={selectedRequest}
              onClose={handleCloseModal}
            />
          )}
        <div className="payment-slip-table-transaction w-full max-w-[1200px] m-auto my-auto">
          <div className="flex flex-col gap">
            <h1>Payment Slip</h1>
            <Button
              title={"Remove"}
              style={
                "bg-[#f04714] text-white text-center py-[1rem] px-[2rem] self-end rounded-[5px]"
              }
            ></Button>
          </div>
          <GenericTable
            headers={printingTransactionHeaderPaymentSlip}
            data={printingTransactionDataPaymentSlip}
            style={{backgroundColor: "#17132e" , color: "#fff"}}
          ></GenericTable>
        </div>
      </div>
    </>
  );
};
