import { Button, Card } from "react-bootstrap";
export default function Body() {
    return (
        <>
            <div className="body">
                <Card className="bg-secondary text-white">
                    <div className="image-sizing">
                        <Card.Title>
                            <h1 className="body-text">
                                The best collaborative music web application out
                                there!
                            </h1>
                        </Card.Title>
                        <Card.Text className="centered">
                            Extensive library to search for any song and listen
                            together with your friends!
                        </Card.Text>
                        <Card.Text className="landing-page-route centered">
                            <Button
                                variant="dark"
                                block="true"
                                size="lg"
                                href="RoomPage"
                            >
                                Start
                            </Button>
                        </Card.Text>
                    </div>
                </Card>
            </div>
        </>
    );
}
