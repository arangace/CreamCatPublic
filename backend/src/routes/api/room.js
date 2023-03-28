import express from "express";
import { createRoom, retrieveRoom } from "../../rooms-data/rooms-dao";
import dayjs from "dayjs";

const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;

const router = express.Router();

router.post("/create/", async (req, res) => {
    try {
        const room = {
            name: req.body.name,
            description: req.body.description,
            password: req.body.password,
            userCount: 0,
            lastActive: dayjs(),
            startTime: dayjs().add(-2, "day"),
            endTime: dayjs().add(-1, "day"),
        };

        if (room.name) {
            const newRoom = await createRoom(room);
            res.status(HTTP_CREATED)
                .header("Location", `/${newRoom._id}`)
                .json(newRoom);
        } else {
            res.json("Room name is required!");
        }
    } catch {
        res.sendStatus(HTTP_BAD_REQUEST);
    }
});

router.post("/join/", async (req, res) => {
    try {
        const id = req.body._id;
        const password = req.body.password;
        if (id) {
            const room = await retrieveRoom(id);
            if (room) {
                if (room.password) {
                    if (room.password == password) {
                        res.header("Location", `/${room._id}`).json(room);
                    } else {
                        res.json("Password incorrect!");
                    }
                } else {
                    res.header("Location", `/${room._id}`).json(room);
                }
            } else {
                res.json("Room not found!");
            }
        } else {
            res.json("Room ID is required!");
        }
    } catch {
        res.json("Room not found!");
    }
});

export default router;
