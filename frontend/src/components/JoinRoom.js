import { useContext, useState } from "react";
import { Badge, Button, Container, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { AppContext } from "../AppContextProvider";
import "./styles.css";

export default function JoinRoomPage() {
    const { joinRoom } = useContext(AppContext);

    const [roomIdInput, setRoomIdInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const [message, setMessage] = useState("");

    const history = useHistory();

    //sends user to the room page and sends information to the database
    async function handleJoinRoom() {
        const sessionData = {
            _id: roomIdInput,
            password: passwordInput,
        };

        if (sessionData._id) {
            const response = await joinRoom(sessionData);
            if (response === "forward") {
                history.replace(`/Room`);
            } else {
                setMessage(response);
            }
        } else {
            setMessage("Room ID is required!");
        }
    }
    return (
        <>
            <div className="JoinRoom">
                <Container className="bg-secondary text-white">
                    <Badge variant="dark" className="room-centered">
                        <h1>CreamCat</h1>
                    </Badge>

                    <h1 className="centered">Join Room</h1>
                    <div className="join-room-page ">
                        <Form>
                            <Form.Group controlId="RoomID">
                                <Form.Label>Room ID</Form.Label>
                                <Form.Control
                                    onInput={(e) =>
                                        setRoomIdInput(e.target.value)
                                    }
                                    placeholder="Room ID"
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password (Optional)</Form.Label>
                                <Form.Control
                                    onInput={(e) =>
                                        setPasswordInput(e.target.value)
                                    }
                                    placeholder="Password"
                                />
                            </Form.Group>
                            <Button
                                variant="dark"
                                type="button"
                                onClick={handleJoinRoom}
                            >
                                Join
                            </Button>
                            <div>
                                <span style={{ color: "red" }}>{message}</span>
                            </div>
                        </Form>
                    </div>
                </Container>
            </div>
        </>
    );
}
