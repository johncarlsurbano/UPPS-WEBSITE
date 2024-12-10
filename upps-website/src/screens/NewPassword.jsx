import React, { useState } from 'react';
import Header from '../components/Header1.jsx';
import InputFields from '../components/InputFields.jsx';
import Button from '../components/Button.jsx';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value.user);
  const email = user.email;
  console.log(email);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form default submission

    if (confirmPassword === newPassword) {
      try {
        const resetpassword = await axios.post('http://127.0.0.1:8000/api/resetpassword/', {
          email: email,
          password: newPassword,
        });

        if (resetpassword.status === 200) {
          alert('Password reset successful!');
          navigate('/donechangepassword');
        } else {
          alert('Something went wrong, please try again.');
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        alert('Something went wrong! Please check the console for details.');
      }
    } else {
      alert('Passwords do not match. Please try again.');
    }
  };

  return (
    <div>
      <Header onClick={() => navigate('/')} />
      <div className="text-center flex flex-col items-center">
        <h1 className="text-5xl text-darkblue mt-16 mb-12">
          Reset <span className="text-yellow">Password</span>
        </h1>
        <p className="mb-20">
          You can now change your password. Please enter your new <br /> password below to complete the process
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <p className="text-start mb-2">New password</p>
          <InputFields
            type="password"
            name="password"
            placeholder="Please enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <p className="text-start mb-2">Confirm password</p>
          <InputFields
            type="password"
            name="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit" // Changed type to submit for form submission
            style="text-white bg-uppsyellow hover:bg-uppsdarkblue rounded-full py-3.5 w-[400px]"
            title="Reset Password"
          />
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
