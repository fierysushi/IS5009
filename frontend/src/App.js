import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Jumbotron from 'react-bootstrap/Jumbotron';

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

    handleBack = () => {
        this.setState({
            'results': null
        })
    }

    renderPage() {
        if (this.state['results']) {
            return (
                <Jumbotron>
                    <h3>Your calculated cashback is:</h3>
                    <h1>{this.state['results']['data']}</h1>
                    <Button variant="primary" onClick={this.handleBack}>Submit again</Button>
                </Jumbotron>
            )
        }
        else {
            return (
                <DragAndDrop handleFileUpload={this.handleFileUpload} />
            )
        }
    }

    render() {

        return (
            <Container fluid="True">

                <TopNavbar />

                <Container className='p-3'>
                    {this.renderPage()}
                </Container>

                {/* <Container className='p-3'>

                    <DragAndDrop handleFileUpload={this.handleFileUpload} handleClick={this.handleFileUpload}></DragAndDrop>

                    <Row>
                        <Col>

                            {this.renderFileData()}

                            <Button
                                variant={this.state['uploadButtonDisabled'] ? "secondary" : "primary"}
                                onClick={this.onFileUpload}
                                disabled={this.state['uploadButtonDisabled']}>Upload
                             </Button>
                        </Col>

                    </Row>

                </Container> */}

            </Container>
        );
    }
}

export default App; 
