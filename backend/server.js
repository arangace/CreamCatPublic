import express from "express";
import connectToDatabase from "./rooms-data/db-connect";
import path from "path";
import dayjs from "dayjs";

// Setup Express server
const app = express();
const port = process.env.PORT || 3001;

// Setup body-parser
app.use(express.json());

// Setup routes
import routes from "./routes";
app.use("/", routes);

// Make the "public" folder available statically
app.use(express.static(path.join(__dirname, "../../frontend/public")));

// Delete expired rooms from database
async function clearStaleRoom() {
    const roomsToBeDeleted = await retrieveStaleRooms(dayjs().add(-1, "hour"));
    if (roomsToBeDeleted) {
        roomsToBeDeleted.forEach(async (room) => {
            await deleteSongs(room._id);
            await deleteRoom(room._id);
        });
    }
}

// Check and delete expired rooms every minute
setInterval(clearStaleRoom, 60000);

// When running in production mode
if (process.env.NODE_ENV === "production") {
    console.log("Running in production!");

    // Make build folder public
    app.use(express.static(path.join(__dirname, "../../frontend/build")));

    // Serve up index.html by default
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend/build/index.html"));
    });
}

// Setup socket.io server
import http from "http";
import createSocketIoConnection from "./socket-io/socket-api";
import { deleteRoom, retrieveStaleRooms } from "./rooms-data/rooms-dao";
import { deleteSongs } from "./rooms-data/songs-dao";
const server = http.createServer(app);
const io = createSocketIoConnection(server);
app.set("socketio", io);

// Start the DB running. Then, once it's connected, start the server.
connectToDatabase().then(() =>
    server.listen(port, () =>
        console.log(`App server listening on port ${port}!`)
    )
);
