import express from "express";
import { retrieveRoom } from "../../rooms-data/rooms-dao";
import { addSong, retrieveAllSongs } from "../../rooms-data/songs-dao";

const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;

const router = express.Router();

router.post("/add/", async (req, res) => {
    const io = req.app.get("socketio");
    try {
        if (!req.body.roomID) {
            throw "Room ID not in request body";
        }
        const room = await retrieveRoom(req.body.roomID);
        if (room) {
            if (room.password == req.body.password) {
                const song = {
                    roomID: req.body.roomID,
                    title: req.body.title,
                    content: req.body.content,
                    image: req.body.image,
                    description: req.body.description,
                    channelTitle: req.body.channelTitle,
                    source: req.body.source,
                    publishTime: req.body.publishTime,
                };
                if (song.roomID && song.title && song.content) {
                    const newSong = await addSong(song);
                    res.status(HTTP_CREATED).json(newSong);

                    // broadcast new song
                    console.log(`\n Broadcasting new song...`);

                    io.sockets.in(req.body.roomID).emit("Add song", newSong);

                }
                else{
                    res.sendStatus(HTTP_BAD_REQUEST);
                }
            } else {
                res.status(HTTP_UNAUTHORIZED).json("invalid password!");
            }
        } else {
            res.status(HTTP_NOT_FOUND).json("room not found!");
        }
    } catch (err) {
        res.status(HTTP_BAD_REQUEST).json(err);
    }
});

router.post("/getall/", async (req, res) => {
    try {
        if (!req.body.roomID) {
            throw "Room ID not in request body";
        }
        const room = await retrieveRoom(req.body.roomID);

        if (room) {
            if (room.password == req.body.password) {
                const playlist = await retrieveAllSongs(room._id);
                res.json(playlist);
            } else {
                res.status(HTTP_UNAUTHORIZED).json("invalid password!");
            }
        } else {
            res.status(HTTP_NOT_FOUND).json("room not found!");
        }
    } catch (err) {
        res.status(HTTP_BAD_REQUEST).json(err);
    }
});

export default router;
