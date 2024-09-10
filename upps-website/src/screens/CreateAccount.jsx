import React from 'react';
import Header1 from '../components/Header1.jsx';
import Dropdown from '../components/Dropdown.jsx';
import InputFields from '../components/InputFields.jsx';
import Button from '../components/Button.jsx';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
  const navigate = useNavigate();



  let selectDay = [1, 2, 3, 4, 5]
  const [day, setDay] = React.useState(`${selectDay[0]}`);
  const handleChangeDay = (event) => {
    setDay(event.target.value);
  };

  let selectMonth = ["January", "February", "March", "April", "May"]
  const [month, setMonth] = React.useState(`${selectMonth[0]}`);
  const handleChangeMonth = (event) => {
    setMonth(event.target.value);
  };

  let selectYear = [2000, 2001, 2002, 2003, 2004]
  const [year, setYear] = React.useState(`${selectYear[0]}`);
  const handleChangeYear = (event) => {
    setYear(event.target.value);
  };

  let selectDepartment = ["CITC", "CEA", "COT", "CSM"]
  const [department, setDepartment] = React.useState(`${selectDepartment[0]}`);
  const handleChangeDepartment = (event) => {
    setDepartment(event.target.value);
  };


  let selectStreetAddress = ["Bontong", "Bolonsori", "Emerald", "Gatter" ]
  const [streetaddress, setStreetAddress] = React.useState(`${selectStreetAddress[0]}`);
  const handleChangeStreetAdress = (event) => {
    setStreetAddress(event.target.value);
  };

  let selectBarangay = ["Camaman-an", "Iponan", "Gusa", "Lapasan"]
  const [barangay, setBarangay] = React.useState(`${selectBarangay[0]}`);
  const handleChangeBarangay = (event) => {
    setBarangay(event.target.value);
  };

  let selectCity = ["Cagayan de Oro City"]
  const [city, setCity] = React.useState(`${selectCity[0]}`);
  const handleChangeCity = (event) => {
    setCity(event.target.value);
  };




  return (
    <div>
      <Header1 onClick={()=>navigate("/")} />
      <form className="flex justify-center text-center flex-col items-center mt-12 ">
        <h1>
          Create <span>Account</span>
        </h1>
        <h2 className="text-darkblue text-3xl mt-3">Welcome!</h2>

        <div className="flex w-full justify-evenly mt-4 px-[250px] ">
          <div className="">
            <form action="">
              <div className="flex flex-1 gap-2">
                <div>
                  <p className="text-start my-2 text-[1rem] ">First Name</p>
                  <InputFields name={"firstname"} type={"text"} placeholder={"First Name"} />
                </div>
                <div>
                  <p className="text-start my-2 text-[1rem] ">Last Name</p>
                  <InputFields name={"lastname"} type={"text"} placeholder={"Last Name"} />
                </div>
              </div>
              <div>
                <p className="text-start mb-1.5 text-[1rem] ">Email</p>
                <InputFields name={"email"} type={"email"} placeholder={"Email"} />
              </div>
              <div>
                <p className="text-start mb-1.5 text-[1rem] ">Password</p>
                <InputFields name={"password"} type={"password"} placeholder={"Password"} />
              </div>
              <div>
                <p className="text-start mb-1.5 text-[1rem] ">Confirm Password</p>
                <InputFields name={"confirmpassword"} type={"password"} placeholder={"Confirm Password"} />
              </div>
            </form>
          </div>
          <div>
            <div>
              <form action="" className=" w-[402px]">
                <p className="text-start my-2 text-[1rem] ">Date of Birth</p>
                <div className="flex flex-1 gap-2 ">
                  <div className="w-full gap-2">
                    <Dropdown items={selectDay} handleChange={handleChangeDay} value={day} />
                  </div>
                  <div className="w-full">
                    <Dropdown items={selectMonth} handleChange={handleChangeMonth} value={month} />
                  </div>
                  <div className="w-full">
                    <Dropdown items={selectYear} handleChange={handleChangeYear} value={year} />
                  </div>
                </div>
                <div className="flex flex-1 gap-2 ">
                  <div className=" w-full flex  gap-2 ">
                    <div className="w-full">
                      <p className="text-start my-2 text-[1rem]">Department</p>
                      <Dropdown items={selectDepartment} handleChange={handleChangeDepartment} value={department} />
                    </div>
                    <div className="w-full ">
                      <p className="text-start my-2 text-[1rem]">Position</p>
                      <InputFields name={"position"} type={"text"} placeholder={"Position"} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 gap-2 ">
                  <div className=" w-full flex  gap-2 ">
                    <div className="w-full">
                      <p className="text-start my-2 text-[1rem]">Street Adress</p>
                      <Dropdown items={selectStreetAddress} handleChange={handleChangeStreetAdress} value={streetaddress} />
                    </div>
                    <div className="w-full ">
                      <p className="text-start my-2 text-[1rem]">Barangay</p>
                      <Dropdown items={selectBarangay} handleChange={handleChangeBarangay} value={barangay} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 gap-2 ">
                <div className=" w-full flex  gap-2 ">
                <div className="w-full">
                <p className="text-start my-2 text-[1rem]">City</p>
                <Dropdown items={selectCity} handleChange={handleChangeCity} value={city} />
                </div>
                <div className="w-full ">
                <p className="text-start my-2 text-[1rem]">Zip Code</p>
                <InputFields name={"zipcode"} type={"text"} placeholder={"Zip Code"} />
                </div>
                </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Button style="text-white bg-uppsdarkblue hover:bg-uppsyellow rounded-full py-5 px-28 mb-7 mt-3" title={"Create Account"} onClick={()=>navigate("/registrationcode")}/>
      </form>
    </div>
  )
}

export default CreateAccount;
