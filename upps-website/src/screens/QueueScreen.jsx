import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Queue component for multiple users
const QueueScreen = () => {


  const [request, setRequests] = useState([]);
  const [user, setUser] = useState([]);

  // Fetch queue data grouped by users from the backend
  useEffect(() => {
    
    axios.get('http://127.0.0.1:8000/api/queue/')
    .then(function (response) {
        const data = response.data;

        setRequests(data);
  
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
  },[]);


  const getCustomerDetails = (id) => {
    axios.get(`http://127.0.0.1:8000/api/studentform/${id}/`)
    .then(function (response) {
        console.log(response.data);
        
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });
  }

  return (
    <div>
    
      {request.map((item) => {
        

        return (
          <div key={item.id} className='flex justify-around'>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Request Date</th>
            <th>Customer Request Status</th>
            <th>Request Type</th>
            <th>Paper Size</th>
            <th>Duplex</th>
            <th>Queue Status</th>
          </tr>
        </thead>
        <tbody>
          {request.map((item) => {
            // Safely access nested properties using optional chaining (?.)
            const firstName = item?.request?.student_print_form?.first_name || '';
            const lastName = item?.request?.student_print_form?.last_name || '';
            const fullName = `${firstName} ${lastName}`.trim();
            const requestDate = item?.request_date || 'N/A';
            const queueStatus = item?.queue_status || 'N/A';
            const customerRequestStatus = item?.request?.customer_request_status || 'N/A';
            const requestType = item?.request?.request_type_name || 'N/A'; // Request type from Request model
            const paperSize = item?.request?.paper_size || 'N/A'; // Paper size from Request model
            const duplex = item?.request?.duplex ? 'Yes' : 'No'; // Duplex boolean

            return (
              <tr key={item.id}>
                <td>{fullName}</td>
                <td>{requestDate}</td>
                <td>{customerRequestStatus}</td>
                <td>{requestType}</td>
                <td>{paperSize}</td>
                <td>{duplex}</td>
                <td>{queueStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
          </div>
        );
      })}
    </div>
  );
};

export default QueueScreen;
