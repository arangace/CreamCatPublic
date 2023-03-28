import axios from "axios";
import React, { useState } from "react";

const AppContext = React.createContext();

function AppContextProvider({ children }) {
    const [currentRoom, setCurrentRoom] = useState(
        JSON.parse(localStorage.getItem("currentRoom"))
    );
    const [playlist, setPlaylist] = useState([]);
    const [playing, setPlaying] = useState(true);
    const [currentSong, setCurrentSong] = useState();
    const [version, setVersion] = useState(false);
    const [socket, setSocket] = useState();
    const [key, setKey] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [voteSkip, setVoteSkip] = useState(false);
    const [votingFor, setVotingFor] = useState({});
    const [displayNoCurrentSongAlert, setDisplayNoCurrentSongAlert] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [latency, setLatency] = useState(0);

    //Create room function
    async function createRoom(room) {
        const response = await axios.post(
            "http://localhost:3000/api/room/create/",
            room
        );
        localStorage.setItem("currentRoom", JSON.stringify(response.data));
        setCurrentRoom(JSON.parse(localStorage.getItem("currentRoom")));
    }

    //Join room function
    async function joinRoom(room) {
        const response = await axios.post(
            "http://localhost:3000/api/room/join/",
            room
        );
        if (response.data.name) {
            localStorage.setItem("currentRoom", JSON.stringify(response.data));
            setCurrentRoom(JSON.parse(localStorage.getItem("currentRoom")));
            return "forward";
        } else {
            return response.data;
        }
    }

    //reset the vote state after the vote event
    function resetVoteState(voteType) {
        // voteType: skip, play, pause
        switch (voteType) {
            case "skip":
                setVoteSkip(false);
                break;
            case "play":
                //future feature
                break;
            case "pause":
                //future feature
                break;
            default:
                console.log(`Unhandled voteType`);
        }
    }

    // get the current vote state
    function getVoteState(voteType) {
        // voteType: skip, play, pause
        switch (voteType) {
            case "skip":
                return voteSkip;
            case "play":
                //future feature
                break;
            case "pause":
                //future feature
                break;
            default:
                console.log(`Unhandled voteType`);
        }
    }

    // The context value that will be supplied to any descendants of this component.
    const context = {
        currentRoom,
        setCurrentRoom,
        playlist,
        setPlaylist,
        playing,
        setPlaying,
        currentSong,
        setCurrentSong,
        version,
        setVersion,
        socket,
        setSocket,
        key,
        setKey,
        userCount,
        setUserCount,
        voteSkip,
        setVoteSkip,
        votingFor,
        setVotingFor,
        displayNoCurrentSongAlert,
        setDisplayNoCurrentSongAlert,
        elapsedTime,
        setElapsedTime,
        latency,
        setLatency,
        createRoom,
        joinRoom,
        resetVoteState,
        getVoteState,
    };

    // Wraps the given child components in a Provider for the above context.
    return (
        <AppContext.Provider value={context}>{children}</AppContext.Provider>
    );
}

export { AppContext, AppContextProvider };
