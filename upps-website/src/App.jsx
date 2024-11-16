
import { BrowserRouter, Routes , Route, Navigate} from 'react-router-dom'
// import Button from '@mui/material/Button';
import '../src/styles/fonts.css'
import { PersonnelProfile } from './components/PersonnelProfile'
// import { Header1 } from './components/Header1'
// import { DashboardTable } from './components/Dashboard-table'
import { LandingPage } from './components/LandingPage'
import Login from '../src/screens/Login.jsx'
import { CreateAccount } from '../src/screens/CreateAccount.jsx'
import ForgotPassword from './screens/ForgotPassword.jsx';
import DoneRegister from './screens/DoneRegister.jsx'
import DoneChangePassword from './screens/DoneChangePassword.jsx';
import NewPassword from './screens/NewPassword.jsx';
import ChangePasswordCode from './screens/ChangePasswordCode.jsx';
import RegistrationCode from './screens/RegistrationCode.jsx';
import StudentForm from './screens/StudentForm.jsx';
import QueueScreen from './screens/QueueScreen.jsx';
import {PrintingRequestForm} from './screens/PrintingRequestForm.jsx';
import { PersonnelExaminationValidationTable  } from './screens/PersonnelExaminationValidationTable.jsx'
import { Sample } from './screens/Sample.jsx'
import {PersonnelPrintingQueue} from './screens/PersonnelPrintingQueue.jsx'
import {RequestDetails} from './screens/RequestDetails.jsx'
import {Example} from './screens/Example.jsx'
import {ChairmanDashboard} from './screens/ChairmanDashboard.jsx'
import './../node_modules/bootstrap/dist/css/bootstrap.min.css'
import {PrintingTransaction} from './screens/PrintingTransaction.jsx'
import { BillingForm } from './screens/BillingForm.jsx'
import {PrintingInventory} from './screens/PrintingInventory.jsx'



 function App() {

  
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Navigate to={"/landingpage"} replace/>} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/changepasswordcode" element={<ChangePasswordCode />} />
          <Route path="/donechangepassword" element={<DoneChangePassword />} />
          <Route path="/newpassword" element={<NewPassword />} /> */}
          
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/registrationcode" element={<RegistrationCode />} />
          <Route path="/doneregister" element={<DoneRegister />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path="/landingpage" element={<LandingPage />} />
  
          {/* <Route path="/personnel/request/print" element={<PrintingRequestForm/>} />
          
          <Route path="/chairman/dashboard" element={<ChairmanDashboard />} />

          <Route path="/officehead/print/queue" element={<PersonnelPrintingQueue />} />
          <Route path="/officehead/transactionbill" element={<PrintingTransaction/>} />
          <Route path="/officehead/billingform" element={<BillingForm/>} />
          <Route path="/officehead/inventory" element={<PrintingInventory />} /> */}

           
        </Routes>
      </BrowserRouter> 
      {/* <PersonnelProfile></PersonnelProfile> */}
      {/* <LandingPage></LandingPage> */}

      
      

      
      
      {/* <PrintingTransaction/>
      <BillingForm /> */}

      {/* <Example/> */}
      {/* <RequestDetails /> */}
      {/* <Sample /> */}
      {/* <StudentForm /> */}
      {/* <QueueScreen /> */}
      {/* <PersonnelExaminationValidationTable/> */}
    </>
  )
}

export default App
