import { Box } from "@mui/material";
import Header from "../../components/Header";
// import LineChart from "../../components/LineChart";
import GasLine from "../../components/GasLine";

const GasLineChart = () => {
  return (
    <Box m="20px">
      <Header title="Gas Meter Line Chart" subtitle="Simple Line Chart showing Gas Meters data " />
      <Box height="75vh">
        <GasLine />
      </Box>
    </Box>
  );
};

export default GasLineChart;
