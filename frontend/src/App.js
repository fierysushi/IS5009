import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

import TopNavbar from './components/TopNavbar'
import DragAndDrop from './components/DragAndDrop'

import { cloneDeep } from "lodash";
import './App.css'

class App extends Component {

    constructor() {
        super()
        this.state = {
            // Initially, no file is selected 
            "selectedFile": null,
            "results": null,
            "uploadButtonDisabled": true
        }
    }

    // On file select (from the pop up) 
    onFileChange = (event) => {

        // Update the state 
        this.setState({
            "selectedFile": event.target.files[0],
            "uploadButtonDisabled": false
        })

    }

    // On file upload (click the upload button) 
    onFileUpload = () => {

        // Create an object of formData 
        const formData = new FormData();

        // Update the formData object 
        formData.append('data', this.state.selectedFile)

        // Details of the uploaded file 
        console.log(this.state.selectedFile);
        console.log(formData)

        fetch('http://localhost:5000/calculate', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                console.log('Success:', data)
                console.log(this.state)

                let newState = cloneDeep(this.state)
                newState['results'] = data
                this.setState(newState)
                // this.setState({
                //     "results": data
                // })
                console.log(this.state)
            })
            .catch(err => {
                console.log('Error:', err)
            })
    };

    // File content to be displayed after 
    // file upload is complete 
    renderFileData = () => {

        if (this.state.selectedFile) {

            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {this.state.selectedFile.name}</p>
                    <p>File Type: {this.state.selectedFile.type}</p>
                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>
                </div>
            )
        }
    }

    handleFileUpload = (files) => {
        console.log(files)
        console.log(files[0])

        this.setState({
            'selectedFile': files[0],
            "uploadButtonDisabled": false
        }, () => this.onFileUpload())
    }

    renderPage() {
        if (this.state['results']) {
            let formatter = Intl.NumberFormat('en-US', {
                'style': 'currency',
                'currency': 'USD'
            })
            return (
                <>
                    <Row>
                        <Col>
                            <Card className='px-4 pt-4 mb-3 mx-auto' style={{ width: '18rem', height: '22rem' }}>
                                <Card.Img className='rounded' variant="top" src="images/ocbc365.png" rounded={true} />
                                <Card.Body>
                                    <Card.Title>OCBC 365</Card.Title>
                                    <Card.Text>Your calculated cashback is {formatter.format(this.state['results']['data']['ocbc'])}</Card.Text>
                                    <Button variant="success">Learn more</Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col>
                            <Card className='px-4 pt-4 mb-3 mx-auto' style={{ width: '18rem', height: '22rem' }}>
                                <Card.Img className='rounded' variant="top" src="images/citi.png" />
                                <Card.Body>
                                    <Card.Title>Citi Cash Back</Card.Title>
                                    <Card.Text>Your calculated cashback is {formatter.format(this.state['results']['data']['citi'])}</Card.Text>
                                    <Button variant="success">Learn more</Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col>
                            <Card className='px-4 pt-4 mb-3 mx-auto' style={{ width: '18rem', height: '22rem' }}>
                                <Card.Img className='rounded' variant="top" src="images/boc.jpg" roundedCircle={true} />
                                <Card.Body>
                                    <Card.Title>Bank of China Family</Card.Title>
                                    <Card.Text>Your calculated cashback is {formatter.format(this.state['results']['data']['bank of china'])}</Card.Text>
                                    <Button variant="success">Learn more</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className='p-5 justify-content-center'>
                        <Button variant="primary" onClick={this.handleUploadAgain}>Upload again</Button>
                    </Row>
                </>
            )
        }
        else {
            return (
                <DragAndDrop handleFileUpload={this.handleFileUpload} />
            )
        }
    }

    handleUploadAgain = () => {
        this.setState({
            "results": null,
        })
    }

    render() {

        return (
            <Container fluid="True">

                <TopNavbar />

                <Container className='p-3'>
                    {this.renderPage()}
                </Container>

            </Container>
        );
    }
}

export default App; 
