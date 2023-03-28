import React, { useContext } from "react";
import { Navbar, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaClipboard } from "react-icons/fa";
import { AppContext } from "../../AppContextProvider";
import SearchBar from "../SearchBar";
import styles from "./Header.module.css";

export default function Header() {
    const { currentRoom } = useContext(AppContext);
    function handleClick(RoomIDCopiedValue) {
        navigator.clipboard.writeText(RoomIDCopiedValue)
    }
    //Renders new navigation bar when inside the room for room functionalities.
    return (
        <>
            <div className={styles.navRoom}>

                <Navbar fixed="top" variant="dark" bg="dark" className={styles.navRoom}>
                    <Navbar.Brand >{currentRoom.name}</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <div className={styles.RoomIDCopy} onClick={() => (handleClick(currentRoom._id))}>
                            <OverlayTrigger placement="bottom" overlay={<Tooltip>Copy ID to clipboard</Tooltip>}>
                                <span className="d-inline-block">
                                    <Navbar.Text >Room ID: {currentRoom._id}
                                        <div className={styles.copyClipboard}>
                                            <FaClipboard />
                                        </div>
                                    </Navbar.Text>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </Navbar.Collapse>
                    <SearchBar />
                </Navbar>
            </div>
        </>
    );
}
