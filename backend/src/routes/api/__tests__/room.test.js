import mongoose from "mongoose";
import connectToDatabase from "../../../rooms-data/db-connect";
import router from "../room";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import axios from "axios";
import { Room } from "../../../rooms-data/rooms-schema";

let mongod, app, server;
let room1, room2, room3, room4;

beforeAll(async (done) => {
    mongod = new MongoMemoryServer();

    await mongod.getUri().then((cs) => connectToDatabase(cs));

    app = express();
    app.use(express.json());
    app.use("/", router);
    server = app.listen(3000, () => done());
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
    };

    room2 = {
        name: "1234",
        description: "aaa",
        password: "abc",
    };

    room3 = {
        name: "123",
    };

    room4 = {
        name: "111",
        password: "123",
    };

    const dbroom1 = new Room(room1);
    room1._id = dbroom1._id;
    dbroom1.save();

    const dbroom2 = new Room(room2);
    room2._id = dbroom2._id;
    dbroom2.save();

    const dbroom3 = new Room(room3);
    room3._id = dbroom3._id;

    const dbroom4 = new Room(room4);
    dbroom4.save();
});

afterEach(async () => {
    await Room.deleteMany({});
});

it("Create a new room without name", async () => {
    const room = {
        description: "123",
    };

    const response = await axios.post("http://localhost:3000/create/", room);
    expect(response.data).toBe("Room name is required!");
    expect(await Room.countDocuments()).toBe(3);
});

it("Create a new room without password or description", async () => {
    const room = {
        name: "123",
    };

    const response = await axios.post("http://localhost:3000/create/", room);
    expect(response.status).toBe(201);
    const rsroom = response.data;
    expect(rsroom.name).toBe("123");
    expect(rsroom.description).toBe(undefined);
    expect(rsroom.password).toBe(undefined);
    expect(rsroom.userCount).toBe(0);
    expect(await Room.countDocuments()).toBe(4);

    const dbroom = await Room.findById(rsroom._id);
    expect(dbroom.name).toBe("123");
    expect(dbroom.description).toBe(undefined);
    expect(dbroom.password).toBe(undefined);
    expect(dbroom.userCount).toBe(0);
});

it("Create a new room with password and description", async () => {
    const room = {
        name: "123",
        description: "abc",
        password: "aaa",
    };

    const response = await axios.post("http://localhost:3000/create/", room);
    expect(response.status).toBe(201);
    const rsroom = response.data;
    expect(rsroom.name).toBe("123");
    expect(rsroom.description).toBe("abc");
    expect(rsroom.password).toBe("aaa");
    expect(rsroom.userCount).toBe(0);
    expect(await Room.countDocuments()).toBe(4);

    const dbroom = await Room.findById(rsroom._id);
    expect(dbroom.name).toBe("123");
    expect(dbroom.description).toBe("abc");
    expect(dbroom.password).toBe("aaa");
    expect(rsroom.userCount).toBe(0);
});

it("Join an existing password-free room", async () => {
    const rqroom = {
        _id: room1._id,
    };

    const response = await axios.post("http://localhost:3000/join/", rqroom);
    const rsroom = response.data;
    expect(rsroom.name).toBe("123");
    expect(rsroom.description).toBe(undefined);
    expect(rsroom.password).toBe(undefined);
});

it("Join an existing password-protected room with right password", async () => {
    const rqroom = {
        _id: room2._id,
        password: "abc",
    };

    const response = await axios.post("http://localhost:3000/join/", rqroom);
    const rsroom = response.data;
    expect(rsroom.name).toBe("1234");
    expect(rsroom.description).toBe("aaa");
    expect(rsroom.password).toBe("abc");
});

it("Join an existing password-protected room without wrong password", async () => {
    const rqroom = {
        _id: room2._id,
        password: "123",
    };

    const response = await axios.post("http://localhost:3000/join/", rqroom);
    const rsroom = response.data;
    expect(rsroom).toBe("Password incorrect!");
});

it("Join an unexisting room", async () => {
    const rqroom = {
        _id: room3._id,
    };

    const response = await axios.post("http://localhost:3000/join/", rqroom);
    const rsroom = response.data;
    expect(rsroom).toBe("Room not found!");
});

it("Join room without providing ID", async () => {
    const rqroom = {
        password: "123",
    };

    const response = await axios.post("http://localhost:3000/join/", rqroom);
    const rsroom = response.data;
    expect(rsroom).toBe("Room ID is required!");
});
