import { GenericTable } from "../components/GenericTable";
import  Button  from "../components/Button";
import userProfileImage from "../assets/tutin.png";
import { HeaderLoggedIn } from "../components/HeaderLoggedIn";
import { useSelector } from "react-redux";
import axios from "axios"
import { useState, useEffect } from "react"
import { RequestPersonnelHistory } from "../components/RequestPersonnelHistory";
import { HistoryRequestDetailsModal } from "../components/HistoryRequestDetailsModal";
import { MdModeEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import { updateUserData } from "../features/user";


export const PersonnelProfilePage = () => {
  

  const user = useSelector((state) => state.user.value.user);
  const dispatch = useDispatch();


  const [retrieveRequest, setRetrieveRequest] = useState([])
  const [showModal, setShowModal] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState({
    city: "",
    barangay: "",
    street_address: "",
  });



  const toggleEditing = async () => {
    if (isEditingAddress) {
      try {
        const response = await axios.patch(`http://127.0.0.1:8000/api/updateuser/${user.id}/`, {
          street_address: address.street_address,
          barangay: address.barangay,
          city: address.city
        });

        const data = response.data;

        dispatch(updateUserData(data))
        
        console.log("Address updated successfully.");
      } catch (error) {
        console.error("Failed to save address:", error);
        alert("Error saving address. Please try again.");
        return;
      }
    }

    setIsEditingAddress(!isEditingAddress); // Toggle editing state
  };


  const handleAddressChange = (e) => {
    const { name, value } = e.target; // Ensure input elements have a "name" attribute
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const handleDetailsClick = (requestDetail) => {
    setSelectedRequest(requestDetail);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const fetchRequestHistory = async (id) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/retrievepersonnelrequest/${id}/`);
        const data = response.data;
        console.log(data);

        // Map the API response to table data
        const mappedData = data.map((requestDetail) =>
            RequestPersonnelHistory(requestDetail, handleDetailsClick, closeModal)
        );

        console.log(mappedData)

        setRetrieveRequest(mappedData);
    } catch (e) {
        console.error(e);
    }
};


  useEffect(() => {
    setAddress({
      city: user.city || "",
      barangay: user.barangay || "",
      street_address: user.street_address || "",
    });
  }, [user]);
    
  console.log(user.id)


  const personnelProfilePageHeader = ["Type of Request", "Date", "Details"];

  const personnelProfilePageData = [
    {
      "Type of Request": "Printing",
      Date: "6/7/2025",
      Details: (
        <Button
          title={"Details"}
          style={
            "bg-[#17163A] text-white rounded-[5px] px-[0.8rem] py-[0.2rem]"
          }
        ></Button>
      ),
    },
  ];

  useEffect(() => {
    fetchRequestHistory(user.id)
  }, [user.id])

  return (
    <div className="personnel-profile-page flex flex-col">
      <HeaderLoggedIn />
      <div className="personnel-profile-page-main w-full max-w-full flex flex-col relative]">
        <div className="h-[15rem] w-full max-w-full bg-[#17163A] z-0"></div>
        <div className="personnel-profile-page-content w-full max-w-[1200px] m-auto flex gap-6 z-1 relative top-[-5rem]">
          <div className="personnel-profile-page-content-left flex flex-col w-full max-w-[35%] items-center">
            <div className="user-profile-page-content flex flex-col bg-[#F8B41F] w-full text-center py-[4rem] rounded-[10px] gap-6">
              <div className="user-profile-page-image h-[10rem] w-[10rem] rounded-[100rem] self-center">
                <img
                  src={userProfileImage}
                  alt="User"
                  className="rounded-[100rem] border-white border-[4px]"
                />
              </div>
              <p className="text-white text-[clamp(1.2rem,3vw,2rem)]">
                {user.first_name} {user.last_name} 
              </p>
            </div>
            <div className="user-profile-account-details w-full mt-[3rem]">
              <div className="flex items-center justify-between">
                <h1>Account Information</h1>
                <MdModeEdit
                  onClick={toggleEditing}
                  style={{ fontSize: "20px", color: "#17163A", cursor: "pointer" }}
                />
              </div>
              <div className="contant-information mt-[2rem]">
                <p className="text-[clamp(1.2rem,3vw,1.5rem)] text-[#717171]">
                  Contact Information
                </p>
                <table className="mt-[2rem]">
                  <tr>
                    <td className="font-bold">Address:</td>
                    <td className="pl-5">
                    {isEditingAddress ? (
                          <>
                            <input
                              type="text"
                              name="street_address"
                              value={address.street_address}
                              onChange={handleAddressChange}
                              className="border rounded px-2 py-1 w-full mb-2"
                              placeholder="Street Address"
                              autoFocus
                            />
                            <input
                              type="text"
                              name="barangay"
                              value={address.barangay}
                              onChange={handleAddressChange}
                              className="border rounded px-2 py-1 w-full mb-2"
                              placeholder="Barangay"
                            />
                            <input
                              type="text"
                              name="city"
                              value={address.city}
                              onChange={handleAddressChange}
                              className="border rounded px-2 py-1 w-full"
                              placeholder="City"
                            />
                          </>
                        ) : (
                          <span>
                            {address.street_address}, {address.barangay},{" "}
                            {address.city}
                          </span>
                        )}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">Email:</td>
                    {<td className="pl-5">{user.email}</td>}
                  </tr>
                </table>
              </div>
              <div className="contant-information mt-[2rem]">
                <p className="text-[clamp(1.2rem,3vw,1.5rem)] text-[#717171]">
                  Other Information
                </p>
                <table className="mt-[2rem]">
                  <tr>
                    <td className="font-bold">Position:</td>
                    <td className="pl-5">{user.position.position_name}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Department:</td>
                    <td className="pl-5">{user.department.department_name}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div className="personnel-profile-page-content-right w-full max-w-[65%] px-[2rem] pt-[2rem] rounded-[10px] bg-white">
            <div className="personnel-profile-page-content-right-content">
              <div className="flex justify-between items-center w-full text-center">
                <h1>Order History</h1>
                <Button
                  title={"Filter"}
                  style={
                    "bg-[#17163A] text-white rounded-[5px] px-[1.5rem] py-[0.2rem]"
                  }
                ></Button>
              </div>
              <GenericTable
                headers={personnelProfilePageHeader}
                data={retrieveRequest}
                thStyle={"bg-navy text-white"}
              ></GenericTable>
               {showModal && selectedRequest && (
                  <HistoryRequestDetailsModal
                  requestDetail={selectedRequest}
                  onClose={closeModal}
                />
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
