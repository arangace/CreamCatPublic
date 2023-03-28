import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Form, FormControl } from "react-bootstrap";
import Modal from 'react-modal';
import { AppContext } from '../AppContextProvider';
import './SearchBar.css';
import youtube from './youtubeSearch';


if (process.env.NODE_ENV !== 'test') {Modal.setAppElement('#root')};

export default function SearchBar() {
    const { currentRoom } = useContext(AppContext)

    const [searchQuery, setSearchQuery] = useState({
        search: ""
    });
    const [searchResults, setSearchResults] = useState([]);
    const [show, setShow] = useState(false);
    const [addedSongTitle, setAddedSongTitle] = useState();
    const [modalIsOpen, setIsOpen] = useState(false);

    //adds seached song to database
    const addSong = (e) => {
        setShow(true);
        const index = e.target.getAttribute("data-index")
        const songToAdd = {
            roomID: currentRoom._id,
            password: currentRoom.password,
            title: searchResults[index].snippet.title,
            content: "https://www.youtube.com/watch?v=" + searchResults[index].id.videoId
        }
        setAddedSongTitle((songToAdd.title));
        axios.post('http://localhost:3000/api/Playlist/add/', songToAdd)
    };

    //handles input into the form
    const handleChange = (e) => {
        const { id, value } = e.target;
        setSearchQuery((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

    //when the submit button is pressed, the function will search youtube 
    const handleSubmit = async (e) => {
        e.preventDefault()
        const term = searchQuery.search
        const response = await youtube.get('/search', {
            params: {
                q: term
            }
        })
        setSearchResults(response.data.items)
        openModal()
    }

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    //refactors song title so it converts all xml special characters e.g. &amp to &
    function removeSpecialChar(title) {
        return (
            title.replace(/&apos;/g, "'")
                .replace(/&quot;/g, '"')
                .replace(/&gt;/g, '>')
                .replace(/&lt;/g, '<')
                .replace(/&amp;/g, '&')
        )
    }

    useEffect(() => {
        const timeId = setTimeout(() => {
            // After 3 seconds set the show value to false
            setShow(false)
        }, 3000)
        return () => {
            clearTimeout(timeId)
        }
    }, [show]);

    return (
        <>
            <div className='addSongConfirmation'>
                <Alert show={show} variant="success">
                    <Alert.Heading>Song Added!  </Alert.Heading>
                    <p>{addedSongTitle}</p>
                </Alert>
            </div>
            <div>

                <Form inline onSubmit={handleSubmit}>
                    <FormControl
                        type="text"
                        id="search"
                        className="mr-sm-2"
                        value={searchQuery.term}
                        onChange={handleChange}
                        placeholder="Search"
                        data-testid="form"
                    />

                    <Button
                        variant="outline-light"
                        onClick={handleSubmit}
                        data-testid="searchButton"
                    >
                        Search
                    </Button>

                </Form>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    className="searchModal"
                    data-testid="modal"
                >
                    <button onClick={closeModal} className="close">X</button>
                    <div>
                        <br></br>
                        {searchResults.map((data, index) => (
                            <li key={index} className={"search-list-item"}>
                                <Button key={index} data-index={index} onClick={addSong} className="button" variant="outline-dark">Add Song</Button>
                                &emsp; {removeSpecialChar(data.snippet.title)}, https://www.youtube.com/watch?v={data.id.videoId}
                            </li>
                        )
                        )}
                    </div>
                </Modal>
            </div>
        </>
    )
}