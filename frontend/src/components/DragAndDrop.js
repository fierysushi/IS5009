import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import './DragAndDrop.css'

class DragAndDrop extends Component {

    state = {
        'drag': false,
        'file': null
    }
    dropRef = React.createRef()
    hiddenFileInput = React.createRef();
    dragCounter = 0

    handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    handleDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter++
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({ drag: true })
        }
    }

    handleDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter--
        if (this.dragCounter === 0) {
            this.setState({ drag: false })
        }
    }

    handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({ drag: false })
        let files = e.dataTransfer.files
        if (files && files.length > 0) {
            // e.dataTransfer.clearData()
            this.dragCounter = 0
            this.props.handleFileUpload(files) 
        }
    }

    componentDidMount() {
        let div = this.dropRef.current
        div.addEventListener('dragenter', this.handleDragIn)
        div.addEventListener('dragleave', this.handleDragOut)
        div.addEventListener('dragover', this.handleDrag)
        div.addEventListener('drop', this.handleDrop)
    }

    componentWillUnmount() {
        let div = this.dropRef.current
        div.removeEventListener('dragenter', this.handleDragIn)
        div.removeEventListener('dragleave', this.handleDragOut)
        div.removeEventListener('dragover', this.handleDrag)
        div.removeEventListener('drop', this.handleDrop)
    }

    renderFileDraggingOverlay() {
        if (this.state.drag) {
            return (
                <div variant='info' className='file-dragging-overlay'>
                    <h1>Drop file anywhere</h1>
                    (1 file only)
                </div>
            )
        }
    }

    handleClick = () => { this.hiddenFileInput.current.click() }

    onFileChange = (e) => {
        // console.log('onFileChange')
        // console.log(e.target.files)
        let files = e.target.files
        console.log(files)
        this.setState({
            'files': files
        })
        // Pass file to parent to handle
        this.props.handleFileUpload(files)
    }

    render() {
        return (
            <Container ref={this.dropRef} className='d-flex justify-content-center align-items-center drop-box'>
                {this.renderFileDraggingOverlay()}
                <Row>
                    <Col>
                        <Button onClick={this.handleClick}>Upload File</Button>
                        <p>or drop it here</p>
                        <input ref={this.hiddenFileInput} type='file' onChange={this.onFileChange} hidden></input>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default DragAndDrop