import React from 'react';

export const PaymentSlipDetailsModal = ({ requestData, onClose }) => {
  const personnelRequest = requestData.request;
  const personnelRequestDetails = requestData.request.print_request_details
  
  console.log(requestData)

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#ffffff] p-8 rounded-xl w-11/12 max-w-lg relative shadow-2xl border border-gray-700">
        <div className='flex justify-between items-center'>
          <h2 className="text-2xl font-bold text-[#17153a]">Request Details</h2>
          <button
            className="text-2xl text-[#17153a] hover:text-red-500 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="border-t border-black my-4"></div>

        <div className="grid grid-cols-2 gap-4 text-[#17153a]">
          <div>
            <h1 className='text-xl'>Job Order No.</h1>
            <p className='text-base'>{requestData ? requestData.job_order_number : 'N/A'}</p>
          </div>
          <div>
            <h1 className='text-xl'>Name</h1>
            <p className='text-base'>{personnelRequest ? `${personnelRequest.first_name} ${personnelRequest.last_name}` : 'N/A'}</p>
          </div>
          <div>
          <h1 className='text-xl'>Department</h1>
            <p className='text-base'>{personnelRequest ? personnelRequest.department.department_name : 'N/A'}</p>
          </div>
          <div>
          <h1 className='text-xl'>Email</h1>
            <p className='text-base'>{personnelRequest ? personnelRequest.email : 'N/A'}</p>
          </div>
          <div>
          <h1 className='text-xl'>Requst-Type</h1>
            <p className='text-base'>{personnelRequestDetails ? personnelRequestDetails.printing_type.printing_type_name : 'N/A'}</p>
          </div>
          <div>
            <h1 className='text-xl'>Request Date</h1>
            <p className='text-base'>{requestData.date}</p>
          </div>
          <div>
          <h1 className='text-xl'>Unit Cost</h1>
            <p className='text-base'>{requestData ? requestData.unitcost : 'N/A'}</p>
          </div>
          
          <div>
          <h1 className='text-xl'>Paper Type</h1>
            <p className='text-base'>{personnelRequestDetails ? personnelRequestDetails.paper_type.paper_type : 'N/A'}</p>
          </div>
          <div>
            <h1 className='text-xl'>Payment Status</h1>
            <p className={`text-base ${requestData.paid_status === "Unpaid" ? 'text-red-600' : 'text-green-600'} `}>{requestData.paid_status }</p>
          </div>
          <div>
            <h1 className='text-xl'>Total Costs</h1>
            <p className='text-base'>{requestData.totalcost}</p>
          </div>
        </div>

        <button
          className="w-full mt-6 py-3 text-[#ffffff] bg-[#17153a] font-bold rounded-lg hover:bg-[#dca10f] transition-all duration-200 transform hover:scale-[1.05]"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
