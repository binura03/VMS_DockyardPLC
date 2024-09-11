import './header.css'
import VehicleRegistration from '../../pages/VehicleRegistration/VehicleRegistration';
import AttendenceLog from '../../pages/AttendenceLog/attendenceLog';
import Login from '../../pages/Login/login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const nav = () => {


  return (
<Router>
    <Routes>
    <Route path="/login" element={<Login />}></Route>
    <Route path="/vehicleRegistration" element={<VehicleRegistration />}></Route>
    <Route path="/attendenceLog" element={<AttendenceLog />}></Route>
    <Route path="/*" element={<Login />}></Route>
  </Routes>
</Router>
 
  );
}

export default nav;