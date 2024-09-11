import "./header.css";
import React, { useState } from "react";
import logo from "../../assets/images/attendme1.png";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";


const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = () => {
    setShowMenu(false);
  };

  const handleLogout = () => {
    window.location.href = "/";
  };
  return (
    <nav className="navbar">
      <img src={logo} alt="logo" className="logo" />

      <div className="desktopMenu">
        <Link to="/vehicleRegistration" className="desktopMenuItemList">
          Vehicle Registration
        </Link>
        <Link to="/UpdateUser" className="desktopMenuItemList">
          User Update
        </Link>
        <Link to="/VehicleRegistrationprevious" className="desktopMenuItemList">
          Vehicle User Details
        </Link>
        <Link to="/attendenceLog" className="desktopMenuItemList">
          Attendance Log
        </Link>
      </div>

      {/* <div className='logoutBtn'>
        <button className='desktopMenuBtn' onClick={handleLogout}>
          <HiOutlineLogout className='desktopMenuIcon' /> Log Out
        </button>
        </div> */}
      <div className="navMenuMob">
        <IoMenu className="mobMenu" onClick={() => setShowMenu(!showMenu)} />

        <div
          className="navMenu"
          style={{ display: showMenu ? "flex" : "none" }}
        >
          <Link
            to="/vehicleRegistration"
            className="mobileMenuItem"
            onClick={handleMenuClick}
          >
            Vehicle Registration
          </Link>
          <Link
            to="/attendenceLog"
            className="mobileMenuItem"
            onClick={handleMenuClick}
          >
            Attendance Log
          </Link>
          <div className="logoutBtn">
            <button className="desktopMenuBtn" onClick={handleLogout}>
              <LuLogOut className="logoutIcon"/>
              <p className="logout">Log Out</p>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
