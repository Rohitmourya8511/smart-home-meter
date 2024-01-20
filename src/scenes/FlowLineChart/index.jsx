import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";


const Line = () => {
  return (
    <Box m="20px">
      <Header title="Water Meter Line Chart" subtitle="Simple Line Chart showing Water Meters data " />
      <Box height="75vh">
        <LineChart />
      </Box>
    </Box>
  );
};

export default Line;
