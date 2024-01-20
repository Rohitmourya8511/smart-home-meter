import { Box } from "@mui/material";
import Header from "../../components/Header";

import Electricity from "../../components/Electricity";

const ElectricityLine = () => {
  return (
    <Box m="20px">
      <Header title="Energy Chart" subtitle="Simple Line Chart showing Energy Meter data " />
      <Box height="65vh">
        <Electricity />
      </Box>
    </Box>
  );
};

export default ElectricityLine;
