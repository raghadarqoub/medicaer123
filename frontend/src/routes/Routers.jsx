import Home from '../pages/Home.jsx'
import Services from '../pages/Services.jsx'
import Login from '../pages/Login.jsx'
import Signup from '../pages/Signup.jsx'
import Contact from '../pages/Contact.jsx'
import Doctors from '../pages/Doctors/Doctors.jsx'
import DoctorDetails from '../pages/Doctors/DoctorDetails.jsx'
import MyAccount from '../Dashboard/user-account/MyAccount.jsx'
import Dashboard from '../Dashboard/doctor-account/Dashboard.jsx'
import CheckoutSuccess from '../pages/CheckoutSuccess.jsx'
// import Chat from '../pages/Chat.jsx'
import { Routes ,Route} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Chat from '../pages/Chat/Chat.jsx'
const Routers = () => {
return (
    <Routes>
<Route path="/" element={<Home/>}/>
<Route path="home/" element={<Home/>}/>
{/* <Route path="/chat" element={<Chat/>}/> */}
<Route path="/doctors" element={<Doctors/>}/>
<Route path="/doctors/:id" element={<DoctorDetails/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/register" element={<Signup/>}/>
<Route path="/contact" element={<Contact/>}/>
<Route path="/services" element={<Services/>}/>
<Route path="/chat" element={<Chat/>}/>

<Route path="/checkout-success" element={<CheckoutSuccess/>}/>
<Route path="/users/profile/me" element={<ProtectedRoute allowedRoles={["patient"] }><MyAccount/></ProtectedRoute>}/>
<Route path="/doctors/profile/me" element={<ProtectedRoute allowedRoles={["doctor"] }><Dashboard/></ProtectedRoute>}/>

    </Routes>
    )
}
export default Routers
