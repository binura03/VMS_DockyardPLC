
import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Swal from "sweetalert2";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import "./UpdateUser.css";

Modal.setAppElement("#root");

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    Sno: "",
    Rname: "",
    VehicleNo: "",
    VehicleType: "",
    VehicleRfidTag: "",
  });

  const [formErrors, setFormErrors] = useState({
    VehicleNo: false,
    VehicleRfidTag: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false); // New state for screen size

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const barcodeNo = urlParams.get("barcodeNo");
    if (barcodeNo) {
      setFormData((prevState) => ({
        ...prevState,
        VehicleRfidTag: barcodeNo,
      }));
    }
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 400); // Set your mobile breakpoint here
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "Sno") {
      newValue = value.replace(/\D/g, "");
      if (newValue.length > 7) {
        newValue = newValue.slice(0, 7);
      }
    } else if (name === "Rname") {
      newValue = value.replace(/[^a-zA-Z\s.]/g, "").toUpperCase();
    } else if (name === "VehicleRfidTag") {
      newValue = value.replace(/\D/g, "");
      if (newValue.length > 6) {
        newValue = newValue.slice(0, 6);
      }
    } else if (name === "VehicleNo") {
      newValue = value.replace(/[^a-zA-Z0-9\s-]/g, "").toUpperCase();
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    if (name === "Sno") {
      fetchVehicleDetails(newValue);
    }

    if (name === "VehicleRfidTag") {
      fetchVehicleDetails2(newValue);
    }

  };

  const fetchVehicleDetails = async (Sno) => {
    if (Sno) {
      try {
        const response = await axios.get(
          `https://esystems.cdl.lk/backend/GateSolution/UhfRfid/GetVehicleDetails?SNo=${Sno}`
        );
        const vehicle = response.data.ResultSet[0];
        if (vehicle) {
          setFormData((prevState) => ({
            ...prevState,
            Rname: vehicle.EmployeeName,
            VehicleNo: vehicle.VehicalNo,
            VehicleType: vehicle.VehicalType,
          }));
        } else {
          setFormData((prevState) => ({
            ...prevState,
            Rname: "",
            VehicleNo: "",
            VehicleType: "",

          }));
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error.message);
      }
    }
  };

  const fetchVehicleDetails2 = async (VehicleRfidTag) => {
    if (VehicleRfidTag) {
      try {
        const response = await axios.get(
          `https://esystems.cdl.lk/backend/GateSolution/UhfRfid/getUserDetails?RFIDCode=${VehicleRfidTag}`
        );
        const vehicle = response.data.ResultSet[0];
        if (vehicle) {
          setFormData((prevState) => ({
            ...prevState,
            Sno: vehicle.SeNo,
            Rname: vehicle.EmployeeName,
            VehicleNo: vehicle.VehicalNo,
            VehicleType: vehicle.VehicalType,
          }));
        } else {
          setFormData((prevState) => ({
            ...prevState,
            Sno: "",
            Rname: "",
            VehicleNo: "",
            VehicleType: "",

          }));
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error.message);
      }
    }
  };


  const handleSubmit = async () => {
    const errors = {};
    let hasErrors = false;

    if (!formData.VehicleNo) {
      errors.VehicleNo = true;
      hasErrors = true;
    }
    if (!formData.VehicleRfidTag) {
      errors.VehicleRfidTag = true;
      hasErrors = true;
    }

    if (hasErrors) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch(
        `https://esystems.cdl.lk/backend/GateSolution/UhfRfid//UpdateRfiedReg?Sno=${formData.Sno}&Rname=${formData.Rname}&VehicleType=${formData.VehicleType}&VehicleNo=${formData.VehicleNo}&VehicleRfidTag=${formData.VehicleRfidTag}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit form data");
      }

      const responseData = await response.json();
      console.log(responseData);

      if (responseData.StatusCode === 500) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Vehicle Tag Already Exist",
        });
      } else if (response.status === 200) {
        setFormData({
          Sno: "",
          Rname: "",
          VehicleNo: "",
          VehicleType: "",
          VehicleRfidTag: "",
        });

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Form data submitted successfully!",
        });
      }
    } catch (error) {
      console.error("Error submitting form data:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit form data. Please try again later.",
      });
    }
  };

  const handleDoubleClick = async () => {
    try {
      const response = await axios.get(
        `https://esystems.cdl.lk/backend/GateSolution/UhfRfid/GetVehicleDetails?SNo=`
      );
      setVehicleData(response.data.ResultSet);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching vehicle data:", error.message);
    }
  };

  const handleRowClick = (vehicle) => {
    setFormData({
      Sno: vehicle.SeNo,
      Rname: vehicle.EmployeeName,
      VehicleNo: vehicle.VehicalNo,
      VehicleType: vehicle.VehicalType,
      VehicleRfidTag: formData.VehicleRfidTag, // Preserve the RFID tag value
    });
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredVehicleData = vehicleData.filter((vehicle) =>
    vehicle.SeNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("Details =", vehicleData);
  return (
    <div>
      <Header />
      <section className="containerUser">
        <header>Vehicle User Details</header>
        <div className="form">


        <div className="input-box">
            <input
              type="text"
              name="VehicleRfidTag"
              value={formData.VehicleRfidTag}
              onChange={handleChange}
              placeholder="Enter Vehicle RFID Tag"
              required
            />
            {formErrors.VehicleRfidTag && (
              <span className="error-message">
                Vehicle RFID Tag is required
              </span>
            )}
          </div>


          <div className="input-box">
            <input
              type="text"
              name="Sno"
              value={formData.Sno}
              onChange={handleChange}
              onDoubleClick={handleDoubleClick}
              placeholder="Enter Service Number"
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="Rname"
              value={formData.Rname}
              onChange={handleChange}
              onDoubleClick={handleDoubleClick}
              onTouchStart={handleDoubleClick}
              placeholder="Enter Employee Name"
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="VehicleNo"
              value={formData.VehicleNo}
              onChange={handleChange}
              onDoubleClick={handleDoubleClick}
              placeholder="Enter Vehicle No"
              required
            />
            {formErrors.VehicleNo && (
              <span className="error-message">Vehicle No is required</span>
            )}
          </div>


          <div className="input-box">
            <select
              name="VehicleType"
              value={formData.VehicleType}
              onChange={handleChange}
              onDoubleClick={handleDoubleClick} 
              style={{ width: '418px', height: '40px', fontSize: '16px' , borderRadius: '5px', color: 'gray', paddingLeft: '10px',  borderColor: 'transparent'}}
              required
            >
              <option value="" disabled>
                Enter Vehicle Type
              </option>
              <option value="CAR">CAR</option>
              <option value="MOTORCYCLE">MOTOR CYCLE</option>
              <option value="JEEP">JEEP</option>
              <option value="SUV">SUV</option>
              <option value="THREE WHEEL">THREE WHEEL</option>
              <option value="VAN">VAN</option>
              <option value="CAB">CAB</option>
              <option value="SCOOTER">SCOOTER</option>
              <option value=" ">UNKNOWN</option>
              
            </select>
            {formErrors.VehicleType && (
              <span className="error-message">Vehicle Type is required</span>
            )}
          </div>





          <button type="button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </section>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Vehicle Data"
      >
        <h2>Select Vehicle</h2>
        <input
          type="text"
          placeholder="Search by Service Number"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-box"
        />
        <table className="gridTbl">
          <thead>
            <tr>
              <th className="thClz">Service No</th>
              <th className="thClz">Vehicle No</th>
              <th className="thClz">Employee Name</th>
              <th className="thClz">Vehicle Type</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredVehicleData) &&
            filteredVehicleData.length > 0 ? (
              filteredVehicleData.map((vehicle) => (
                <tr
                  key={vehicle.VehicalNo}
                  onClick={() => handleRowClick(vehicle)}
                >
                  <td className="tdCls">{vehicle.SeNo}</td>
                  <td className="tdCls">{vehicle.VehicalNo}</td>
                  <td className="tdCls">{vehicle.EmployeeName}</td>
                  <td className="tdCls">{vehicle.VehicalType}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No data available</td>
              </tr>
            )}
          </tbody>
        </table>

        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </Modal>
      <div className="foot">
        <Footer />
      </div>
      {isMobile ? (
        <div className="mobileMessage">You are using a mobile device</div>
      ) : (
        <div className="desktopMessage">You are using a desktop device</div>
      )}
    </div>
  );
};

export default RegistrationForm;
