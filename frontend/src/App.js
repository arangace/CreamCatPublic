import axios from 'axios';
import { useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { AppContext } from "./AppContextProvider";
import CreateRoomPage from "./components/CreateRoom";
import HomePage from "./components/HomePage";
import JoinRoomPage from "./components/JoinRoom";
import NavBar from "./components/Navbar";
import Room from "./components/Room";
import RoomPage from "./components/RoomPage";

function App() {

    const { setCurrentRoom } = useContext(AppContext);

    //Check if the pre-joined room still exist, if not, leave the room
    async function checkRoomExist() {
        const localStorageCurrentRoom = JSON.parse(localStorage.getItem("currentRoom"));
        if (localStorageCurrentRoom) {
            const response = await axios.post(
                "http://localhost:3000/api/room/join/",
                localStorageCurrentRoom
            );
            if (!response.data.name) {
                localStorage.removeItem("currentRoom");
                setCurrentRoom("");
            }
        }
    }
    checkRoomExist();


    return (
        <div>
            <div>
                <NavBar></NavBar>
            </div>
            <Switch>
                <Route path="/Home">
                    <HomePage />
                </Route>
                <Route path="/Features"></Route>
                <Route path="/RoomPage">
                    <RoomPage />
                </Route>
                <Route path="/CreateRoom">
                    <CreateRoomPage />
                </Route>
                <Route path="/Room">
                    <Room />
                </Route>
                <Route path="/JoinRoom">
                    <JoinRoomPage />
                </Route>
                <Route path="*">
                    <Redirect to="/Home" />
                </Route>
            </Switch>
        </div>
    );
}

export default App;
