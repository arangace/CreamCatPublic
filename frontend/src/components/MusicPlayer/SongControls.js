import React, { useContext, useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { FaPause, FaPlay, FaStepForward } from "react-icons/fa";
import { AppContext } from "../../AppContextProvider";
import styles from "./SongControls.module.css";
export default function SongControls() {
    const {
        currentRoom,
        playing,
        socket,
        voteSkip,
        setVoteSkip,
        setDisplayNoCurrentSongAlert,
        currentSong
    } = useContext(AppContext);

    const [playButtonText, setPlayButtonText] = useState(<FaPause />);
    //Upon click of vote skip send the vote to the backend through the socket and emit it to other users so they're aware of the vote count
    function handleVoteSkip() {
        if (currentSong) {
            const vote = !voteSkip;
            setVoteSkip((v) => !v);
            const payload = {
                roomID: currentRoom._id,
                password: currentRoom.password,
                voteType: "skip",
                vote: vote,
                song: currentSong,
            };
            socket.emit("Vote", payload);
        } else {
            setDisplayNoCurrentSongAlert(true);
            setTimeout(() => setDisplayNoCurrentSongAlert(false), 2000);
        }
    }
    //When the playling value changes, the button look is changed
    useEffect(() => {
        if (playing) {
            setPlayButtonText(<FaPause />);
        } else {
            setPlayButtonText(<FaPlay />);
        }
    }, [playing]);

    return (
        <>
            <Container className={styles.songControls}>
                <Button variant="outline-light" size="lg" className={styles.playBtn} disabled data-testid='play'>
                    {playButtonText}
                </Button>{" "}
                <Button variant="dark" size="lg" className={styles.voteSkip} onClick={handleVoteSkip} active data-testid='skip'>
                    <FaStepForward />
                </Button>
            </Container>
        </>
    );
}
