
import { BrowserRouter, Routes , Route, Outlet, Navigate} from 'react-router-dom'
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
// import StudentForm from './screens/StudentForm.jsx';
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
import { JobOrderForm } from './screens/JobOrderForm.jsx'
import { JobOrderBookBind } from './screens/JobOrderBookBind.jsx'
import { JobOrderLamination } from './screens/JobOrderLamination.jsx'
import {PrintingInventory} from './screens/PrintingInventory.jsx'
import {StudentPrintingForm} from './screens/StudentPrintingForm.jsx'
import {PersonnelPrintRequestForm} from './screens/PersonnelPrintRequestForm.jsx'
import {ProtectedRoute} from './components/ProtectedRoute.jsx'
import { PersonnelPage } from './screens/PersonnelPage.jsx'
import { OfficeHeadPage } from './screens/OfficeHeadPage.jsx'
import { PersonnelProfilePage } from './screens/PersonnelProfilePage.jsx'
import { StudentRequestForm } from './screens/StudentRequestForm.jsx'
import { PaymentSlipForm } from './screens/PaymentSlipForm.jsx'
import { BookBindPaymentSlip } from './screens/BookBindPaymentSlip.jsx'
import { PaymentSlipLaminationForm } from './screens/PaymentSlipLaminationForm.jsx'
import { InventoryPage } from './screens/InventoryPage.jsx'
import { PersonnelBookBindingRequestForm } from './screens/PersonnelBookBindingRequestForm.jsx'
import { PersonnelLaminationRequestForm } from './screens/PersonnelLaminationRequestForm.jsx'
import { StudentBookBindForm } from './screens/StudentBookBindForm.jsx'
import { StudentLamination } from './screens/StudentLamination.jsx'
import { TransactionPage } from './screens/TransactionPage.jsx'
import { OfficeHeadProfilePage } from './screens/OfficeHeadProfilePage.jsx'
import { StudentForm  } from './screens/StudentForm.jsx'
import { PersonnelForm } from './screens/PersonnelForm.jsx'
import { RawMaterialsInventory } from './components/RawMaterialsInventory.jsx'
import { StockCard } from './screens/StockCard.jsx'

 

 function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          

          <Route path="/" element={<Navigate to={"/stockcard"} replace/>} />
          <Route path="/stockcard" element={<StockCard />} />
          
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/registrationcode" element={<RegistrationCode />} /> 
          <Route path="/doneregister" element={<DoneRegister />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/changepasswordcode" element={<ChangePasswordCode />} />
          <Route path="/donechangepassword" element={<DoneChangePassword />} />
          <Route path="/newpassword" element={<NewPassword />} /> 

          <Route path="/student/request/print" element={<StudentPrintingForm/>} />
          <Route path="/student/request/bookbind" element={<StudentBookBindForm />} />
          <Route path="/student/request/laminate" element={<StudentLamination />} />
          <Route path="/student/form/" element={<StudentForm />} />
          

          {/* <Route path="/student-request-form" element={<StudentRequestForm/>} /> */}
          <Route path="/student/paymentslip" element={<PaymentSlipForm />} />
          <Route path="/bookbind/paymentslip" element={<BookBindPaymentSlip />} />
          <Route path="/lamination/paymentslip" element={<PaymentSlipLaminationForm />} />
      
          <Route path="/personnel/*" element={
            <ProtectedRoute allowedRoles={["Personnel"]}>
              <Outlet />
            </ProtectedRoute>
          }>
            <Route path="request/print" element={
              <ProtectedRoute allowedRoles={["Personnel"]} checkAccountStatus={true}>
                <PersonnelPrintRequestForm />
              </ProtectedRoute>
            }/>
            <Route path="dashboard" element={<PersonnelPage />} />
            <Route path="profile" element={<PersonnelProfilePage />} />
            <Route path="request/bookbind" element={<PersonnelBookBindingRequestForm/>}/>
            <Route path="request/laminate" element={<PersonnelLaminationRequestForm/>}/>
            <Route path="form" element={<PersonnelForm />} />
          </Route>

          
      
          <Route path="/chairman/*" element={
            <ProtectedRoute allowedRoles={["Chairman"]}>
              <Outlet />
            </ProtectedRoute>} >

            <Route path='dashboard2' element={<ChairmanDashboard />}  />
            <Route path='dashboard' element={<PersonnelPage />} />
          </Route>

         {/* OFFICE HEAD ROUTES */}
          <Route path="/officehead/*" element={
            <ProtectedRoute allowedRoles={["Office Head"]}>
              <Outlet />
            </ProtectedRoute>}>
              <Route path="dashboard" element={<OfficeHeadPage />} />
              <Route path="print/queue" element={<PersonnelPrintingQueue />} />
              {/* <Route path="transactionbill" element={<PrintingTransaction/>} /> */}
              {/* <Route path="inventory" element={<PrintingInventory />} /> */}
              <Route path='transactionbill' element={<TransactionPage />} />
              <Route path="profilepage" element={<OfficeHeadProfilePage/>} />
              <Route path="inventory" element={<InventoryPage/>} />
              <Route path="stockcard" element={<StockCard />} />
              {/*  */}

          </Route>
              <Route path="/officehead/billingform" element={<BillingForm/>} />
              <Route path="/officehead/joborderform" element={<JobOrderForm/>} />
              <Route path="/officehead/joborderbookbindform" element={<JobOrderBookBind/>} />
              <Route path="/officehead/joborderlaminationform" element={<JobOrderLamination/>} />
              
              
              

             
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
