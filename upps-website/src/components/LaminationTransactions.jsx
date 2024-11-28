import Button from "./Button.jsx";

import { GenericTable } from "./GenericTable.jsx";
import { React, useState, useEffect } from "react";
import axios from "axios";
import BillLaminationRequest from "./BillLaminationRequest.jsx";
import PaymentSlipLaminationRequest from "./PaymentSlipLaminationRequest.jsx"
import { BillLaminationDetails } from "./BillLaminationDetails.jsx";
import { PaymentSlipLaminationDetails } from "./PaymentSlipLaminationDetails.jsx"
import { FilterRequest } from "./FilterRequest.jsx";
import { BillingForm } from "../screens/BillingForm.jsx";
import { useNavigate } from "react-router-dom";

export const LaminationTransactions = () => {
  const navigate = useNavigate();

  const [billRequest, setBillRequest] = useState([]);
  const [paymentSlipRequest, setPaymentSlipRequest] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedPaymentSlip, setSelectedPaymentSlip] = useState(null);
  const [requestTypes, setRequestTypes] = useState([]);
  const [jobOrderTypes, setJobOrderTypes] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequestType, setSelectedRequestType] = useState("");
  const [selectedJobOrderType, setSelectedJobOrderType] = useState("");
  const [filteredCustomer, setFilteredCustomer] = useState("");
  const [selectedBill, setSelectedBill] = useState("");

  const [showModalPS, setShowModalPS] = useState(false);
  const [selectedPaymentSlipRequest, setSelectedPaymentSlipRequest] = useState(null);


  const generateBill = (requestDetail) => {
    const url = '/officehead/joborderlaminationform'; // URL of the payment slip
    console.log("Selected Queue Request:", requestDetail);
  
    // Pass data to sessionStorage first
    sessionStorage.setItem('billData', JSON.stringify(requestDetail));
  
    // Add a short delay to ensure sessionStorage is updated
    setTimeout(() => {
      const newTab = window.open(url, '_blank'); // Open in a new tab
      if (!newTab) {
        console.error('Failed to open a new tab. Check browser settings.');
      }
    }, 100); // 100 ms delay
  };

  const handleDetailsClick = (requestDetail) => {
    // console.log('bobo')
    setSelectedRequest(requestDetail);
    setShowModal(true);
  };

  const handlePaymentSlipDetails = (requestDetail) => {
    setSelectedPaymentSlipRequest(requestDetail); // Correctly set the request
    setShowModalPS(true); // Show the modal

  };

  const handleCloseModal = () =>{
    setShowModal(false)
    setShowModalPS(false)
    setSelectedRequest(null);
    setSelectedPaymentSlipRequest(null)
    
  } ;

  const handlePaidStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/updatepaidstatus/${id}/`,
        {
          paid_status: newStatus,
        }
      );

      fetchBillRequest();
    } catch (e) {
      console.error("Error updating paid status:", e);
    }
  };

  const fetchBillRequest = async () => {
    try {
      
    
      const response = await axios.get(
        "http://127.0.0.1:8000/api/displaybill/"
      );
       
      const billdata = response.data;
      
  
      const laminationBill = billdata.filter((request)  => request.request_details.service_type.service_type_name === "Lamination")


    
      

      setRequestTypes([
        ...new Set(
            laminationBill.map(
            (item) =>
              item.request_details.lamination_request_details.request_type
                .request_type_name
          )
        ),
      ]);
      setJobOrderTypes([...new Set(laminationBill.map((item) => item.type))]);

      const mappedData = laminationBill.map((requestDetail) =>
        BillLaminationRequest({
          requestDetail,
          handlePaidStatus,
          handleDetailsClick,
          generateBill,
        })
      );

      setBillRequest(mappedData);
    } catch (e) {
      console.error("Error fetching bill request:", e);
    }
  };

  useEffect(() => {
    fetchBillRequest();
  }, []);

  useEffect(() => {
    const filteredData = billRequest.filter(
      (request) =>
        (selectedRequestType
          ? request["Request Type"] === selectedRequestType
          : true) &&
        (selectedJobOrderType
          ? request["Type"] === selectedJobOrderType
          : true) &&
        (filteredCustomer
          ? request["Name"].toLowerCase().match(filteredCustomer) ||
            request["Name"].match(filteredCustomer)
          : true)
    );

    setFilteredRequests(filteredData);
  }, [
    selectedRequestType,
    selectedJobOrderType,
    billRequest,
    filteredCustomer,
  ]);


  //PAYMENT SLIP

  const fetchPaymentSlip = async () => {
    try{
      const response = await axios.get("http://127.0.0.1:8000/api/getstudent/paymentslip/")
      const data = response.data

  
      const laminationPaymentSlip = data.filter((request)  => request.request_details.service_type.service_type_name === "Lamination")

      

      const mappedPSPrint = laminationPaymentSlip.map((requestDetail) => PaymentSlipLaminationRequest({
        requestDetail,
        handlePaymentSlipDetails
      }))

      setPaymentSlipRequest(mappedPSPrint)

    } catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPaymentSlip();
  }, [])

  const printingTransactionHeaderJobOrder = [
    "Name",
    "Time-In",
    "Request Type",
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
    "Details"
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
          <h1 className=" mb-10 text-[clamp(1.5rem,3vw,2rem)] font-bold text-navy">
            Billing & Job Order A
          </h1>
          <div className="second-header flex justify-between">
            <div className="second-header-left flex gap-[2rem]">
              <div className="select-customer">
                <p className="mb-3">Select Customer</p>
                <div className="">
                  <input
                    className="py-[14px] px-2"
                    onChange={(e) => {
                      setFilteredCustomer(e.target.value);
                    }}
                  />
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
            style={{ backgroundColor: "#17132e", color: "#fff" }}
          ></GenericTable>
        </div>
        {showModalPS && selectedPaymentSlipRequest && (
          <PaymentSlipLaminationDetails
            requestData={selectedPaymentSlipRequest}
            onClose={handleCloseModal}
          />
        )}
        {showModal && selectedRequest && (
          <BillLaminationDetails
            requestData={selectedRequest}
            onClose={handleCloseModal}
          />
        )}
        
        <div className="payment-slip-table-transaction w-full max-w-[1200px] m-auto my-auto">
          <div className="flex flex-col gap">
            <h1 className="mb-10 text-[clamp(1.5rem,3vw,2rem)] font-bold text-navy">
              Payment Slip
            </h1>
            <Button
              title={"Remove"}
              style={
                "bg-[#f04714] text-white text-center py-[1rem] px-[2rem] self-end rounded-[5px]"
              }
            ></Button>
          </div>
          <GenericTable
            headers={printingTransactionHeaderPaymentSlip}
            data={paymentSlipRequest}
            style={{ backgroundColor: "#17132e", color: "#fff" }}
          ></GenericTable>
        </div>
        
      </div>
    </>
  );
};
