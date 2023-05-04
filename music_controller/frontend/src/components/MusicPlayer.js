import React from "react";
import { Grid, Typography, Card, IconButton, LinearProgress } from "@mui/material";
import { PlayArrow as PlayArrowIcon, SkipNext, Pause } from '@mui/icons-material';

const MusicPlayer = ({ image_url, title, artist, time, duration, is_playing }) => {

    const songProgress = (time / duration) * 100;

    return (
        <Card>
            <Grid container alignItems="center">
                <Grid item align="center" xs={4}>
                    <img src={image_url} height="100%" width="100%" alt="Album cover" />
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant="h5">
                        {title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {artist}
                    </Typography>
                    <div>
                        <IconButton>
                            {is_playing ? <Pause /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton>
                            <SkipNext />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress} />
        </Card>
    );
};

export default MusicPlayer;
