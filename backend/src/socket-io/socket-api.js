import socketIo from "socket.io";
import { retrieveRoom, updateRoom } from "../rooms-data/rooms-dao";
import { deleteSong } from "../rooms-data/songs-dao";
import dayjs from "dayjs";

export default function createSocketIoConnection(server) {
    const io = socketIo(server);

    // Listen to connection events on socket
    io.on("connection", (socket) => onConnection(socket));
    return io;

    // Callback function for connection event
    async function onConnection(socket) {
        console.log(`[${dayjs().format(`HH:mm:ss`)}] New client connected`);

        socket.on("Ping", () => {
            socket.emit("Pong");
        });

        // Retrieve Room ID from client handshake query
        const { roomID, password } = socket.handshake.query;

        try {
            const roomToUpdate = await retrieveRoom(roomID);
            if (roomToUpdate && roomToUpdate.password == password) {
                socket.join(roomID);
                console.log(`Client joined room ${roomID}`);

                // Increment room user count
                const userCount = roomToUpdate.userCount;
                const newUserCount = userCount + 1;
                const lastActive =
                    newUserCount > 0 ? "2077-02-21" : roomToUpdate.lastActive;

                const newRoom = {
                    ...roomToUpdate._doc,
                    userCount: newUserCount,
                    lastActive: lastActive,
                };
                await updateRoom(newRoom);
                console.log(
                    `[${dayjs().format(
                        `HH:mm:ss`
                    )}] UserCount updated: ${newUserCount}`
                );
                // Emit on connect message to client
                socket.emit("Connected");

                // Synchronize elapsedTime with client
                if (roomToUpdate.endTime < roomToUpdate.startTime) {
                    socket.emit("Synchronize elapsedTime", {
                        elapsedTime:
                            dayjs().diff(
                                roomToUpdate.startTime,
                                "milliseconds"
                            ) / 1000,
                        emitTime: dayjs(),
                    });
                }
                // Update userCount
                io.sockets.in(roomID).emit("Update userCount", newUserCount);
            }
        } catch (err) {
            console.log(`Failed to update room`);
            console.log(err);
        }

        // Listen to song end events
        socket.on("Song ended", (payload) => onSongEnded(payload));

        // Listen to song start events
        socket.on("Song started", (payload) => onSongStart(payload));

        // Listen to vote events
        var votedFor = [];

        socket.on("Vote", (payload) => onVote(payload));

        // Listen to disconnect events
        socket.on("disconnect", () => onDisconnect(roomID));

        // Callback function for song start events
        async function onSongStart(song) {
            try {
                const roomToUpdate = await retrieveRoom(song.roomID);
                if (roomToUpdate) {
                    if (roomToUpdate.startTime < roomToUpdate.endTime) {
                        console.log(
                            `\n[${dayjs().format(
                                `HH:mm:ss`
                            )}] Starting new song`
                        );
                        console.log(
                            `[${dayjs().format(`HH:mm:ss`)}] StartTime updated`
                        );
                        const newRoom = {
                            ...roomToUpdate._doc,
                            startTime: dayjs(),
                        };
                        await updateRoom(newRoom);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }

        // Callback function for add song events
        async function onSongEnded(song) {
            console.log(`[${dayjs().format(`HH:mm:ss`)}] Song ended`);
            try {
                if (!song.roomID) {
                    throw "Room ID missing";
                }
                const roomToUpdate = await retrieveRoom(song.roomID);
                if (roomToUpdate) {
                    const { deletedCount } = await deleteSong(song._id);
                    if (deletedCount > 0) {
                        console.log(
                            `[${dayjs().format(`HH:mm:ss`)}] Song deleted`
                        );
                        console.log(
                            `[${dayjs().format(
                                `HH:mm:ss`
                            )}] Broadcasting refetch`
                        );
                        io.sockets.in(song.roomID).emit("Refetch");
                        if (roomToUpdate.endTime < roomToUpdate.startTime) {
                            console.log(
                                `[${dayjs().format(
                                    `HH:mm:ss`
                                )}] EndTime updated`
                            );
                            const newRoom = {
                                ...roomToUpdate._doc,
                                endTime: dayjs(),
                            };
                            await updateRoom(newRoom);
                        }
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }

        // Callback function for vote events
        async function onVote(payload) {
            // voteType: skip, play, pause
            // vote: for vote = true, against vote = false
            const { roomID, password, voteType, vote, song } = payload;
            console.log(
                `[${dayjs().format(
                    `HH:mm:ss`
                )}] Vote received. roomID: ${roomID}. voteType: ${voteType}, vote: ${vote} `
            );

            // Vote timeout in milliseconds
            const timeout = 15000;
            const voteTypes = ["skip", "play", "pause"];
            try {
                const votingRoom = await retrieveRoom(roomID);

                const userCount = votingRoom.userCount;

                // action: start, update, passed, fail
                let action, voteCount, newRoom;

                if (votingRoom && votingRoom.password == password) {
                    if (!voteTypes.includes(voteType)) {
                        console.log(
                            `Unhandled vote event (outside of case). roomID: ${roomID}. voteType: ${voteType}, vote: ${vote}`
                        );
                    }
                    const { voting } = votingRoom;
                    if (!voting[voteType].count) {
                        // Initialize vote if room is not voting skip
                        action = "start";
                        if (vote) {
                            // Add voteType to votedFor array
                            changeVotes(votedFor, voteType, vote);

                            // Increment voteSkipCount on a "for" vote
                            voteCount = voting[voteType].count + 1;
                            if (voteIsSuccessful(userCount, voteCount)) {
                                action = "passed";
                                // remove voteType from votedFor on a successful vote
                                changeVotes(votedFor, voteType, false);
                            }
                            voteTimeout(
                                roomID,
                                timeout,
                                voteType,
                                voteCount,
                                userCount
                            );
                        } else {
                            console.log(
                                `[Unhandled vote] Against vote received before vote began`
                            );
                            return;
                        }
                    } else {
                        // Update vote if room is voting skip
                        action = "update";
                        // Add/remove voteType to votedFor array if voted is true/false
                        if (vote) {
                            changeVotes(votedFor, voteType, vote);
                            // Increment voting.skip on a "for" vote
                            voteCount = voting[voteType].count + 1;
                            if (voteIsSuccessful(userCount, voteCount)) {
                                // remove voteType from votedFor on a successful vote
                                changeVotes(votedFor, voteType, false);
                                action = "passed";
                            }
                        } else {
                            changeVotes(votedFor, voteType, vote);
                            // Decrement voting.skip on an "against" vote
                            voteCount = voting[voteType].count - 1;
                            // Fail vote if voteCount < 0 and set voting.skip to null
                            if (voteCount < 1) {
                                action = "fail";
                            }
                        }
                    }

                    payload = {
                        action: action,
                        voteType: voteType,
                        voteCount: voteCount,
                        userCount: userCount,
                        song: song,
                    };

                    // Room object with updated voting.skip
                    newRoom = {
                        ...votingRoom._doc,
                    };

                    // reset voting properties to null if vote passed
                    if (action == "passed") {
                        newRoom.voting[voteType].count = null;
                        newRoom.voting[voteType].lastPassed = dayjs();
                        //await onSongEnded(song);
                    } else {
                        newRoom.voting[voteType].count = voteCount;
                    }

                    await updateRoom(newRoom);
                    console.log(`Update successful`);

                    io.sockets.in(roomID).emit("Vote", payload);
                }
            } catch (err) {
                console.log(`Failed to update room`);
                console.log(err);
            }

            function voteIsSuccessful(userCount, voteCount) {
                // Vote success conditions
                // Over 75% users vote for
                if (voteCount > userCount * 0.75) {
                    console.log(`Vote passed: ${voteCount}/${userCount}`);
                    return true;
                } else {
                    return false;
                }
            }
        }

        // Callback function for disconnect events
        async function onDisconnect(roomID) {
            console.log("Client disconnected");
            try {
                // Decrement room userCount
                const roomToUpdate = await retrieveRoom(roomID);
                const userCount = roomToUpdate.userCount;
                const newUserCount = userCount - 1;

                // Being able to hangout with imaginary friends is gonna be a premium function -- Kevin
                const lastActive =
                    newUserCount > 0 ? roomToUpdate.lastActive : dayjs();
                const newRoom = {
                    ...roomToUpdate._doc,
                    userCount: newUserCount,
                    lastActive: lastActive,
                };

                // Decrease vote count for all voteTypes that exists in the votedFor array
                votedFor.forEach((voteType) => {
                    const voteCount = roomToUpdate.voting[voteType].count;
                    const newVoteCount = voteCount - 1;
                    newRoom.voting[voteType].count = newVoteCount;
                });

                await updateRoom(newRoom);
                io.sockets.in(roomID).emit("Update userCount", newUserCount);
                console.log(`Update successful. userCount: ${newUserCount}`);
                if (newUserCount < 1) {
                    console.log(`Room ${roomID} is inactive`);
                }
            } catch (err) {
                console.log(`Failed to update room`);
                console.log(err);
            }
        }

        // Timeout timer called at the beginning of a start vote event
        function voteTimeout(roomID, timeout, voteType, voteCount, userCount) {
            setTimeout(async () => {
                const votingRoom = await retrieveRoom(roomID);
                const { voting } = votingRoom;
                if (voting[voteType].count > 0) {
                    const lastPassed = voting[voteType].lastPassed;
                    // Fail condition
                    if (
                        lastPassed == null ||
                        (lastPassed &&
                            lastPassed.isBefore(
                                dayjs().add(-timeout, "millisecond")
                            ))
                    ) {
                        console.log("Vote timed out");
                        changeVotes(votedFor, voteType, false);
                        const payload = {
                            action: `fail`,
                            voteType: voteType,
                            voteCount: voteCount,
                            userCount: userCount,
                        };

                        const newRoom = {
                            ...votingRoom._doc,
                        };

                        // reset voting properties to null if vote failed
                        newRoom.voting[voteType].count = null;

                        await updateRoom(newRoom);
                        console.log(`Update successful`);
                        io.sockets.in(roomID).emit("Vote", payload);
                    }
                } else {
                    console.log(`Vote succeeded. Timeout cancelled.`);
                }
            }, timeout);
        }

        // Helper function to add/remove voteType from the votedFor list
        function changeVotes(votedFor, voteType, vote) {
            if (vote) {
                //  Add voteType to array if voteType not in votedFor array
                if (!votedFor.includes(voteType)) {
                    votedFor.push(voteType);
                }
            } else {
                //  Remove voteType from array if voteType in votedFor array
                const index = votedFor.indexOf(voteType);
                if (index > -1) {
                    votedFor.splice(index, 1);
                }
            }
        }
    }
}
