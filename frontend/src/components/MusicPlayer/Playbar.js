import React, { useContext, useEffect, useState } from "react";
import "react-bootstrap";
import { Badge, Container, ProgressBar } from "react-bootstrap";
import ReactPlayer from "react-player";
import { AppContext } from "../../AppContextProvider";
import styles from "./Playbar.module.css";
import SongControls from "./SongControls";
import SongInfo from "./SongInfo";

export default function Playbar() {
    const [duration, setDuration] = useState(0);
    const [songLength, setSongLength] = useState(0);
    const [volume, setVolume] = useState(0.3);
    const [player, setPlayer] = useState();
    const playbarRenderTime = 500;
    const ref = player => { setPlayer(player) }

    const { socket, currentSong, key, playing, setPlaying, elapsedTime, setElapsedTime } = useContext(
        AppContext
    );
    //Sets default volume on joining room to 30% of max
    useEffect(() => {
        setVolume(0.3);
    }, []);

    //If there is a current song, return the content of the song i.e. url and title
    function currentSongContext() {
        if (currentSong) {
            return currentSong.content;
        }
    }
    //Send the duration of the song to the context
    function handleOnProgress(e) {
        setDuration(e.playedSeconds);
    }
    //Send the song length to the context
    function handleSongLengthChange(e) {
        setSongLength(e.toFixed(0) - 1);
    }
    //Once the songs ended, emit to the server so every client gets the message
    async function handleOnEnded() {
        socket.emit("Song ended", currentSong);
    }
    //Once the songs started, emit to the server so every client gets the message
    async function handleOnStart() {
        socket.emit("Song started", currentSong);

        if (elapsedTime > songLength) {
            setElapsedTime(0);
            socket.emit("Song ended", currentSong);
        }
        else {
            player.seekTo(elapsedTime);
            setElapsedTime(0);
        }
    }

    return (
        <>
            <ReactPlayer
                ref={ref}
                url={currentSongContext()}
                onProgress={(e) => handleOnProgress(e)}
                progressInterval={playbarRenderTime}
                onReady={() => {
                    setPlaying(true);
                }}
                key={key}
                playing={playing}
                volume={volume}
                onDuration={(e) => handleSongLengthChange(e)}
                onEnded={handleOnEnded}
                onStart={handleOnStart}
                height="0"
                width="0"
            />
            <Container fluid className={styles.playbar} data-testid='playbar'>
                <div>
                    <ProgressBar className={styles.progressBar} now={duration} min="0" max={songLength} />
                    <div className={styles.durationTime}>
                        <Badge pill variant="secondary" >{new Date(duration.toFixed(1) * 1000).toISOString().substr(14, 5)}</Badge>
                    </div>
                    <div className={styles.songLengthTime}>
                        <Badge pill variant="secondary" >{new Date(songLength.toFixed(1) * 1000).toISOString().substr(14, 5)}</Badge>
                    </div>
                </div>
                <Container fluid className={styles.playbarContainer}>
                    <SongControls className={styles.songControls} />
                    <div className={styles.songInfo}>
                        <SongInfo />
                    </div>

                    <Container className={styles.volumeControls}>
                        <div className={styles.volumeSlider}>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.02}
                                value={volume}
                                onChange={(event) => {
                                    setVolume(event.target.valueAsNumber);
                                }}

                            />
                        </div>
                    </Container>
                </Container>
            </Container>
        </>
    );
}
