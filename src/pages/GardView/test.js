import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, CircularProgress, IconButton, Menu, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import './GardView.css'; // Assuming CSS is in GardView.css
import Dockyardgif from '../../assets/images/Dockyardgif.gif'; // Import your GIF here

export default function GardView() {
  const [userData, setUserData] = useState(null);
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevVehicleData, setPrevVehicleData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu
  const open = Boolean(anchorEl); // Menu open state

  const fetchData = () => {
    axios.get('https://esystems.cdl.lk/backend/GateSolution/UhfRfid/GetNewRecordsUNandSN?')
      .then(response => {
        const data = response.data;
        if (data && data.ResultSet) {
          const sortedData = data.ResultSet.sort((a, b) => {
            // const timeA = new Date(`${a.BarcodeDate} ${a.BarcodeTime}`).getTime();
            // const timeB = new Date(`${b.BarcodeDate} ${b.BarcodeTime}`).getTime();
            // return timeB - timeA; // Sort in descending order
          });

          const firstRecord = sortedData[0];
          setUserData({
            id: firstRecord.SeNo || null,
            name: firstRecord.Name || null,
            plate: firstRecord.VehicalNo,
            date: firstRecord.BarcodeDate,
            time: firstRecord.BarcodeTime,
          });

          const newRecords = sortedData.filter(record =>
            !prevVehicleData.some(prevRecord => prevRecord.BarcodeNo === record.BarcodeNo)
          );

          setVehicleData(sortedData);
          setPrevVehicleData(sortedData);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 1000); // Refresh data every 1 second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const columns = [
    {
      field: 'avatar',
      headerName: '',
      width: 100,
      renderCell: (params) => (
        <Avatar
          sx={{
            width: 60,
            height: 60,
            borderRadius: 0, // Remove rounded corners to make it square
          }}
          alt={params.row.Name}
          src={`https://esystems.cdl.lk/backend/GateSolution/UhfRfid/GetUserImg?SNo=${params.row.SeNo}`}
        />
      ),
      sortable: false,
      filterable: false,
    },
    { field: 'SeNo', headerName: 'Service No', width: 150 },
    { field: 'Name', headerName: 'Name', width: 200 },
    { field: 'VehicalNo', headerName: 'Vehicle No', width: 150 },
    { field: 'BarcodeDate', headerName: 'Date', width: 150 },
    { field: 'BarcodeTime', headerName: 'Time', width: 150 },
    {
      field: 'GateNumber',
      headerName: 'Gate Number',
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: params.row.ClockNo === "1" || params.row.ClockNo === "3" ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {params.row.ClockNo}
        </Box>
      ),
    },
    {
      field: 'InOutStatus',
      headerName: 'In/Out Status',
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: params.row.ClockNo === "1" || params.row.ClockNo === "3" ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {params.row.ClockNo === "1" || params.row.ClockNo === "3" ? 'IN' : 'OUT'}
        </Box>
      ),
    },
  ];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Menu Icon Button with Dropdown */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={2}
        position="fixed"
        top={0}
        left={0}
        width="100%"
        bgcolor="background.paper"
        boxShadow={2}
        zIndex={10}
      >
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" ml={2}>GardView</Typography>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Option 1</MenuItem>
          <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
          <MenuItem onClick={handleMenuClose}>Option 3</MenuItem>
        </Menu>
      </Box>

      {/* GIF at the top */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={2}
        pt={10} // Add padding-top to account for the fixed menu bar
      >
        <img
          src={Dockyardgif}
          alt="Dockyard gif"
          style={{
            width: '100%',
            maxWidth: '800px', // Max width for responsiveness
            height: 'auto',
            marginBottom: '-25%',
            marginTop: '-20%',
          }}
        />
      </Box>

      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }} // Stack in column on small screens
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)" // Adjust height to account for header and footer
        p={2}
        pt={10} // Add padding-top to account for the fixed menu bar
        sx={{
          overflow: 'hidden', // Prevent scrollbars
        }}
      >
        {/* User Information Column */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={2}
          borderRadius={2}
          boxShadow={5}
          width={{ xs: '100%', md: '27%' }} // Full width on small screens
          height={{ xs: 'auto', md: '67%' }} // Adjust height
          backgroundColor="background.paper"
          mr={{ xs: 0, md: 2 }} // No margin on small screens
          mb={{ xs: 2, md: 0 }} // Margin bottom on small screens
        >
          {userData && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100%"
              sx={{ overflow: 'hidden' }}
            >
              <Avatar
                src={`https://esystems.cdl.lk/backend/GateSolution/UhfRfid/GetUserImg?SNo=${userData.id}`}
                alt={userData.name}
                sx={{
                  width: { xs: 200, md: 400 }, // Responsive size for avatar
                  height: { xs: 230, md: 460 }, // Adjust height accordingly
                  borderRadius: 0,
                  border: '4px solid #d1d124',
                  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
                  mb: 2,
                }}
              />
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'black', mb: -1 }}>
                {userData.id} - {userData.name}
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'red', mb: -1 }}>
                {userData.plate}
              </Typography>
              <Typography variant="h6" fontWeight="bold" align="center" sx={{ color: 'black', mb: -1 }}>
                {userData.time}
              </Typography>
              {/* <Typography variant="body2" fontWeight="bold" align="center" sx={{ color: 'black' }}>
                {userData.date}
              </Typography> */}
            </Box>
          )}
        </Box>

        {/* Data Grid Column */}
        <Box
          width={{ xs: '100%', md: '65%' }} // Full width on small screens
          height={{ xs: 'auto', md: '67%' }} // Auto height on small screens
          flexGrow={1}
          sx={{ overflow: 'hidden' }}
          bgcolor="background.paper"
        >
          <DataGrid
            rows={vehicleData}
            columns={columns}
            autoHeight={false}
            getRowId={(row) => row.BarcodeNo}
            disableSelectionOnClick
            hideFooter
            sx={{
              '& .MuiDataGrid-row': {
                backgroundColor: 'white',
                '&:nth-of-type(odd)': {
                  backgroundColor: '#f5f5f5',
                },
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
}
