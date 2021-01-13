import React, { Component } from 'react'
import "./style-sheet/login.css"
import Axios from 'axios'
import env from 'dotenv'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from './header'

class Login extends Component {
    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
            message: "",
            enable: true
        }
    }

    handleText = event => {
        this.setState({ email: event.target.value })
    }
    handlePasswordText = (event) => {
        this.setState({ password: event.target.value })
    }

    validate = () => {
        let emailerror = '';
        let passworderror = '';
        if (!this.state.password) {
            passworderror = "password cannot be blank"
        }
        if (!this.state.email.includes("@")) {
            emailerror = 'Enter valid email'
        }
        if (emailerror || passworderror) {
            this.setState({ emailerror: emailerror, passworderror: passworderror })
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
            return Axios.post('http://d3e6edc66610.ngrok.io/api/v1/user/login', { data: { attributes: { email: this.state.email, password: this.state.password } } }).then((response) => {
                this.setState({ message: response.data.data.attributes.message })
                console.log(response.data.data.attributes.message)
                toast.success(this.state.message);
                localStorage.setItem('token', 'user');
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
                        <input type="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordText} /><br></br>
                        <button type="button" className="btn btn-primary btn-lg " id="load1" data-loading-text="<i className='fa fa-circle-o-notch fa-spin'></i> Processing Order" onClick={this.loginSumbit}>Login</button>
                    </div>

                </div>
                < ToastContainer
                    position="bottom-right"
                    autoClose={3000} />

            </div>
        )
    }
}

export default Login
