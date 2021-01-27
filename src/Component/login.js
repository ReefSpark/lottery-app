import React, { Component } from 'react'
import "./style-sheet/login.css"
import Axios from 'axios'
import env from 'dotenv'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import history from '../history';

class Login extends Component {
    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
            message: "",
            emailError: '',
            passwordError: '',
            enable: true,
            disable: false
        }
    }

    handleText = event => {
        this.setState({ email: event.target.value })
    }
    handlePasswordText = (event) => {
        this.setState({ password: event.target.value })
    }

    validate = () => {
        let emailError = '';
        let passwordError = '';
        if (this.state.password === '') {
            passwordError = "Name cannot be blank"
        }
        if (this.state.email.indexOf('@') < 0) {
            emailError = "Enter vaild email"
        }
        if (emailError || passwordError) {
            this.setState({ emailError: emailError, passwordError: passwordError })
            return false
        }
        return true
    }

    loginSumbit = (event) => {
        this.getReponse()
        event.preventDefault()
    }

    async getReponse() {
        const isValid = this.validate();
        if (isValid) {
            return Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user/login`, { data: { attributes: { email: this.state.email, password: this.state.password } } }).then((response) => {
                this.setState({ message: response.data.data.attributes.message })
                //localStorage.setItem('token', this.state.email);
                toast.success(this.state.message);
                //history.push('/dashobard')

            }).catch((err) => {
                this.setState({ message: err.response.data.data.attributes.message })
                return toast.error(this.state.message);

            });
        }


    }


    render() {
        return (
            <div>
                <div className="login-phase">
                    <div className="login-controll">
                        <input type="text" placeholder="Email" value={this.state.email} onChange={this.handleText} /><br></br>
                        {this.state.emailError && (<div style={{ "color": "red", "fontSize": "12px" }}>
                            {this.state.emailError}
                        </div>)}
                        <input type="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordText} /><br></br>
                        {this.state.passwordError && (<div style={{ "color": "red", "fontSize": "12px" }}>
                            {this.state.passwordError}
                        </div>)}
                        <button type="button" className="btn btn-primary btn-lg " id="load1" data-loading-text="<i className='fa fa-circle-o-notch fa-spin'></i> Processing Order" onClick={this.loginSumbit}>Login</button>
                    </div>

                </div>
                < ToastContainer
                    position="top-right"
                    autoClose={3000} />

            </div>
        )
    }
}

export default Login
