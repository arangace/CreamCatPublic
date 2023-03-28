import { useContext } from "react";
import { Nav } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { AppContext } from "../AppContextProvider";


export default function NavBar() {

    const { currentRoom, setCurrentRoom } = useContext(AppContext);

    //removes room from local storage
    function leaveRoom() {
        localStorage.removeItem("currentRoom");
        setCurrentRoom("");

    }

    return (
        <>
            <Navbar fixed="top" bg="dark" variant="dark">
                <Navbar.Brand href="/Home"><img src="/head-icon.jpg" height="20px" width="20px" alt=""></img>CreamCat</Navbar.Brand>
                <Nav className="mr-auto">
                    {!currentRoom && <Nav.Link href="JoinRoom">Join Room</Nav.Link>}
                    {!currentRoom && <Nav.Link href="CreateRoom">Create Room</Nav.Link>}
                    {currentRoom && <Nav.Link href="Room">{currentRoom.name}</Nav.Link>}
                    {currentRoom && <Nav.Link onClick={leaveRoom}>Leave Room</Nav.Link>}
                </Nav>
            </Navbar>
        </>
    );
}
