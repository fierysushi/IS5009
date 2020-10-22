import React from 'react';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import './TopNavbar.css';

import { cloneDeep } from "lodash";

class TopNavbar extends React.Component {

    constructor() {
        super()

        // Initial state begins on Data page (can change in future)
        this.state = {
            "Home": false,
            "Promos": false,
            "Calculate": true,
            "Leaderboard": false,
            "Premium": false
        }
    }

    handleClick = (e) => {

        var active_link = e.target.getAttribute("value")
        var new_state = cloneDeep(this.state)

        // Update current active link
        for (let key in new_state) {
            new_state[key] = false
        }
        new_state[active_link] = true

        // Update current state
        this.setState(new_state)

    }

    render() {

        const { Assets, Data, Expenses, Investments } = this.state

        return (
            <Navbar variant="dark" expand="sm" sticky="top">
                <Navbar.Brand>Adulthood</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {Object.keys(this.state).map((key) => {
                            return <Nav.Link key={key} value={key} active={this.state[key]} onClick={this.handleClick}>{key}</Nav.Link>
                        })}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default TopNavbar