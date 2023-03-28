import mongoose from "mongoose";
import connectToDatabase from "../../../rooms-data/db-connect";
import router from "../playlist";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import axios from "axios";
import { Room } from "../../../rooms-data/rooms-schema";
import { Song } from "../../../rooms-data/songs-schema";
import createSocketIoConnection from "../../../socket-io/socket-api";
import http from "http";

let mongod, app, server;
let room1, room2;
let song1, song2;
let io;

beforeAll(async (done) => {
    mongod = new MongoMemoryServer();

    await mongod.getUri().then((cs) => connectToDatabase(cs));

    app = express();
    app.use(express.json());
    app.use("/", router);
    server = http.createServer(app);
    io = createSocketIoConnection(server);
    app.set("socketio", io);
    server.listen(3001, () => done());
});

afterAll((done) => {
    server.close(async () => {
        await mongoose.disconnect();
        await mongod.stop();
        done();
    });
});

beforeEach(async () => {
    room1 = {
        name: "123",
        password: "123",
    };

    room2 = {
        name: "1234",
        password: "abc",
    };

    const dbroom1 = new Room(room1);
    room1._id = dbroom1._id;
    dbroom1.save();

    const dbroom2 = new Room(room2);
    room2._id = dbroom2._id;

    song1 = {
        roomID: room1._id,
        title: "song1",
        content: "aaa",
    };

    song2 = {
        roomID: room1._id,
        title: "song2",
        content: "bbb",
    };

    const dbsong1 = new Song(song1);
    song1._id = dbsong1._id;
    dbsong1.save();
    const dbsong2 = new Song(song2);
    song2._id = dbsong2._id;
    dbsong2.save();
});

afterEach(async () => {
    await Room.deleteMany({});
    await Song.deleteMany({});
});

it("Add a new song successfully", async () => {
    const newSong = {
        roomID: room1._id,
        title: "song3",
        content: "ccc",
        password: "123",
    };

    const response = await axios.post("http://localhost:3001/add/", newSong);
    expect(response.status).toBe(201);
    expect(response.data.roomID.toString()).toEqual(room1._id.toString());
    expect(response.data.title).toBe("song3");
    expect(response.data.content).toBe("ccc");
    expect(await Song.countDocuments({ roomID: `${room1._id}` })).toBe(3);
    const dbSong = await Song.findById(response.data._id);
    expect(dbSong._id.toString()).toEqual(response.data._id);
    expect(dbSong.title).toBe("song3");
    expect(dbSong.content).toBe("ccc");
});

it("Add a new song with wrong room password", async () => {
    const newSong = {
        roomID: room1._id,
        title: "song3",
        content: "ccc",
        password: "1234",
    };
    try {
        const response = await axios.post(
            "http://localhost:3001/add/",
            newSong
        );
        fail();
    } catch (error) {
        const { response } = error;
        expect(response.status).toBe(401);
        expect(response.data).toBe("invalid password!");
    }
    expect(await Song.countDocuments({ roomID: `${room1._id}` })).toBe(2);
});

it("Add a new song to unexisting room", async () => {
    const newSong = {
        roomID: room2._id,
        title: "song3",
        content: "ccc",
        password: "abc",
    };

    try {
        const response = await axios.post(
            "http://localhost:3001/add/",
            newSong
        );
        fail();
    } catch (error) {
        const { response } = error;
        expect(response.status).toBe(404);
        expect(response.data).toBe("room not found!");
    }
});

it("Add a new song without room ID", async () => {
    const newSong = {
        title: "song3",
        content: "ccc",
        password: "1234",
    };

    try {
        const response = await axios.post(
            "http://localhost:3001/add/",
            newSong
        );
        fail();
    } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
    }
});

it("Add a new song without song title", async () => {
    const newSong = {
        roomID: room1._id,
        content: "ccc",
        password: "123",
    };

    try {
        const response = await axios.post(
            "http://localhost:3001/add/",
            newSong
        );
        fail();
    } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
    }
    expect(await Song.countDocuments({ roomID: `${room1._id}` })).toBe(2);
});

it("Add a new song without song content", async () => {
    const newSong = {
        roomID: room1._id,
        title: "song3",
        password: "123",
    };

    try {
        const response = await axios.post(
            "http://localhost:3001/add/",
            newSong
        );
        fail();
    } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
    }
    expect(await Song.countDocuments({ roomID: `${room1._id}` })).toBe(2);
});

it("Get songs without provide room ID", async () => {
    const room = {
        password: "1234",
    };

    try {
        const response = await axios.post(
            "http://localhost:3001/getall/",
            room
        );
        fail();
    } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data).toBe("Room ID not in request body");
    }
});

it("Get songs from unexisting room", async () => {
    const room = {
        roomID: room2._id,
        password: "abc",
    };

    try {
        const response = await axios.post(
            "http://localhost:3001/getall/",
            room
        );
        fail();
    } catch (error) {
        const { response } = error;
        expect(response.status).toBe(404);
        expect(response.data).toBe("room not found!");
    }
});

it("Get songs with wrong password", async () => {
    const room = {
        roomID: room1._id,
        password: "111",
    };

    try {
        const response = await axios.post(
            "http://localhost:3001/getall/",
            room
        );
        fail();
    } catch (error) {
        const { response } = error;
        expect(response.status).toBe(401);
        expect(response.data).toBe("invalid password!");
    }
});

it("Get songs successfully", async () => {
    const room = {
        roomID: room1._id,
        password: "123",
    };

    const response = await axios.post("http://localhost:3001/getall/", room);
    const songs = response.data;
    expect(songs.length).toBe(2);
    expect(songs[0].roomID).toBe(room1._id.toString());
    expect(songs[0].title).toBe("song1");
    expect(songs[0].content).toBe("aaa");
    expect(songs[0]._id.toString()).toBe(song1._id.toString());

    expect(songs[1].roomID.toString()).toBe(room1._id.toString());
    expect(songs[1].title).toBe("song2");
    expect(songs[1].content).toBe("bbb");
    expect(songs[1]._id.toString()).toBe(song2._id.toString());
});
