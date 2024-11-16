import React from 'react';

export const RequestDetailsModal = ({ requestData, onClose }) => {
  const personnelRequest = requestData.personnel_print_request;
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
            <h1 className='text-xl'>Name</h1>
            <p className='text-base'>{personnelRequest ? `${personnelRequest.first_name} ${personnelRequest.last_name}` : 'N/A'}</p>
          </div>
          <div>
          <h1 className='text-xl'>Email</h1>
            <p className='text-base'>{personnelRequest ? personnelRequest.email : 'N/A'}</p>
          </div>
          <div>
          <h1 className='text-xl'>Department</h1>
            <p className='text-base'>{personnelRequest ? personnelRequest.department.department_name : 'N/A'}</p>
          </div>
          <div>
          <h1 className='text-xl'>Position</h1>
            <p className='text-base'>{personnelRequest ? personnelRequest.position.position_name : 'N/A'}</p>
          </div>
          <div>
          <h1 className='text-xl'>Requst-Type</h1>
            <p className='text-base'>{personnelRequest ? personnelRequest.print_request_details.printing_type.printing_type_name : 'N/A'}</p>
          </div>
          <div>
          <h1 className='text-xl'>Paper Size</h1>
            <p className='text-base'>{personnelRequest ? personnelRequest.print_request_details.paper_type.paper_type : 'N/A'}</p>
          </div>
          <div>
          <h1 className='text-xl'>Quantity</h1>
            <p className='text-base'>{personnelRequest ? personnelRequest.print_request_details.quantity : 'N/A'}</p>
          </div>
          <div>
          <h1 className='text-xl'>Queue Status</h1>
            <p className='text-base'>{requestData.queue_status}</p>
          </div>
          <div>
          <h1 className='text-xl'>Request Date</h1>
            <p className='text-base'>{requestData.request_date}</p>
          </div>
          <div>
          <h1 className='text-xl'>File</h1>
              <button onClick={() => window.open(personnelRequest.pdf, "_blank")} href={personnelRequest && personnelRequest.pdf ? personnelRequest.pdf : "#"} className="text-[#4d70f1] text-[1.1rem]   ">
                {personnelRequest && personnelRequest.pdf ? "View File" : "N/A"}
              </button>
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
