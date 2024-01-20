import React, { useState } from "react";
import { Container, Paper, TextField, Button, Typography, Avatar} from "@mui/material";
import Icon from "./../../assets/logo_new.png"
const avatarStyle = {
    width: "100px",
    height: "100px",
    marginBottom: "16px",
  };
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
};

const paperStyle = {
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const formStyle = {
  width: "100%",
  marginTop: "16px",
};

const submitButtonStyle = {
  marginTop: "24px",
};

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace these values with your actual username and password logic
    if (username === "admin" && password === "password") {
      onLogin(); // Call the onLogin function to set the authentication state
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={containerStyle}>
      <Avatar src={Icon} alt="Avatar" style={avatarStyle} />
      <Paper elevation={3} style={paperStyle}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form style={formStyle} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={submitButtonStyle}
          >
            Login
          </Button>
        </form>
        {error && <p>{error}</p>}
      </Paper>
    </Container>
  );
};

export default Login;
