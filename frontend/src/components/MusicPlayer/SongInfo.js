import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import { AppContext } from '../../AppContextProvider';
import styles from "./Playbar.module.css";
export default function SongInfo() {

    const { currentSong } = useContext(AppContext);
    //Remove escaped characters from the title when displaying on the song information
    function removeSpecialChar(title) {
        return (
            title.replace(/&apos;/g, "'")
                .replace(/&quot;/g, '"')
                .replace(/&gt;/g, '>')
                .replace(/&lt;/g, '<')
                .replace(/&amp;/g, '&')
        )
    }

    return (
        <Card bg="dark" text="light">
            <Card.Body className={styles.songInfoText}>
                <Card.Title className={styles.titleText}>{currentSong ? removeSpecialChar(currentSong.title) : "No song in queue..."}</Card.Title>
                <Card.Subtitle className={styles.limitTextLength}>
                    {currentSong ? currentSong.content : "Try adding a song from the search bar!"}
                </Card.Subtitle>
            </Card.Body>
        </Card>
    );
}
