import { Box,Tooltip, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { CheckCircleRounded } from "@mui/icons-material";
import CancelIcon from '@mui/icons-material/Cancel';
import {useEffect ,useState}  from 'react'

const fetchDataFromThingSpeak = async (channelID, field) => {
  try {
    const response = await fetch(
      `https://api.thingspeak.com/channels/${channelID}/feeds.json?results=50`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.feeds;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const formatTimestamp = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return `${interval} years ago`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months ago`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days ago`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours ago`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes ago`;
  }
  return 'just now';
};
const formatTimestampstatus = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);
    return seconds
  }


const getStatus = (timestampforstatus) => {
  const SEVEN_DAYS_IN_SECONDS =  24 * 60 * 60;
  const isOnline = timestampforstatus !== null && timestampforstatus < SEVEN_DAYS_IN_SECONDS;
  return isOnline ? 'Online' : 'Offline';
};


const Devices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [gasData, setGasData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [energyData, setEnergyData] = useState([]);
  useEffect(() => {
    const gasChannelID = 1701501;
    const waterChannelID = 1674175;
    const energyChannelID =1701504;

    const gasField = 'field2';
    const waterField = 'field2';
    const energyField = 'field1';

    Promise.all([
      fetchDataFromThingSpeak(gasChannelID, gasField),
      fetchDataFromThingSpeak(waterChannelID, waterField),
      fetchDataFromThingSpeak(energyChannelID, energyField),
    ])
      .then(([gasData, waterData, energyData]) => {
        setGasData(gasData);
        setWaterData(waterData);
        setEnergyData(energyData);
      })
      .catch((error) => console.error(error));
  }, []);

  const findLatestEntryAndTimeSinceLastCommunication = (data,field, deviceName, type ,macAddress) => {
    if (data.length === 0) {
      return [];
    }
    const latestEntry2 = data[data.length - 1];
    const id=latestEntry2.entry_id
    const latestEntry=latestEntry2[field]
    
    
    const timeSinceLastCommunicationFromNow = data.reduce((latestTimestamp, entry) => {
      return entry.created_at > latestTimestamp ? entry.created_at : latestTimestamp;
    }, '');
    const timeSinceLastCommunication=formatTimestamp(timeSinceLastCommunicationFromNow);
    const timestampforstatus=formatTimestampstatus(timeSinceLastCommunicationFromNow)
    const Status = getStatus(timestampforstatus);

    return { id,latestEntry, timeSinceLastCommunication ,DeviceName: deviceName, Type: type ,MacAddress:macAddress,Status};
  };
 
const {id:latestGasEntryID, latestEntry: latestGasEntry, timeSinceLastCommunication: timeSinceLastGasCommunication ,MacAddress: MacGasAddress,DeviceName :DeviceGasName ,Type:gasType, Status:gasStatus } = findLatestEntryAndTimeSinceLastCommunication(gasData, 'field2' ,'Gas Meter', 'Digital Smart Gas Meter','94:b9:7e:fa:2d:9c');
const { id:latestWaterEntryID,latestEntry: latestWaterEntry, timeSinceLastCommunication: timeSinceLastWaterCommunication ,MacAddress: MacWaterAddress,DeviceName :DeviceWaterName ,Type:waterType, Status:waterStatus} = findLatestEntryAndTimeSinceLastCommunication(waterData, 'field2', 'Water Meter', 'Digital Smart Water Meter','94:b9:7e:fa:2d:9c');
const { id:latestEnergyEntryID,latestEntry: latestEnergyEntry, timeSinceLastCommunication: timeSinceLastEnergyCommunication, MacAddress: MacEnergyAddress,DeviceName :DeviceEnergyName,Type:energyType, Status:energyStatus} = findLatestEntryAndTimeSinceLastCommunication(energyData, 'field1', 'Energy Meter', 'Digital Smart Energy Meter','94:b9:7e:fa:2d:9c');
 console.log(latestGasEntryID,latestGasEntry,timeSinceLastGasCommunication,MacGasAddress,DeviceGasName,gasType,gasStatus)
 console.log(latestWaterEntryID,latestWaterEntry,timeSinceLastWaterCommunication,MacWaterAddress,DeviceWaterName,waterType,waterStatus)
 console.log(latestEnergyEntryID,latestEnergyEntry,timeSinceLastEnergyCommunication,MacEnergyAddress,DeviceEnergyName,energyType,energyStatus)
 
const deviceInfo = [
  {
    id: '1',
    DeviceName: DeviceGasName,
    MacAddress: MacGasAddress,
    Type: gasType,
    Status: gasStatus,
    LastMeasurement: latestGasEntry,
    LastCommunication: timeSinceLastGasCommunication,
  },
  {
    id: '2',
    DeviceName: DeviceWaterName,
    MacAddress: MacWaterAddress,
    Type: waterType,
    Status: waterStatus,
    LastMeasurement: latestWaterEntry,
    LastCommunication: timeSinceLastWaterCommunication,
  },
  {
    id: '3',
    DeviceName: DeviceEnergyName,
    MacAddress: MacEnergyAddress,
    Type: energyType,
    Status: energyStatus,
    LastMeasurement: latestEnergyEntry,
    LastCommunication: timeSinceLastEnergyCommunication,
  },
]
  const columns=[
    {
        field: "DeviceName",
        headerName: "Device Name",
        flex: 1,
        
      },
    {
        field: "MacAddress",
        headerName: "Mac Address",
        flex: 1,
    },
    {
      field:"Type",
      headerName:"Type",
      flex:1,
    },
    {
      field:"Status",
      headerName:"Status",
      flex:1,
      renderCell: (params) => {
        // const Status = params.row.Status || 'online';

        const isOnline = params.value === 'Online';
        return (
          <Tooltip title={isOnline ? 'Online' : 'Offline'} arrow placement="top">
            {isOnline ? <CheckCircleRounded color="success"/> : <CancelIcon color="error" />}
          </Tooltip>
        ); 
      },
    },
    {
      field:"LastMeasurement",
      headerName:"LastMeasurement",
      flex:1,
    },
    {
      field:'LastCommunication',
      headerName:"LastCommunication",
      flex:1,
    }
  ]
  return (
    <Box m="20px">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Header
          title="NETWORK DEVICE (SMART DEVICES)"
          subtitle="List of Installed Smart Home Meter"
        />
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
        }}
      >
        <DataGrid rows={deviceInfo} columns={columns} autoHeight  />
      </Box>
    </Box>
  );
};

export default Devices;
