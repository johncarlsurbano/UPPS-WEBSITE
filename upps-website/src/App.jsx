
import { BrowserRouter, Routes , Route, Navigate} from 'react-router-dom'
// import Button from '@mui/material/Button';
import '../src/styles/fonts.css'
// import { Header1 } from './components/Header1'
// import { DashboardTable } from './components/Dashboard-table'
// import { LandingPage } from './components/LandingPage'
import Login from '../src/screens/Login.jsx'
import CreateAccount from '../src/screens/CreateAccount.jsx'
import ForgotPassword from './screens/ForgotPassword.jsx';
import DoneRegister from './screens/DoneRegister.jsx'
import DoneChangePassword from './screens/DoneChangePassword.jsx';
import NewPassword from './screens/NewPassword.jsx';
import ChangePasswordCode from './screens/ChangePasswordCode.jsx';
import RegistrationCode from './screens/RegistrationCode.jsx';

function App() {

  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={"/login"} replace/>} />
          <Route path='/login' element={<Login />}></Route>
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/registrationcode" element={<RegistrationCode />} />
          <Route path="/doneregister" element={<DoneRegister />}></Route>
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/changepasswordcode" element={<ChangePasswordCode />} />
          <Route path="/donechangepassword" element={<DoneChangePassword />} />
        </Routes>
      </BrowserRouter> 
    </>
  )
}

export default App
