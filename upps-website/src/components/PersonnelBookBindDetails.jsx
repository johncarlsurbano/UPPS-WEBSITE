import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';

export const PersonnelBookBindDetails = ({ requestData, onClose }) => {
  const bookbindRequest = requestData?.book_bind_personnel_request;
  const personnelRequest = bookbindRequest?.user;
  const printRequestDetails = bookbindRequest?.book_binding_request_details;

  const user = useSelector((state) => state.user.value.user);

  const [paperType, setPaperType] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedQuantity, setUpdatedQuantity] = useState(printRequestDetails?.quantity || '');
  const [updatedPaperSize, setUpdatedPaperSize] = useState(printRequestDetails?.paper_type?.id || '');
  const [updatedFile, setUpdatedFile] = useState(null);

  const fetchPaperType = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/papertype/");
      setPaperType(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPaperType();
  }, []);

  console.log(bookbindRequest)


  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedQuantity(printRequestDetails?.quantity || '');
    setUpdatedPaperSize(printRequestDetails?.paper_type?.id || '');
    setUpdatedFile(null);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('quantity', updatedQuantity);
      formData.append('paper_type', updatedPaperSize);
      if (updatedFile) {
        formData.append('pdf', updatedFile);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      await axios.put(
        `http://127.0.0.1:8000/api/editbookbind/request/${requestData.id}/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      printRequestDetails.quantity = updatedQuantity;
      printRequestDetails.paper_type = paperType.find(
        (type) => type.id === Number(updatedPaperSize)
      );

      if (updatedFile) {
        bookbindRequest.pdf = URL.createObjectURL(updatedFile);
      }

      Swal.fire({
        title: "Success!",
        text: "Updated",
        icon: "success"
      });

      setIsEditing(false);
      fetchPaperType();
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const handleFileChange = (e) => {
    setUpdatedFile(e.target.files[0]);
  };

  const deleteRequest = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.delete(`http://127.0.0.1:8000/api/deletepersonnel/request/bookbind/${requestData.id}/`);
          onClose();
        } catch (error) {
          console.error("Error deleting request:", error);
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#ffffff] p-8 rounded-xl w-11/12 max-w-lg relative shadow-2xl border border-gray-700">
        <div className='flex justify-between items-center'>
          <h2 className="text-2xl font-bold text-[#17153a]">Request Details</h2>
          <button className="text-2xl text-[#17153a] hover:text-red-500 focus:outline-none" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="border-t border-black my-4"></div>

        <div className="grid grid-cols-2 gap-4 text-[#17153a]">
          <div><h1 className='text-xl'>Name</h1><p>{personnelRequest ? `${personnelRequest.first_name} ${personnelRequest.last_name}` : 'N/A'}</p></div>
          <div><h1 className='text-xl'>Email</h1><p>{personnelRequest?.email || 'N/A'}</p></div>
          <div><h1 className='text-xl'>Department</h1><p>{personnelRequest?.department?.department_name || 'N/A'}</p></div>
          <div><h1 className='text-xl'>Position</h1><p>{personnelRequest?.position?.position_name || 'N/A'}</p></div>
          <div><h1 className='text-xl'>Type</h1><p>{bookbindRequest?.service_type?.service_type_name || 'N/A'}</p></div>
          <div><h1 className='text-xl'>Request Type</h1><p>{printRequestDetails?.request_type?.request_type_name || 'N/A'}</p></div>

          <div>
            <h1 className='text-xl'>Paper Size</h1>
            {isEditing ? (
              <select value={updatedPaperSize} onChange={(e) => setUpdatedPaperSize(e.target.value)} className="border p-2 rounded w-full">
                {paperType.map((type) => (
                  <option key={type.id} value={type.id}>{type.paper_type}</option>
                ))}
              </select>
            ) : (
              <p>{printRequestDetails?.paper_type?.paper_type || 'N/A'}</p>
            )}
          </div>

          <div>
            <h1 className='text-xl'>Quantity</h1>
            {isEditing ? (
              <input type="number" value={updatedQuantity} onChange={(e) => setUpdatedQuantity(e.target.value)} className="border p-2 rounded w-full" />
            ) : (
              <p>{printRequestDetails?.quantity || 'N/A'}</p>
            )}
          </div>

          <div>
            <h1 className='text-xl'>File</h1>
            {isEditing ? (
              <input type="file" onChange={handleFileChange} className="border p-2 rounded w-full" />
            ) : (
              <button onClick={() => window.open(requestData.book_bind_personnel_request.pdf, "_blank")} className="text-[#4d70f1]">
                {requestData.book_bind_personnel_request.pdf ? "View File" : "N/A"}
              </button>
            )}
          </div>

          <div><h1 className='text-xl'>Queue Status</h1><p>{requestData.queue_status}</p></div>
          <div><h1 className='text-xl'>Request Date</h1><p>{requestData.request_date}</p></div>
          <div><h1 className='text-xl'>Remarks</h1><p>{bookbindRequest.remarks}</p></div>
        </div>

        { (user.id === personnelRequest.id || user.role === "Office Head") && requestData.queue_status !== "Ready to Claim" ? (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button className="w-full mt-6 py-3 text-white bg-red-600 font-bold rounded-lg hover:bg-red-500" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="w-full mt-6 py-3 text-white bg-green font-bold rounded-lg hover:bg-[#0BDA51]" onClick={handleSave}>
                  Save
                </button>
              </>
            ) : (
              <>
                <button className="w-full mt-6 py-3 text-white bg-red-600 font-bold rounded-lg hover:bg-red-500" onClick={deleteRequest}>
                  Delete
                </button>
                <button className="w-full mt-6 py-3 text-white bg-[#17153a] font-bold rounded-lg hover:bg-[#4e46db]" onClick={handleEdit}>
                  Edit
                </button>
              </>
            )}
          </div>
        ) : (
          <button className="w-full mt-6 py-3 text-white bg-[#17153a] font-bold rounded-lg hover:bg-[#4e46db]" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  );
};
