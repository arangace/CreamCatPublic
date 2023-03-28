import { createServer } from "http";
import { Server } from "socket.io";
import Client from "socket.io-client";

const port = 3001;

let io, serverSocket, clientSocket;

beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(port, () => {
        clientSocket = new Client(`http://localhost:${port}`);
        io.on("connection", (socket) => {
            serverSocket = socket;
        });
        clientSocket.on("connect", done);
    });
});

afterAll(() => {
    io.close();
    clientSocket.close();
});

it("receives socket emits from server", (done) => {
    clientSocket.on("Emit Header", done);
    serverSocket.emit("Emit Header");
});