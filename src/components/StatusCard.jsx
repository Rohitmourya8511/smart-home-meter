import { Box, Typography, useTheme, Tooltip } from "@mui/material";
import { tokens } from "../theme";


const StatusCard = ({ title, image, icon , lastentry, lastseen, total }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Tooltip title="Last Seen" arrow placement="top" >
          <span style={{cursor: 'pointer' }}>{lastseen}</span>
        </Tooltip>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
             <Tooltip title="Total Consumption" arrow placement="right-start" >
          <span style={{cursor: 'pointer' }}>{total}</span>
        </Tooltip>
          </Typography>
        </Box>
        <Box>
          
          {image}
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {title} {icon}
        </Typography>
        <Typography
          variant="h5"

          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >    <Tooltip title="Last Entry" arrow placement="top" >
        <span style={{cursor: 'pointer' }}>{lastentry}</span>
      </Tooltip>
        </Typography>
      </Box>
    </Box>
  );
};

export default StatusCard;
