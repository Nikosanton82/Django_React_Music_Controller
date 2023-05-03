import React, { useState, useEffect } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Button, Grid, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

const HomePage = () => {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        setRoomCode(data.code);
      });
  }, []);

  const renderHomePage = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" component="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button color="primary" to="/join" component={Link} variant="contained">
                Join a room
              </Button>
            </Grid>
            <Grid item>
              <Button color="secondary" to="/create" component={Link} variant="contained">
                Create a room
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={roomCode ? <Navigate to={`/room/${roomCode}`} /> : renderHomePage()} />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomCode" element={<Room />} />
      </Routes>
    </Router>
  );
};

export default HomePage;
