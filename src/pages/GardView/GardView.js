import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, CircularProgress, AppBar, Toolbar, IconButton, MenuItem, Menu } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import logo from '../../assets/images/dockyard.png';
import backgroundImage from '../../assets/images/light-blue-background.jpg';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';


const GardViewApp = () => {
  const [userData, setUserData] = useState(null);
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGate, setSelectedGate] = useState('1');
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const columns = [
    {
      field: 'Image',
      headerName: 'Image',
      width: 150,
      renderCell: (params) => (
        <Avatar
          src={`https://esystems.cdl.lk/backend/GateSolution/UhfRfid/GetUserImg?SNo=${params.row.SeNo}`}
          alt={`Image for ${params.row.SeNo}`}
          sx={{
            width: 60,
            height: 70,
            borderRadius: '5%',
            border: '2px solid #d9cf0d',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        />
      ),
    },
    { field: 'SeNo', headerName: 'Service No', width: 150 },
    { field: 'Name', headerName: 'Owner Name', width: 200 },
    {
      field: 'VehicalNo',
      headerName: 'Vehicle No',
      width: 150,
      renderCell: (params) => (
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold', // Bold the text
              //color: clockNo === '1' || clockNo === '3' ? 'green' : clockNo === '2' || clockNo === '4' ? 'red' : 'black',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    { field: 'BarcodeTime', headerName: 'Time', width: 150 },   
    {
      field: 'ClockNo',
      headerName: 'Device',
      width: 150,
      renderCell: (params) => {
        const clockNo = params.row.ClockNo;
        return (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold', // Bold the text
              color: clockNo === '1' || clockNo === '3' ? 'green' : clockNo === '2' || clockNo === '4' ? 'red' : 'black',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {clockNo}
          </Typography>
        );
      },
    },
    {
      field: 'BarcodeIOStatus',
      headerName: 'IN/OUT Status',
      width: 150,
      renderCell: (params) => {
        const BarcodeIOStatus = params.row.BarcodeIOStatus;
        return (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold', // Bold the text
              color: BarcodeIOStatus === 'I' ? 'green' : BarcodeIOStatus === 'O' ? 'red' : 'black',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {BarcodeIOStatus === 'I' ? 'IN' : BarcodeIOStatus === 'O' ? 'OUT' : 'Unknown'}
          </Typography>
        );
      },
    },
  ];

  const fetchData = async (gateNo) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://esystems.cdl.lk/backend/GateSolution/UhfRfid/GetNewRecords?GateNo=${gateNo}`);
      const latestRecord = response.data.ResultSet[0];
      setUserData(latestRecord);
      setVehicleData(response.data.ResultSet);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const gateNo = selectedGate === '3' ? "'3','4'" : "'1','2'";
    fetchData(gateNo);
  }, [selectedGate]);

  


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    handleMenuClose();
    navigate('../LiveAttendanceLogin', { replace: true });
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2}
        minHeight="100%"
        // sx={{
        //   backgroundImage: `url(${backgroundImage})`,
        //   backgroundSize: 'cover',
        //   backgroundPosition: 'center',
        //   backgroundRepeat: 'no-repeat',
        // }}
      >

      <AppBar position="fixed" sx={{ backgroundColor: '#1B3F95' }}>
          <Toolbar>
          <Box component="img"
                  src={logo}
                  alt="Logo"
                  sx={{ height: 40, marginRight: 2, background:'white',borderRadius:'10px'}}
              />
          <Typography variant="h6" sx={{ flexGrow: 0.4 }}>
                 Colombo Dockyard PLC 
          </Typography>

          {/* Replace buttons with labels */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 4 }}>
            <Typography
              variant="h6"
              onClick={() => setSelectedGate('1')}
              sx={{
                cursor: 'pointer',
                fontWeight: selectedGate === '1' ? 'bold' : 'normal',
                color: selectedGate === '1' ? 'white' : '#ccc',
                '&:hover': {
                  color: '#e8dd15',
                },
              }}
            >
              Gate 1
            </Typography>
            <Typography
              variant="h6"
              onClick={() => setSelectedGate('3')}
              sx={{
                cursor: 'pointer',
                fontWeight: selectedGate === '3' ? 'bold' : 'normal',
                color: selectedGate === '3' ? 'white' : '#ccc',
                '&:hover': {
                  color: '#e8dd15',
                },
              }}
            >
              Gate 3
            </Typography>
          </Box>

          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ marginLeft: 'auto' }}
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
  width={{ xs: '100%', sm: '75%', md: '29%' }} 
  backgroundColor="background.paper"
  mr={{ xs: 0, md: 2 }}
  mb={{ xs: 2, md: 0 }}
  height={{ xs: 'auto', sm: 'auto', md: 'auto' }}  // Ensure the container height is dynamic
>
  {loading ? (
    <CircularProgress />
  ) : (
    userData && (
      <Box display="flex" flexDirection="column" alignItems="center" width="100%">
        {/* Avatar component */}
        <Avatar
          src={`https://esystems.cdl.lk/backend/GateSolution/UhfRfid/GetUserImg?SNo=${userData.SeNo}`}
          alt={userData.Name}
          sx={{
            width: { xs: '80%', sm: '70%', md: '60%' },  // Relative width to container
            height: 'auto', 
            objectFit: 'cover', 
            maxWidth: '100%',  
            borderRadius: 0,
            border: '4px solid #d9cf0d',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
            mb: 2,
          }}
        />
        {/* User Information */}
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: 'black', mb: 1, fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' } }} 
        >
          {userData.SeNo} - {userData.Name}
        </Typography>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: 'red', mb: 1, fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' } }} 
        >
          {userData.VehicalNo}
        </Typography>
        <Typography
          variant="h5"
          fontWeight="bold"
          align="center"
          sx={{ color: 'black', mb: 1, fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' } }} 
        >
          {userData.BarcodeTime}
        </Typography>
      </Box>
    )
  )}
</Box>



          {/* Data Grid Box */}
          <Box
  width={{ xs: '100%', md: '65%' }} // Responsive width
  height={{ xs: 'auto', md: '67%' }} // Responsive height
  flexGrow={1}
  sx={{ overflow: 'hidden' }}
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
        '& .MuiDataGrid-row': {
          backgroundColor: 'white',
          '&:nth-of-type(odd)': {
            backgroundColor: '#f5f5f5',
          },
          '&:hover': {
            backgroundColor: '#e0f7fa',
          },
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#fafafa',
          fontWeight: 'bold',
        },
      }}
    />
  )}
</Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: '#1B3F95',
            padding: '1rem',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <span>&#169;Copyright </span>
          DTS.  All Rights Reserved
          Designed by &nbsp;
          <a href="https://www.dockyardsolutions.lk/" className="footerlink">
            Dockyard Total Solutions
          </a>
        </Box>
      </Box>
    </>
  );
};

export default GardViewApp;
