import React, { Component } from 'react'
import "./style-sheet/user.css"
import Axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import history from '../history';
class user extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            email: '',
            phone: '',
            gender: 'Male',
            nameError: '',
            emailError: '',
            phoneError: '',
            message: '',
            searchName: "",
            pagenation: false,
            notSearch: false,
        }
    }
    validate = () => {
        console.log(this.state.phone.length)
        let nameError = '', emailError = '', phoneError = '';
        if (this.state.name === '') {
            nameError = "Name cannot be blank"
        }
        if (this.state.email.indexOf('@') < 0) {
            emailError = "Enter vaild email"
        }
        if (this.state.phone.length <= 9) {
            phoneError = "Phone number allow 10 character"
        }
        if (nameError || emailError || phoneError) {
            this.setState({ nameError: nameError, emailError: emailError, phoneError: phoneError });
            return false
        }
        return true
    }
    handleText = event => {
        this.setState({ name: event.target.value })
    }
    handleEmailText = (event) => {
        this.setState({ email: event.target.value })
    }
    handlePhoneText = (event) => {
        this.setState({ phone: event.target.value })
    }
    handleSelection = (event) => {
        this.setState({ gender: event.target.value })
    }
    handleSearch = (event) => {
        this.setState({ searchName: event.target.value })
    }

    viewUser = () => {
        history.push('/view-users')
    }

    addUserSumbit = (event) => {
        const isValid = this.validate();
        if (isValid) {
            let data = Object.assign({
                data: {
                    attributes: {
                        name: this.state.name,
                        email: this.state.email,
                        mobile: this.state.phone,
                        gender: this.state.gender
                    }
                }
            })
            return Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user`, data).then((response) => {
                this.setState({ message: response.data.data.attributes.message, pagenation: true })
                toast.success(this.state.message);
            }).catch((err) => {
                this.setState({ message: err.response.data.data.attributes.message })
                return toast.error(this.state.message);

            });
        }
        event.preventDefault()
    }
    searchSumbit = () => {
        this.setState({ notSearch: true })
    }
    render() {
        console.log(this.state.notSearch)
        return (
            <div>
                <div className="user-form">
                    <h3>Add User</h3>
                    <div className="row">
                        <div className="col">
                            <div className="form-outline">
                                <label className="form-label" >Full Name *</label>
                                <input type="text" id="form8Example1" className="form-control" onChange={this.handleText} />
                                {this.state.nameError && (<div style={{ "color": "red", "fontSize": "12px" }}>
                                    {this.state.nameError}
                                </div>)}
                            </div>
                        </div>
                        <div className="col">

                            <div className="form-outline">
                                <label className="form-label">Email Address *</label>
                                <input type="email" id="form8Example2" className="form-control" onChange={this.handleEmailText} />
                                {this.state.emailError && (<div style={{ "color": "red", "fontSize": "12px" }}>
                                    {this.state.emailError}
                                </div>)}
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col">

                            <div className="form-outline">
                                <label className="form-label">Phone Number *</label>
                                <input type="text" id="form8Example3" className="form-control" onChange={this.handlePhoneText} />
                                {this.state.phoneError && (<div style={{ "color": "red", "fontSize": "12px" }}>
                                    {this.state.phoneError}
                                </div>)}
                            </div>
                        </div>
                        <div className="col">

                            <div className="form-outline">
                                <label className="form-label">Gender *</label>
                                <select className="form-control" value={this.state.gender} onChange={this.handleSelection}>
                                    <option>Male</option>
                                    <option> Female </option>
                                    <option> Transgender </option>
                                </select>

                            </div>
                        </div>
                    </div>
                    <div className="divide-button">
                        <button className="btn  add-user-button" onClick={this.addUserSumbit}>Add</button>
                        <button className="btn  add-user-button" onClick={this.viewUser}>View User</button>
                    </div>
                </div>
                {/* <div className="seprate-line">
                </div>
                <div className="user-list">
                    <h3>User Lists</h3>
                    <div className="search-box">
                        <input type="text" className="form-control search-text-controll" placeholder="Enter name..." onChange={this.handleSearch} />
                        <input type="submit" id="form8Example3" className="form-control search-button-controll" value="Search" onClick={this.searchSumbit} />
                    </div>
                </div> */}

                < ToastContainer
                    position="top-right"
                    autoClose={3000} />
                {/* {!this.state.notSearch && (<Pagenation callChild={this.state.pagenation} />)}
                {this.state.notSearch && (<SearchPagenation searchName={this.state.searchName} />)} */}

            </div>
        )
    }
}

export default user
