import axios from "axios";
import { useContext, useEffect } from "react";
import { AppContext } from "../../AppContextProvider";
import styles from "./Playlist.module.css";

export default function Playlist() {
    const { currentRoom, playlist, setPlaylist, version, setCurrentSong, setPlaying } = useContext(AppContext);

    const room = {
        roomID: currentRoom._id,
        password: currentRoom.password,
    };

    //Removes the escaped characters from the title for better UX
    function removeSpecialChar(title) {
        return (
            title.replace(/&apos;/g, "'")
                .replace(/&quot;/g, '"')
                .replace(/&gt;/g, '>')
                .replace(/&lt;/g, '<')
                .replace(/&amp;/g, '&')
        )
    }
    //Fetches playlist data everytime the version of the playlist is changed, making it dynamically fetch the new playlists
    useEffect(() => {

        async function fetchData() {
            await axios
                .post("http://localhost:3000/api/playlist/getall/", room)
                .then((response) => {
                    if (response.data.length > 0) {
                        const songs = response.data;
                        setPlaylist(songs);
                        setCurrentSong(songs[0]);
                    } else {
                        setCurrentSong();
                        setPlaylist([]);
                        setPlaying(false);
                    }
                })
                .catch((error) => console.error(error.response.data));
        }
        fetchData();
    }, [version]);
    //Constructs the playlist on the page based on the playlist data, if no songs are present then a message is displayed
    function buildPlaylist() {
        if (playlist && playlist.length > 0) {
            return playlist.map((song, index) => {
                const trackNumber = (index + 1).toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                });

                return (
                    <li key={index} className={index == 0 ? styles.highlight : ""}>
                        <div className={styles.playlistItem} >
                            <span className={styles.songNumber}>
                                {trackNumber}
                            </span>
                            <span className={styles.songTitle}>
                                {removeSpecialChar(song.title)}
                            </span>
                        </div>
                    </li>
                );
            });
        } else {
            return (
                <li>Don't you think it's a bit quiet..? Try adding a song!</li>
            );
        }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.column}>
                    <ul className={styles.playlist}>{buildPlaylist()}</ul>
                </div>
            </div>
        </>
    );
}
