import { Badge, Button, Card } from "react-bootstrap";

// buttons to link to pages createRoomPage and JoinRoomPage  
export default function RoomPage() {
    return (
        <>
            <div className="Room">
                <Card className="bg-secondary text-white">
                    <Badge variant="dark" className="room-centered">
                        <h1>CreamCat</h1>
                    </Badge>
                    <Card.Text className="landing-page-route">
                        <Button
                            className="centered"
                            variant="dark"
                            block="true"
                            size="lg"
                            href="JoinRoom"
                        >
                            Join Room
                        </Button>

                        <Button
                            className="centered"
                            variant="dark"
                            block="true"
                            size="lg"
                            href="CreateRoom"
                        >
                            Create Room
                        </Button>
                        <br />
                    </Card.Text>
                </Card>
            </div>
        </>
    );
}
