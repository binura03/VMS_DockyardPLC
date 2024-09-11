import "./App.css";
import VehicleRegistrationprevious from "../src/pages/VehicleRegistrationprevious/VehicleRegistrationprevious";
import VehicleRegistration from "../src/pages/VehicleRegistration/VehicleRegistration";
import UpdateUser from "../src/pages/UpdateUser/UpdateUser";
import AttendenceLog from "../src/pages/AttendenceLog/attendenceLog";
import Login from "../src/pages/Login/login";
import LiveAttendanceLogin from "../src/pages/LiveAttendanceLogin/LiveAttendanceLogin";
import GardView from "../src/pages/GardView/GardView";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/GardView" element={<GardView />}></Route>
        <Route path="/vehicleRegistration" element={<VehicleRegistration />} ></Route>
        <Route path="/VehicleRegistrationprevious" element={<VehicleRegistrationprevious />} ></Route>
        <Route path="/attendenceLog" element={<AttendenceLog />}></Route>
        <Route path="/LiveAttendanceLogin" element={<LiveAttendanceLogin />}></Route>
        <Route path="/UpdateUser" element={<UpdateUser />}></Route>
        <Route path="/*" element={<Login />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
