import { Box, IconButton, useTheme ,Tooltip } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";

const Topbar = ({onLogout}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // const history = useHistory();

  const handleLogout = () => {
    onLogout();
    
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
             <Tooltip title="Light" arrow  placement="bottom">
            <DarkModeOutlinedIcon />
             </Tooltip>
          ) : ( <Tooltip title="Dark"arrow placement="bottom">
            <LightModeOutlinedIcon />
            </Tooltip>
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
        <Tooltip title="SETTINGS" arrow placement="bottom">
          <SettingsOutlinedIcon />
          </Tooltip> 
        </IconButton>
        <IconButton onClick={handleLogout}>
        <Link to='/' style={{
        color: colors.grey[100],
      }}>
        <Tooltip title="LOGOUT" arrow placement="bottom" >
        <LogoutIcon />
      </Tooltip>  
      </Link>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
