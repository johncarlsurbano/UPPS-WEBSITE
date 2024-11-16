import { useState } from "react"
import React from 'react'
import InputFields from '../components/InputFields.jsx'
import axios from 'axios'


const StudentForm = () => {

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    department: '',
    student_id: '',
    request_type_name: '',
    quantity: '',
    duplex: '',
    paper_size: ''
  }


  )

  const postStudent = (e) => {
    e.preventDefault();

    console.log(formData)
    axios.post('http://127.0.0.1:8000/api/studentform/', {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        email: formData.email,
        contact_number: formData.contact_number,
        department: formData.department,
        student_id: formData.student_id
    })
    .then(function (response) {
      console.log(response.data.id)
      axios.post('http://127.0.0.1:8000/api/requestform/', {
        student_print_form: response.data.id,
        request_type_name: formData.request_type_name,
        quantity: formData.quantity,
        duplex: true,
        paper_size: formData.paper_size,
        request_status: 'pending'
    })
    .then(function (response) {
        console.log(response)
    })
    .catch(function (err) {
        alert(err)
     }) 
    })
    .catch(function (error) {
      alert(error)
    });

    
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    const timestamp = Date.now(); // This would be the timestamp you want to format
    const request_date = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp)
    console.log(request_date)
  }

  

  return (

    <> 
    <form action="" onSubmit={postStudent} className="flex w-full ">
        <div >
            <p>First Name</p>
            <InputFields value={formData.first_name} onChange={(e) => {
                setFormData({...formData, first_name: e.target.value })
            }}/>
            <p>Middle Name</p>
            <InputFields value={formData.middle_name} onChange={(e) => {
                setFormData({...formData, middle_name: e.target.value })
            }}/>
            <p>Last Name</p>
            <InputFields value={formData.last_name} onChange={(e) => {
                setFormData({...formData, last_name: e.target.value })
            }} />
            <p>Email</p>
            <InputFields value={formData.email} onChange={(e) => {
                setFormData({...formData, email: e.target.value })
            }}/>
            <p>Contact Number</p>
            <InputFields value={formData.contact_number} onChange={(e) => {
                setFormData({...formData, contact_number: e.target.value })
            }}/> 
            <p>Department</p>
            <InputFields value={formData.department} onChange={(e) => {
                setFormData({...formData, department: e.target.value })
            }} />
            <p>Student ID</p>
            <InputFields value={formData.student_id} onChange={ (e) => {
                setFormData({...formData, student_id: e.target.value })    
            } }/>
        </div>
        <div>
            <p>Type</p>
            <InputFields value={formData.request_type_name} onChange={ (e) => {
                setFormData({...formData, request_type_name: e.target.value })    
            } }/>
            <p>Paper Size</p>
            <InputFields value={formData.paper_size} onChange={ (e) => {
                setFormData({...formData, paper_size: e.target.value })    
            } }/>
            <p>Duplex</p>
            <InputFields value={formData.duplex} onChange={ (e) => {
                setFormData({...formData, duplex: e.target.value })    
            } }/>
            <p>Quantity</p>
            <InputFields value={formData.quantity} onChange={ (e) => {
                setFormData({...formData, quantity: e.target.value })    
            } }/>
        </div>
        <button type="submit" >Submit</button>

    </form>
    
    </>
  )
}

export default StudentForm