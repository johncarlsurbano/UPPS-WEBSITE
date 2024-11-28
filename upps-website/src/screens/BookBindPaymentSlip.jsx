import ustpHeaderForm from "../assets/ustpHeaderForm.png";
import { useLocation } from "react-router-dom";
import {useEffect, useState} from 'react'

export const BookBindPaymentSlip = () => {

  const [paymentSlipData, setPaymentSlipData] = useState(null);

  useEffect(() => {
    // Retrieve the data from sessionStorage
    const storedData = sessionStorage.getItem('paymentSlipData');
    if (storedData) {
      setPaymentSlipData(JSON.parse(storedData));
    } else {
      console.error('No data found for the payment slip.');
    }
    
    // Trigger print if the data is available
    if (storedData) {
      window.print();
    }
    console.log(JSON.parse(storedData));
    
  }, []);
  
  const paymentSlip = paymentSlipData?.book_bind_student_request

  const studentRequest = paymentSlip?.book_bind_request
  
  const printRequestDetails = studentRequest?.book_binding_request_details

  

  
  return (
    <div className="payment-slip-form flex">
      <div className="payment-slip-form content flex flex-col m-auto my-0 w-full max-w-[900px] py-[2rem]">
        <div className="payment-slip-header flex justify-between mb-10">
          <div className="ustp-header-form w-full max-w-[30rem] h-[6rem]">
            <img src={ustpHeaderForm} alt="" />
          </div>
          <div className="document-number w-full max-w-[16rem] text-center mb-[1rem] ">
            <div className="w-full max-w-[100%] ">
              <div className="w-full max-w-[100%] ">
                <table className="w-full max-w-[100% border-black border-[1px] ">
                  <tr className="border-black border-[1px] ">
                    <th className="bg-[#0a1a44] text-white px-[1px] text-center py-[0.1rem] text-[12px]">
                      Document No.
                    </th>
                  </tr>
                  <tr>
                    <td className="py-[0.2rem] text-center text-[12px]">
                      {paymentSlip?.documentcodenumber}
                    </td>
                  </tr>
                </table>
                <table className="w-full max-w-[100%] border-black border-[1px] text-[12px]">
                  <tr>
                    <th className="bg-[#0a1a44] text-white px-[1px] py-[0.2rem] text-center text-[12px]">
                      Rev No.
                    </th>
                    <th className="bg-[#0a1a44] text-white py-[0.2rem] text-center text-[12px]">
                      Effective Date
                    </th>
                    <th className="bg-[#0a1a44] text-white py-[0.2rem] text-center text-[12px] ">
                      Page No.
                    </th>
                  </tr>
                  <tr>
                    <td className="py-[0.2rem] border-black border-[1px] text-center">
                      {paymentSlip?.revnumber}
                    </td>
                    <td className="py-[0.2rem] border-black border-[1px] text-center ">
                      {paymentSlip?.date}
                    </td>
                    <td className="py-[0.2rem] border-black border-[1px] text-center">
                      {paymentSlip?.pagenumber}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-center font-bold">IEP PRINTING PRESS</p>
          <p className="text-center font-bold">PAYMENT SLIP</p>
        </div>
        <div className="flex flex-col w-full max-w-[100%] gap-5 mt-[5rem]">
          <div className="flex justify-between w-full max-w-[100%]">
            <div className="flex gap-5">
              <p>Name:</p>
              <p>{studentRequest?.first_name} {studentRequest?.last_name}</p>
            </div>
            <div className="flex gap-5">
              <p>Date:</p>
              <p>{paymentSlip?.date}</p>
            </div>
          </div>
          <table className="border-black border-[1px] w-full max-w-[100%]">
            <tr>
              <th className="text-center border-black border-[1px] py-3">
                Qty
              </th>
              <th className="text-center border-black border-[1px]">Unit</th>
              <th className="text-center border-black border-[1px]">
                Description
              </th>
              <th className="text-center border-black border-[1px]">
                Unit Cost
              </th>
              <th className="text-center border-black border-[1px]">Amount</th>
            </tr>
            <tr>
              <td className="text-center border-black border-[1px] py-3">
                {printRequestDetails?.quantity}
              </td>
              <td className="text-center border-black border-[1px]">{paymentSlip?.unit}</td>
              <td className="text-center border-black border-[1px]">{printRequestDetails?.request_type.request_type_name} - {studentRequest?.last_name} - {studentRequest?.department.department_name}</td>
              <td className="text-center border-black border-[1px]">{paymentSlip?.unitcost?.toFixed(2)}</td>
              <td className="text-center border-black border-[1px]">{paymentSlip?.totalcost}</td>
            </tr> 
          </table>
        </div>
        <div className="flex gap-5 justify-end mt-5">
          <p>Prepared by:</p>
          <div className="flex flex-col text-center">
            <p>John Carl Surbano</p>
            <p>Staff, Printing Press</p>
          </div>
        </div>
      </div>
    </div>
  );
};
