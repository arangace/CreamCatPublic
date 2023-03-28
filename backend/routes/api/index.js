import express from "express";

const router = express.Router();

import room from "./room";
router.use("/room", room);

import playlist from "./playlist";
router.use("/playlist", playlist);

export default router;
