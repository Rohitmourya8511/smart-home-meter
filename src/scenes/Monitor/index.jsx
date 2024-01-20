import { useState ,useEffect} from "react";
import { Box,IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme,Tooltip } from "@mui/material";

import { Delete, GasMeterOutlined } from "@mui/icons-material";
import { ElectricMeter } from "@mui/icons-material";
import { OpacityOutlined } from "@mui/icons-material";
import axios from "axios";

const Monitor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
 
  const [selectedGrid, setSelectedGrid] = useState(1);
  const [monitorData, setMonitorData] = useState([]);
  const handleGridClick = (gridNumber) => {
    setSelectedGrid(gridNumber);
  };

  const fetchMonitorData = async (channelId,fieldId) => {
    try {
      const response = await axios.get(
        `https://api.thingspeak.com/channels/${channelId}/feeds.json`
      );
      const data = response.data.feeds.map((feed) => ({
        id: feed.entry_id,
        lastMeasurement: parseFloat(feed[fieldId]),
        lastCommunication: feed.created_at,
      }));
      setMonitorData(data.reverse());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {   
    const waterChannelID = 1674175;
    const waterfieldId = 'field2';
    // Fetch initial data when the component mounts
    fetchMonitorData(waterChannelID,waterfieldId);
   
  }, []); // Add gasChannelID and energyChannelID as needed

  const fetchGasData = async () => {
    const gasChannelID = 1701501;
    const gasfieldId = 'field2';
    fetchMonitorData(gasChannelID,gasfieldId);
  };

  const fetchElectricityData = async () => {
    const energyChannelID =1701504;
    const energyfieldId = 'field1';
    fetchMonitorData(energyChannelID,energyfieldId);
  };
  useEffect(() => {
    // Fetch gas data when selectedGrid is 2
    if (selectedGrid === 2) {
      fetchGasData();
    }
  }, [selectedGrid,fetchGasData]);

  useEffect(() => {
    // Fetch electricity data when selectedGrid is 3
    if (selectedGrid === 3) {
      fetchElectricityData();
    }
  }, [selectedGrid,fetchElectricityData]);
  const columns = [
    { field: "lastMeasurement", 
    headerName: "Last Measurement" ,
    flex: 1,
    headerAlign: "center", 
    align: "center",
    },
    { field: "lastCommunication", headerName: "Last Communication",flex: 1,headerAlign: "center",align: "center",
    renderCell: (params) => (
      <Tooltip title={params.value} placement="top">
        <span>{params.value}</span>
      </Tooltip>)
    },
    { field: "DELETE", headerName: "Delete",flex: 1,headerAlign: "center",align: "center",
    renderCell: () => (
      <Tooltip title="Delete" arrow placement="top">
        <Delete />
      </Tooltip>)
    },
  ];

  return (
    <Box  m="20px">
      <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
  >
    <Header 
      title="MONITORING DATA"
      subtitle="List of different measurement of meters"
    /><Box>
    <IconButton onClick={() => handleGridClick(1)}> <Tooltip title="WATER METER" arrow  placement="top">
        <OpacityOutlined />
      </Tooltip>  
    </IconButton>
     <IconButton onClick={() => handleGridClick(2)}> <Tooltip title="GAS METER" arrow placement="top">
        <GasMeterOutlined />
      </Tooltip>  
    </IconButton>
    <IconButton onClick={() => handleGridClick(3)}> <Tooltip title="ELECTRICITY METER" arrow placement="top">
      <ElectricMeter/>
      </Tooltip>  
    </IconButton>
    </Box>
  </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
       
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {selectedGrid === 1 && <DataGrid
          rows={monitorData}
          columns={columns}
         
          components={{ Toolbar: GridToolbar  }}
          pageSize={10}
          pageSizeOptions={[10,25,100]}
        /> }
      {selectedGrid === 2 && <DataGrid
          rows={monitorData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pageSize={10}
          pageSizeOptions={[10,25,100]}
        /> }
      {selectedGrid === 3 && <DataGrid
          rows={monitorData}
          columns={columns}
          components={{ Toolbar: GridToolbar}}
          pageSize={10}
          pageSizeOptions={[10,25,100]}
        />}
      </Box>
    </Box>
  );
};
export default Monitor;
