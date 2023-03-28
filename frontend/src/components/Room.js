import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import "react-bootstrap";
import { useHistory } from "react-router";
import { io } from "socket.io-client";
import { AppContext } from "../AppContextProvider";
import MusicPlayer from "./MusicPlayer";

export default function Room() {
    // TODO: add state for userCount in AppContext
    const {
        currentRoom,
        setUserCount,
        setVersion,
        setSocket,
        setKey,
        resetVoteState,
        setVotingFor,
        setElapsedTime,
        setLatency,
        currentSong
    } = useContext(AppContext);

    const history = useHistory();

    useEffect(() => {
        if (!currentRoom) {
            history.replace(`/RoomPage`);
        } else {
            // Connect to socket on localhost server and pass roomId
            const socket = io({
                query: {
                    roomID: currentRoom._id,
                    password: currentRoom.password,
                },
            });

            // Update latency every 2 seconds
            //ping(2000);

            socket.on("Connected", () => {
                setSocket(socket);
            });
            socket.on("Update userCount", (userCount) => {
                setUserCount(userCount);
            });
            socket.on("Add song", () => addSongCallback());

            socket.on("Refetch", () => {
                setVersion((v) => !v);
                setKey((k) => k + 1);
            });

            socket.on("Vote", (response) => {
                voteCallback(response);
            });

            socket.on(
                "Synchronize elapsedTime",
                ({ elapsedTime, emitTime }) => {
                    // Change this value to decrease/increase buffer
                    setElapsedTime(
                        elapsedTime === 0
                            ? 0
                            : elapsedTime +
                                  dayjs().diff(emitTime, "milliseconds") / 1000
                    );
                }
            );

            function voteCallback(response) {
                const { action, voteType, voteCount, song } = response;
                switch (action) {
                    case "start":
                        // display voting status alert
                        // display pass condition
                        setVotingFor((vf) => {
                            const votingFor = {...vf};
                            votingFor[voteType] = voteCount;
                            return votingFor;
                        });
                        break;
                    case "update":
                        // update voting status alert
                        setVotingFor((vf) => {
                            const votingFor = {...vf};
                            votingFor[voteType] = voteCount;
                            return votingFor;
                        });
                        break;
                    case "fail":
                        // remove voting status alert
                        // reset all states to default
                        resetVoteState(voteType);
                        setVotingFor((vf) => {
                            const votingFor = {...vf};
                            delete votingFor[voteType];
                            return votingFor;
                        });
                        break;
                    case "passed":
                        // current song deleted from database, display passed alert, refetch playlist and play new song
                        // could implement a countdown
                        // reset all states to default
                        resetVoteState(voteType);
                        socket.emit("Song ended", song);
                        setVotingFor((vf) => {
                            const votingFor = {...vf};
                            delete votingFor[voteType];
                            return votingFor;
                        });
                        break;
                    default:
                }
                // display vote alert
                // maybe highlight skip button
            }
        }
    }, []);

    function addSongCallback() {
        setVersion((v) => !v);
    }

    if (!currentRoom) {
        history.replace(`/RoomPage`);
        return null;
    } else {
        return (
            <>

                <div className="temp-gap"></div>
                <div className="musicPlayer-dark-mode">
                </div>
                <div className="dark-mode">

                    <MusicPlayer />

                </div>

            </>
        );
    }
}
