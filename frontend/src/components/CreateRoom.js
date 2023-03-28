import React, { useContext, useState } from "react";
import { Badge, Button, Container, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { AppContext } from "../AppContextProvider";
import "./styles.css";

export default function CreateRoomPage() {
    const { createRoom } = useContext(AppContext);

    const [roomNameInput, setRoomNameInput] = useState("");
    const [roomDescInput, setRoomDescInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const [message, setMessage] = useState("");

    const history = useHistory();

    //creates room in the database and sends user to the roomPage
    async function handleCreateRoom() {

        const sessionData = {
            name: roomNameInput,
            description: roomDescInput,
            password: passwordInput,
        };

        if (sessionData.name) {
            await createRoom(sessionData);
            history.replace(`/Room`);
        } else {
            setMessage("Room name is required!");
        }
    }

    return (
        <>
            <div className="CreateRoom">
                <Container className="bg-secondary text-white">
                    <Badge variant="dark" className="room-centered">
                        <h1>CreamCat</h1>
                    </Badge>
                    <h1 className="centered">Create Room</h1>
                    <div className="create-room-page ">
                        <Form>
                            <Form.Group controlId="roomName">
                                <Form.Label>Room Name</Form.Label>
                                <Form.Control
                                    onInput={(e) =>
                                        setRoomNameInput(e.target.value)
                                    }
                                    placeholder="Enter room name"
                                />
                            </Form.Group>
                            <Form.Group controlId="roomDescription">
                                <Form.Label>Description (Optional)</Form.Label>
                                <Form.Control
                                    onInput={(e) =>
                                        setRoomDescInput(e.target.value)
                                    }
                                    placeholder="Enter description"
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password (Optional)</Form.Label>
                                <Form.Control
                                    onInput={(e) =>
                                        setPasswordInput(e.target.value)
                                    }
                                    placeholder="Enter password"
                                />
                            </Form.Group>
                            <Button
                                variant="dark"
                                type="button"
                                onClick={handleCreateRoom}
                                data-testid='create'
                            >
                                Create Room
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
