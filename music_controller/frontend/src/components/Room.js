import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateRoomPage from './CreateRoomPage';
import MusicPlayer from './MusicPlayer';

const Room = ({ leaveRoomCallback }) => {
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [song, setSong] = useState(null); // Initialize the song state
    const { roomCode } = useParams();
    const navigate = useNavigate();

    const getCurrentSong = useCallback(() => {
        fetch('/spotify/current-song').then((response) => {
            if (!response.ok) {
                return {};
            } else {
                return response.json();
            }
        }).then((data) => {
            setSong(data); // Update the song state
            console.log(data);
        });
    }, []); // Add an empty dependency array

    useEffect(() => {
        getRoomDetails();
    }, []);

    useEffect(() => {
        const interval = setInterval(getCurrentSong, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [getCurrentSong]);

    useEffect(() => {
        if (isHost) {
            authenticateSpotify();
        }
    }, [isHost]);

    const getRoomDetails = () => {
        fetch('/api/get-room' + '?code=' + roomCode)
            .then((response) => {
                if (!response.ok) {
                    leaveRoomCallback();
                    navigate('/');
                }
                return response.json();
            })
            .then((data) => {
                setVotesToSkip(data.votes_to_skip);
                setGuestCanPause(data.guest_can_pause);
                setIsHost(data.is_host);
    
                if (isHost && !spotifyAuthenticated) {
                    authenticateSpotify();
                }
            });
    };

    const authenticateSpotify = () => {
        fetch('/spotify/is-authenticated')
        .then((response) => response.json())
        .then((data) => {
            setSpotifyAuthenticated(data.status);
            if (!data.status) {
                fetch('/spotify/get-auth-url')
                    .then((response) => response.json())
                    .then((data) => {
                        window.location.replace(data.url);
                });
            }
        });
    }

    const leaveButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': "application/json"},
        };
        fetch('/api/leave-room', requestOptions).then((_response) => {
            leaveRoomCallback();
            navigate('/');
        });
    }

    const updateShowSettings = (value) => {
        setShowSettings(value);
    }

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color='primary' onClick={() => updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }

    if (showSettings) {
        return renderSettings();
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant='h4' component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <MusicPlayer {...song} />
            {isHost ? renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    );
};

export default Room;
