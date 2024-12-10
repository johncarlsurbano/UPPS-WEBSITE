import { useEffect, useState } from "react";
import ustpHeaderForm from "../assets/ustpHeaderForm.png";
import { useLocation } from "react-router-dom";
import axios from 'axios'


export const JobOrderForm = ({requestData,route}) => {
  const [signatories, setSignatories] = useState([])

  const location = useLocation()

  const [request, setRequest] = useState(null);

 

  const fetchSignatories = async () => {
    try{
      const response = await axios.get('http://127.0.0.1:8000/api/signatories/')
      const data = response.data

      setSignatories(data)
    }catch (error) {
      console.error("Error fetching signatories:", error);
    }
  }

  useEffect(() => {
    // Retrieve the data from sessionStorage
    const storedData = sessionStorage.getItem('billData');
    if (storedData) {
      setRequest(JSON.parse(storedData));
    } else {
      console.error('No data found for the payment slip.');
    }
    
    fetchSignatories()
    // Trigger print if the data is available
    if (storedData) {
      window.print()
    }
  }, []);

  console.log(request)
  
  
  const personnelRequest = request?.request_details.user

  const personnelRequestDetails = request?.request_details.print_request_details

  
  const currentDate = new Date().toLocaleDateString();

  return (
    <>
      <div className="billing-form flex flex-col px-[2rem] py-[1rem]">
        <div className="billing-form-content flex flex-col m-auto my-0 w-full max-w-[900px]">
          <div className="billing-form-header flex justify-between w-full max-w-[100%]">
            <div className="ustp-header-form w-full max-w-[40rem] h-[6rem]">
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
                      <td className="py-[0.2rem] text-center text-[12px]">{request?.documentcodenumber}</td>
                    </tr>
                  </table>
                  <table className="w-full max-w-[100%] border-black border-[1px] text-[12px]">
                    <tr>
                      <th className="bg-[#0a1a44] text-white px-[1px] py-[0.2rem] text-center text-[12px]">
                        Rev No.
                      </th>
                      <th className="bg-[#0a1a44] text-white py-[0.2rem] text-center text-[12px]" >
                        Effective Date
                      </th>
                      <th className="bg-[#0a1a44] text-white py-[0.2rem] text-center text-[12px] ">Page No.</th>
                    </tr>
                    <tr>
                      <td className="py-[0.2rem] border-black border-[1px] text-center">
                        {request?.revnumber}
                      </td>
                      <td className="py-[0.2rem] border-black border-[1px] text-center ">
                        10.01.21
                      </td>
                      <td className="py-[0.2rem] border-black border-[1px] text-center">
                        {request?.pagenumber}
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm  font-bold">TIN:001-030-959-000-Exempt</p>
          <div className="billing-form-main flex flex-col justify-end  w-full max-w-[100%] h-[fit-content] ">
            <div className="billing-form-content flex justify-between">
              <div className="billing-form-left flex flex-col justify-between border-black border-[1px] w-full max-w-[20%]">
                <div className="billing-form-left-content flex flex-col px-[1rem] mt-[5rem]">
                  <p className="text-[clamp(1rem, 3vw, 1rem)]">
                    ( ) Book Center
                  </p>
                  <p className="text-[clamp(1rem, 3vw, 1rem)]">
                    ( ) Garments and Fashion
                  </p>
                  <p className="text-[clamp(1rem, 3vw, 1rem)]">
                    ( ) Facilities for Lease
                  </p>
                  <p className="text-[clamp(1rem, 3vw, 1rem)]">
                    ( ) Printing Press and Publishing
                  </p>
                </div>
                <div className="bg-black h-0.5 mb-[1rem]"></div>
              </div>
              <div className="billing-form-right-main flex border-black border-[1px] w-full max-w-[77%]">
              
                <div className="billing-form-content flex  flex-col w-full max-w-[100%] justify-between">
                  <div className="self-center">
                    <p
                      className="text-center bg-black text-white w-full max-w-[fit-content] px-[4rem] py-[0.5rem] mb-[1.5rem] mt-[1rem]"
                      style={{ borderRadius: "100%" }}
                    >
                      Job Order A
                    </p>

                  </div>
                  <div className="flex w-full max-w-[100%] justify-between px-[2rem]">
                    <div className="form-billing-no flex flex-col justify-start">
                      <p className="text-[clamp(1rem, 3vw, 1rem)]">{`No: ${request?.job_order_number}`}</p>
                    </div>
                    <div className="form-billing-date form-billing-no flex flex-col justify-start items-center">
                      <p>{currentDate}</p>
                      <p className="text-[clamp(1rem, 3vw, 1rem)]">Date</p>
                    </div>
                  </div>
                  <div className="flex flex-col px-[2rem] mb-[1.5rem]">
                    <div className="flex">
                      <p className="text-[clamp(1rem, 3vw, 1rem)] w-full max-w-[7rem]">
                        Customer:
                      </p>
                      <p>{`${personnelRequest?.first_name} ${personnelRequest?.last_name}`}</p>
                    </div>
                    <div className="flex">
                      <p className="text-[clamp(1rem, 3vw, 1rem)] w-full max-w-[7rem]">
                        Address:{" "}
                      </p>
                      <p></p>
                    </div>
                  </div>
                  <div className="billing-form-table w-full max-w-[100%] mb-[1rem]">
                    <div className="billing-form-content w-full max-w-[100%]">
                      <table className="w-full max-w-[100%] border-black border-[1px]">
                        <tr className="text-center">
                          <th className="font-normal border-black border-[1px] py-2">
                            Qty.
                          </th>
                          <th className="font-normal border-black border-[1px] py-2">
                            Unit
                          </th>
                          <th className="font-normal border-black border-[1px] py-2">
                            Articles/Description/Services
                          </th>
                          <th className="font-normal border-black border-[1px] py-2">
                            Unit Cost
                          </th>
                          <th className="font-normal border-black border-[1px] py-2">
                            Total Cost  
                          </th>
                        </tr>
                        <tr className="text-center">
                          <td className="border-black border-[1px] py-2 text-center">{personnelRequestDetails?.quantity}</td>
                          <td className="border-black border-[1px] py-2 text-center">
                            {request?.unit}
                          </td>
                          <td className="border-black border-[1px] py-2 text-center">
                            {`${personnelRequestDetails?.printing_type.printing_type_name} - ${personnelRequest?.last_name} - ${personnelRequest?.department.department_name}`}
                          </td>
                          <td className="border-black border-[1px] py-2 text-center">{request?.unitcost}</td>
                          <td className="border-black border-[1px] py-2 text-center">
                            {request?.totalcost}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div className="signatories-first flex justify-between mb-[2rem] pl-[2rem] pr-[5rem]">
                    <div className="flex gap-4">
                      <p className="text-[clamp(1rem, 3vw, 1rem)]">
                        Prepared by:
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <p className="text-[clamp(1rem, 3vw, 1rem)]">Noted by:</p>
                    </div>
                    <div className="flex gap-4">
                      <p className="text-[clamp(1rem, 3vw, 1rem)]">
                        Requested by:
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-[1.5rem]">
                    {signatories.map((signatory, index) => (
                      <div key={index} className="text-center">
                        <p className="underline text-[clamp(1rem, 3vw, 1rem)]">{signatory.name}</p>
                        <p className="text-[clamp(0.5rem, 3vw, 0.5rem)]">{signatory.position}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-black border-[0.5px] my-[1rem] "></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
