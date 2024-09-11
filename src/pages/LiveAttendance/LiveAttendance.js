import React from "react";
import "./LiveAttendance.css";

const LiveAttendance = () => {
  const user = {
    id: "0004081",
    name: "K.V.S. Chathurya",
    location: "CAL 532",
    date: "2024-08-16",
    time: "8:40 AM",
    avatar: "", // Add the avatar URL if available
  };

  const vehicles = [
    { id: "000427", owner: "A.V. Mukkimaya", registration: "AO4 1324" },
    { id: "000491", owner: "A.R. Aswara", registration: "AO1 4321" },
    { id: "XXXXXX", owner: "R.K.R.R", registration: "KA01 XXXX" },
  ];

  return (
    <div className="vehicle-management-system">
      <header>
        <h1>Vehicle Management System</h1>
        <p>{`${user.date} @ ${user.time}`}</p>
      </header>
      <div className="user-info">
        <div className="avatar">
          {user.avatar ? (
            <img src={user.avatar} alt="User Avatar" />
          ) : (
            <div className="placeholder-avatar"></div>
          )}
        </div>
        <div className="user-details">
          <p>{user.id}</p>
          <p>{user.name}</p>
          <p>{user.location}</p>
        </div>
      </div>
      <div className="vehicle-list">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="vehicle-item">
            <input type="checkbox" id={vehicle.id} />
            <label htmlFor={vehicle.id}>
              {vehicle.id} - {vehicle.owner} - {vehicle.registration}
            </label>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default LiveAttendance;
