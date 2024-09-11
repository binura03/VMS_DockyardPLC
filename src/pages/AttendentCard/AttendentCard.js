import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Grid,
  Typography,
  Avatar,
  CircularProgress,
  Toolbar,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Card,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import LogoImg from "../../assets/images/dockyard.png";
import AdbIcon from "@mui/icons-material/Adb";
import Dockyardgif from "../../assets/images/Dockyardgif.gif";

export default function AttendentCard() {
  const [userData, setUserData] = useState(null);
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevVehicleData, setPrevVehicleData] = useState([]);
  const [selectedGate, setSelectedGate] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState(new Date());

  const fetchData = () => {
    const gateNo = selectedGate === 0 ? "1,2" : "3,4";
    fetch(
      `https://esystems.cdl.lk/backend/GateSolution/UhfRfid/GetNewRecords?GateNo=${gateNo}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.ResultSet) {
          const sortedData = data.ResultSet.sort((a, b) => {});

          const firstRecord = sortedData[0];
          setUserData({
            id: firstRecord.SeNo || null,
            name: firstRecord.Name || null,
            plate: firstRecord.VehicalNo,
            date: firstRecord.BarcodeDate,
            time: firstRecord.BarcodeTime,
          });

          const newRecords = sortedData.filter(
            (record) =>
              !prevVehicleData.some(
                (prevRecord) => prevRecord.BarcodeNo === record.BarcodeNo
              )
          );

          setVehicleData(sortedData.slice(0, 9)); // Take only the first 12 records
          setPrevVehicleData(sortedData);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [selectedGate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedGate(newValue);
  };
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    navigate("../LiveAttendanceLogin", { replace: true });
  };
  const formatDate = (date) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = daysOfWeek[date.getDay()];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading 0 if needed
    const dateOfMonth = String(date.getDate()).padStart(2, "0"); // Add leading 0 if needed
    return `${day}, ${year}-${month}-${dateOfMonth}`;
  };
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box pt={6}>
      <AppBar position="fixed" sx={{ backgroundColor: "#1B3F95" }}>
        <Toolbar>
          <Box
            component="img"
            src={LogoImg}
            alt="Logo"
            sx={{
              height: 40,
              marginRight: 2,
              background: "white",
              borderRadius: "10px",
            }}
          />
          <Typography variant="h6" sx={{ flexGrow: 0.1 }}>
            CDPLC Vehicle Management System
          </Typography>

          <Tabs
            sx={{ flexGrow: 0.8 }}
            value={selectedGate}
            onChange={handleTabChange}
            textColor="inherit"
            aria-label="full width tabs example"
            centered
          >
            <Tab
              label="Gate No 01 "
              sx={{
                color:
                  selectedGate === 0 ? "white" : "rgba(255, 255, 255, 0.7)",
                backgroundColor:
                  selectedGate === 0
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            />
            <Tab
              label="Gate No 03 "
              sx={{
                color:
                  selectedGate === 1 ? "white" : "rgba(255, 255, 255, 0.7)",
                backgroundColor:
                  selectedGate === 1
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            />
          </Tabs>
          <Typography
            variant="body1"
            sx={{ marginRight: 2, textAlign: "center" }}
          >
            {dateTime.toLocaleTimeString()}
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginRight: 2, textAlign: "center" }}
          >
            {formatDate(dateTime)}
          </Typography>

          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ marginLeft: "auto" }}
          >
            <ExitToAppIcon />
          </IconButton>

          {/* Menu for Logout */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {/* Main Content */}
      <Box p={3}>
        <Grid container spacing={3}>
          {vehicleData.map((vehicle, index) => (
            <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
              <Box
                display="flex"
                alignItems="center"
                p={3}
                borderRadius={2}
                boxShadow={5}
                backgroundColor="background.paper"
                sx={{
                  backgroundColor:
                    vehicle.BarcodeIOStatus === "I" ? "lightgreen" : "#F9E7E7",
                }}
              >
                <Avatar
                  src={`https://esystems.cdl.lk/backend/GateSolution/UhfRfid/GetUserImg?SNo=${vehicle.SeNo}`}
                  alt={vehicle.Name}
                  sx={{
                    width: { xs: 100, md: 200 },
                    height: { xs: 120, md: 220 },
                    borderRadius: 0,
                    border: "2px solid #d1d124",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                    mr: 3,
                  }}
                />
                <Box display="flex" flexDirection="column">
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: "black", mb: 1 }}
                  >
                    {vehicle.Name}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: "red", mb: 1 }}
                  >
                    {vehicle.VehicalNo}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: "black", mb: 1 }}
                  >
                    {vehicle.BarcodeTime}
                  </Typography>

                  <Box display="flex" alignItems="center"
                  >
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      sx={{ color: "black", mr: 20 }}
                    >
                      Gate No {vehicle.ClockNo}
                    </Typography>
                 
                  <Typography
                      variant="h5"
                      fontWeight="bold"
                      sx={{
                        color:
                          vehicle.BarcodeIOStatus === "I" ? "green" : "red",
                      }}
                    >
                      {vehicle.BarcodeIOStatus === "I" ? "IN" : "OUT"}{" "}
                    </Typography>
                 
                    
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <footer className="footer1">
        <div>
          <span>&#169; Copyright</span>
          DTS. All Rights Reserved
        </div>
        <div>
          Designed by &nbsp;
          <a href="https://www.dockyardsolutions.lk/" className="footerlink">
            Dockyard Total Solutions
          </a>
        </div>
      </footer>
    </Box>
  );
}
