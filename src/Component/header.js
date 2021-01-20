import React from 'react'
import "./style-sheet/header.css"
import userIamge from './Images/user.png'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import history from '../history';
import User from "../Component/user"
import PurchaseTicket from "../Component/purchase-ticket"
import DashBoard from '../Component/Dasdboard'
import ManageTickes from './manage-ticket'


export default function header() {
    
    const logout = () => {        
        history.push('/')
    }

    return (
        <Router>
            <div>
                <div className="main">
                    <div className="first">
                        <ul>
                            <li>
                                <Link to="/dashboard" style={{ color: "white" }}>DashBoard</Link>
                            </li>
                            <li>
                                <Link to="/manage-tickets"  style={{ color: "white" }} >Manage Tickets</Link>
                            </li>
                            <li>
                                <Link to="/users" style={{ color: "white" }}> Manage Users</Link>
                            </li>
                            <li>
                                <Link to="/purchase-ticket" style={{ color: "white" }}>Purchase Ticket</Link>
                            </li>
                           
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <li>
                                <img className="imageUser" src={userIamge} alt="user" />
                                jebasingh1995@yahoo.com
                            </li>
                            <li>
                                <Link onClick={()=>logout()} style={{ color: "white" }}>Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <Switch>
                   
                    <Route path="/users">
                        <User />
                    </Route>

                    <Route path="/purchase-ticket">
                        <PurchaseTicket />
                    </Route>

                    <Route path="/manage-tickets">
                        <ManageTickes />
                    </Route>

                    <Route path="/logout">
                    </Route>

                    <Route path="/dashboard">
                        <DashBoard />
                    </Route>


                  
                </Switch>
            </div>
        </Router>
    )
}
