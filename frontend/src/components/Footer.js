import styles from "./styles.css";
import { Button, Card, CardGroup } from "react-bootstrap";

export default function Footer() {
    return (
        <>
            <div className="footer">
                <CardGroup>
                    <Card bg="dark" text="white">
                        <Card.Body>
                            <Card.Title>About</Card.Title>
                            <Card.Text>
                                This project is the culmination of the work done
                                by team CreamCat for SOFTENG750/COMPSCI732 at
                                the University of Auckland consisting of four
                                members
                                <br />
                                The application is developed using a MERN stack
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card bg="dark" text="white">
                        <Card.Body>
                            <Card.Title>Support</Card.Title>
                            <Card.Text>
                                Questions, issues or bugs should be referenced
                                towards the github link provided.
                                <br />
                                <a href="https://github.com/arangace/CreamCat">
                                    https://github.com/arangace/CreamCat
                                </a>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card bg="dark" text="white">
                        <Card.Body>
                            <Card.Title>Useful links</Card.Title>
                            <Card.Text>
                                Useful links from team CreamCat:
                                <Button variant="outline-dark">
                                    <a href="https://github.com/arangace/CreamCat">
                                        <img
                                            width="40px"
                                            height="40px"
                                            alt="No icon provided"
                                            src="https://icons-for-free.com/iconfiles/png/512/part+1+github-1320568339880199515.png"
                                        ></img>
                                    </a>
                                </Button>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </CardGroup>
                <Card.Footer>
                    <small className="text-muted">
                        Content created by team CreamCat
                    </small>
                </Card.Footer>
            </div>
        </>
    );
}
