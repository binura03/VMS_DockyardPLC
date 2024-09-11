import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Menu,
  Tabs,
  Tab,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import logo from "../../assets/images/dockyardlogo.png";
import backgroundImage from "../../assets/images/light-blue-background.jpg";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";

const GardViewApp = () => {
  const [userData, setUserData] = useState(null);
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGate, setSelectedGate] = useState(1);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [prevVehicleData, setPrevVehicleData] = useState([]);

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
          const latestRecord = data.ResultSet[0];
          setUserData(latestRecord);
          setVehicleData(data.ResultSet);
          const newRecords = sortedData.filter(
            (record) =>
              !prevVehicleData.some(
                (prevRecord) => prevRecord.BarcodeNo === record.BarcodeNo
              )
          );
          setVehicleData(sortedData.slice(0, 10)); // Take only the first 12 records
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

  const columns = [
    {
      field: "Image",
      headerName: "",
      width: 150,
      renderCell: (params) => (
        <Avatar
          src={`https://esystems.cdl.lk/backend/GateSolution/UhfRfid/GetUserImg?SNo=${params.row.SeNo}`}
          alt={`Image for ${params.row.SeNo}`}
          sx={{
            width: 65,
            height: 69,
            borderRadius: "5%",
            border: "2px solid #d9cf0d",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        />
      ),
    },
    { field: "SeNo", headerName: "Service No", width: 150 },
    { field: "Name", headerName: "Owner Name", width: 200 },
    {
      field: "VehicalNo",
      headerName: "Vehicle No",
      width: 150,
      renderCell: (params) => (
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold", // Bold the text
            //color: clockNo === '1' || clockNo === '3' ? 'green' : clockNo === '2' || clockNo === '4' ? 'red' : 'black',
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    { field: "BarcodeTime", headerName: "Time", width: 150 },
    {
      field: "ClockNo",
      headerName: "Device",
      width: 150,
      renderCell: (params) => {
        const clockNo = params.row.ClockNo;
        return (
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold", // Bold the text
              color:
                clockNo === "1" || clockNo === "3"
                  ? "green"
                  : clockNo === "2" || clockNo === "4"
                  ? "red"
                  : "black",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            {clockNo}
          </Typography>
        );
      },
    },
    {
      field: "BarcodeIOStatus",
      headerName: "IN/OUT Status",
      width: 150,
      renderCell: (params) => {
        const BarcodeIOStatus = params.row.BarcodeIOStatus;
        return (
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold", // Bold the text
              color:
                BarcodeIOStatus === "I"
                  ? "green"
                  : BarcodeIOStatus === "O"
                  ? "red"
                  : "black",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            {BarcodeIOStatus === "I"
              ? "IN"
              : BarcodeIOStatus === "O"
              ? "OUT"
              : "Unknown"}
          </Typography>
        );
      },
    },
  ];

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2}
        minHeight="100%"
      >
        <AppBar position="fixed" sx={{ backgroundColor: "#1B3F95" }}>
          <Toolbar>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                height: 52,
                marginRight: 2,
                background: "#1B3F95",
                borderRadius: "10px",
                
              }}
            />
            <Typography variant="h6" sx={{ flexGrow: 0.1 }}>
              
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          width="100%"
          p={6}
          mt={2}
        >
          {/* User Information Box */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={{ xs: 1, md: 2 }}
            borderRadius={2}
            boxShadow={5}
            width={{ xs: "100%", sm: "75%", md: "29%" }}
            backgroundColor="background.paper"
            mr={{ xs: 0, md: 2 }}
            mb={{ xs: 2, md: 0 }}
            height={{ xs: "auto", sm: "auto", md: "auto" }} // Ensure the container height is dynamic
          >
            {loading ? (
              <CircularProgress />
            ) : (
              userData && (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  width="100%"
                >
                  {/* Avatar component */}
                  <Avatar
                    src={`https://esystems.cdl.lk/backend/GateSolution/UhfRfid/GetUserImg?SNo=${userData.SeNo}`}
                    alt={userData.Name}
                    sx={{
                      width: { xs: "90%", sm: "80%", md: "70%" }, // Increased relative width for each breakpoint
                      height: "auto",
                      objectFit: "cover",
                      maxWidth: "100%",
                      borderRadius: 0,
                      border: "4px solid #d9cf0d",
                      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                      mb: 2,
                    }}
                  />
                  {/* User Information */}
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                      color: "black",
                      mb: 1,
                      fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                    }}
                  >
                    {userData.SeNo} - {userData.Name}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                      color: "red",
                      mb: 1,
                      fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                    }}
                  >
                    {userData.VehicalNo}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    align="center"
                    sx={{
                      color: "black",
                      mb: 1,
                      fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                    }}
                  >
                    {userData.BarcodeTime}
                  </Typography>
                </Box>
              )
            )}
          </Box>

          {/* Data Grid Box */}
          <Box
            width={{ xs: "100%", md: "65%" }} // Responsive width
            height={{ xs: "auto", md: "67%" }} // Responsive height
            flexGrow={1}
            sx={{ overflow: "hidden" }}
            bgcolor="background.paper"
            p={2}
            boxShadow={3}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <DataGrid
                rows={vehicleData}
                columns={columns}
                rowHeight={70}
                autoHeight={false}
                getRowId={(row) => row.BarcodeScript}
                disableSelectionOnClick
                hideFooter
                sx={{
                  "& .MuiDataGrid-row": {
                    backgroundColor: "white",
                    "&:nth-of-type(odd)": {
                      backgroundColor: "#f5f5f5",
                    },
                    "&:hover": {
                      backgroundColor: "#e0f7fa",
                    },
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#fafafa",
                    fontWeight: "bold",
                  },
                }}
              />
            )}
          </Box>
        </Box>
        {/* Footer */}
      </Box>
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#1B3F95",
          padding: "1rem",
          color: "white",
          textAlign: "center",
          boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <span>&#169;Copyright </span>
        DTS. All Rights Reserved Designed by &nbsp;
        <a href="https://www.dockyardsolutions.lk/" className="footerlink">
          Dockyard Total Solutions
        </a>
      </Box>
    </>
  );
};

export default GardViewApp;
