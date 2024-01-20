import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Tooltip,
  useMediaQuery
} from "@mui/material";
import {useEffect ,useState}  from 'react'
import { tokens } from "../../theme";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import Electricity from "../../components/Electricity";
import GasLine from "../../components/GasLine";

import waterIcon from "../../assets/ic_water.svg";
import gasIcon from "../../assets/ic_gas.svg";
import electricityIcon from "../../assets/ic_electricity.svg";
import StatusCard from "../../components/StatusCard";
import { ElectricMeter, GasMeterOutlined, OpacityOutlined } from "@mui/icons-material";

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


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
 
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


// Function to calculate total consumption
const calculateTotalConsumption = (data, field) => {
  return data.reduce((total, entry) =>  parseFloat(entry[field]), 0);
};





// Function to find the latest entry and time since the last communication
const findLatestEntryAndTimeSinceLastCommunication = (data) => {
  if (data.length === 0) {
    return { latestEntry: 0, timeSinceLastCommunication: null };
  }
  const latestEntry2 = data[data.length - 1];
  const latestEntry=latestEntry2.entry_id

  const timeSinceLastCommunicationFromNow = data.reduce((latestTimestamp, entry) => {
    return entry.created_at > latestTimestamp ? entry.created_at : latestTimestamp;
  }, '');
  const timeSinceLastCommunication=formatTimestamp(timeSinceLastCommunicationFromNow);
  return { latestEntry, timeSinceLastCommunication };
};

const { latestEntry: latestGasEntry, timeSinceLastCommunication: timeSinceLastGasCommunication } = findLatestEntryAndTimeSinceLastCommunication(gasData);
const { latestEntry: latestWaterEntry, timeSinceLastCommunication: timeSinceLastWaterCommunication } = findLatestEntryAndTimeSinceLastCommunication(waterData);
const { latestEntry: latestEnergyEntry, timeSinceLastCommunication: timeSinceLastEnergyCommunication } = findLatestEntryAndTimeSinceLastCommunication(energyData);
console.log(latestGasEntry,timeSinceLastGasCommunication)

  const totalGasConsumption = calculateTotalConsumption(gasData, 'field2');
  const totalWaterConsumption = calculateTotalConsumption(waterData, 'field2');
  const totalElectricConsumption = calculateTotalConsumption(energyData, 'field1');

  const interleaveData = (gasData, waterData, energyData) => {
  const combinedData = [];
  const maxLength = Math.max(gasData.length, waterData.length, energyData.length);

  for (let i = 0; i < maxLength; i++) {
    combinedData.push({
      gas: i < gasData.length ? gasData[i].field2 : '',
      water: i < waterData.length ? waterData[i].field2 : '',
      energy: i < energyData.length ? energyData[i].field1 : '',
    });
  }

  return combinedData;
};

const combinedData = interleaveData(gasData, waterData, energyData).reverse();
 const convertToCSV = (data) => {
    const headers = Object.keys(data[0]);
    const csvContent =
      headers.join(",") +
      "\n" +
      data.map((row) => headers.map((header) => row[header]).join(",")).join("\n");
    return csvContent;
  };
 const downloadCSV = (data, filename) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const handleDownload = () => {
    downloadCSV(waterData, "waterData.csv");
    downloadCSV(gasData, "gasData.csv");
    downloadCSV(energyData, "energyData.csv");
  };
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="DASHBOARD"
          subtitle="Overview of measured data weekly of smart meter"
        />

        <Box>
          <Button
          	onClick={handleDownload}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={isNonMobile ? "repeat(12, 1fr)" : "1fr"}
        gridAutoRows={isNonMobile ? "140px" : "auto"}
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        {/* ROW 1 */}
             <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatusCard
            icon={
              <IconButton><Tooltip title="WATER METER" arrow  placement="top">
              <OpacityOutlined />
            </Tooltip>  
          </IconButton>
            }
            total={`${totalWaterConsumption} L`}
            image={
              <img
                src={waterIcon}
                alt="WaterMeter"
                width={70}
                height={80}
                sx={{ color: colors.blueAccent[600], fontSize: "8px" }}
              />
            }
            title="WATER METER"
            lastseen={`${timeSinceLastWaterCommunication}`}
            lastentry={JSON.stringify(latestWaterEntry)}
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatusCard
            icon={
            <IconButton > <Tooltip title="ELECTRICITY METER" arrow placement="top">
            <ElectricMeter/>
            </Tooltip>  
          </IconButton>
            }
            total={`${totalElectricConsumption} Unit`}
            image={
              <img
                src={electricityIcon}
                alt="EnergyMeter"
                width={70}
                height={80}
                sx={{ color: colors.blueAccent[600], fontSize: "8px" }}
              />
            }
            title="ELECTRICITY METER"
            lastseen={`${timeSinceLastEnergyCommunication}`}
            lastentry={JSON.stringify(latestEnergyEntry)}
          />
        </Box>

       
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatusCard
            icon={
              <IconButton> <Tooltip title="GAS METER" arrow placement="top">
              <GasMeterOutlined />
            </Tooltip>  
          </IconButton>
            }
            total={`${totalGasConsumption} L`}
            image={
              <img
                src={gasIcon}
                alt="Gasmeter"
                width={70}
                height={80}
                sx={{ color: colors.blueAccent[600], fontSize: "8px" }}
              />
            }
            title="GAS METER"
            lastseen={`${timeSinceLastGasCommunication}`}
            lastentry={JSON.stringify(latestGasEntry)}
            
          />
        </Box>
        {isNonMobile?
        <Box
        gridColumn="span 4"
        gridRow="span 4"
        backgroundColor={colors.primary[400]}
        overflow={isNonMobile ? "scroll" : "visible"} 
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          colors={colors.grey[100]}
          p="15px"
        >
          <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
            Recent Data
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          colors={colors.grey[100]}
          p="15px"
        >
          <Box color={colors.grey[100]}>GAS</Box>
          <Box color={colors.grey[100]}>WATER</Box>
          <Box color={colors.grey[100]}>ENERGY</Box>
        </Box>
        {combinedData.map((data, i) => (
  <Box
  key={`${data.gas}-${data.water}-${data.energy}-${i}`}
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    borderBottom={`4px solid ${colors.primary[500]}`}
    p="15px"
  >
    <Box>
      <Typography
        color={colors.greenAccent[500]}
        variant="h5"
        fontWeight="600"
      >
        {data.gas}
      </Typography>
    </Box>
    <Box>
      <Typography
        color={colors.greenAccent[500]}
        variant="h5"
        fontWeight="600"
      >
        {data.water}
      </Typography>
    </Box>
    <Box>
      <Typography
        color={colors.greenAccent[500]}
        variant="h5"
        fontWeight="600"
      >
        {data.energy}
      </Typography>
    </Box>
  </Box>
))}
      </Box>
        :''}

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                WATER METERS DATA
              </Typography>
              <Typography
                variant="h3"
                fontWeight="600"
                color={colors.grey[100]}
              >
                {`${totalWaterConsumption} Unit`}
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        

        {/* ROW 3 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
    

          {" "}
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                ENERGY METER DATA
              </Typography>
              <Typography
                variant="h3"
                fontWeight="600"
                color={colors.grey[100]}
              >
                {`${totalElectricConsumption} Unit`}
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>  
          </Box>
          <Box height="230px" m="-20px 0 0 0">
            <Electricity isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn={isNonMobile?'span 12':'span 8'}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
    

          {" "}
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                GAS METER DATA
              </Typography>
              <Typography
                variant="h3"
                fontWeight="600"
                color={colors.grey[100]}
              >
               {`${totalGasConsumption} L`}
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>  
          </Box>
          <Box height="230px" m="-20px 0 0 0">
            <GasLine isDashboard={true} />
          </Box>
        </Box>
        {isNonMobile?'':
        <Box
        gridColumn="span 4"
        gridRow="span 4"
        backgroundColor={colors.primary[400]}
        overflow={ "scroll" } 
        maxHeight={ "400px" } 
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          colors={colors.grey[100]}
          p="15px"
        >
          <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
            Recent Data
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          colors={colors.grey[100]}
          p="15px"
        >
          <Box color={colors.grey[100]}>GAS</Box>
          <Box color={colors.grey[100]}>WATER</Box>
          <Box color={colors.grey[100]}>ENERGY</Box>
        </Box>
        {combinedData.map((data, i) => (
  <Box
  key={`${data.gas}-${data.water}-${data.energy}-${i}`}
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    borderBottom={`4px solid ${colors.primary[500]}`}
    p="15px"
  >
    <Box>
      <Typography
        color={colors.greenAccent[500]}
        variant="h5"
        fontWeight="600"
      >
        {data.gas}
      </Typography>
    </Box>
    <Box>
      <Typography
        color={colors.greenAccent[500]}
        variant="h5"
        fontWeight="600"
      >
        {data.water}
      </Typography>
    </Box>
    <Box>
      <Typography
        color={colors.greenAccent[500]}
        variant="h5"
        fontWeight="600"
      >
        {data.energy}
      </Typography>
    </Box>
  </Box>
))}
      </Box>
        }
        
      </Box>
      
    </Box>
  );
};

export default Dashboard;


