import React, { Component } from 'react'
import _ from 'lodash';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from 'axios'
import './style-sheet/manage-tickets.css'
class ManageTicket extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ticketName: '',
            price: 0,
            quantity: 1,
            ticketNumber: [],
            ticketNumberPrice: [],
            ticketNumberError: '',
            ticketNumberPriceError: '',
            ticketNameError: '',
            priceError: '',
            values: [{}],
            pagenation: true,

        }
        this.fieldsArray = [];
        this.inc = 0;
    }
    handleNameText = event => {
        this.setState({ ticketName: event.target.value, quantity: 0 })
    }
    handlePriceText = event => {
        this.setState({ price: event.target.value, quantity: 0 })
    }   
    handleText = (i, event) => {
        this.state.ticketNumber[i] = event.target.value.toUpperCase()
        this.setState({ ticketNumber: this.state.ticketNumber, quantity: 0 })
    }

    handleTicketNumberPrice = (i, event) => {
        this.state.ticketNumberPrice[i] = event.target.value.toUpperCase()
        this.setState({ ticketNumberPrice: this.state.ticketNumberPrice, quantity: 0 })
    }    
    validate = () => {
        let ticketNumberError = '', ticketNumberPriceError = '', ticketNameError = '', priceError = ''

        if (this.state.ticketName === '') {
            ticketNameError = "Ticket name cannot be blank"
        }
        if (this.state.price === 0) {
            priceError = "Price cannot be blank"
        }
        if (ticketNameError || priceError) {
            this.setState({ ticketNumberError: ticketNumberError, ticketNumberPriceError: ticketNumberPriceError, ticketNameError: ticketNameError, priceError: priceError });
            return false
        }
        return true
    }
    purchaseSumbit = () => {
        this.setState({ quantity: 0 })
        const isValid = this.validate();
        if (this.inc == 0) {
            toast.error("Please Add Ticket Combination");
        }
        if (isValid) {

            let i = 0;
            let ticketNumberCount = this.state.ticketNumber
            let ticketNumberPriceCount = this.state.ticketNumberPrice
            while (i < ticketNumberCount.length) {
                this.state.values[i] = {
                    combination: ticketNumberCount[i].toUpperCase(),
                    prize: Number(ticketNumberPriceCount[i]),
                }
                this.setState({ values: this.state.values })
                i++
            }
            let data = Object.assign({
                data: {
                    attributes: [
                        { name: this.state.ticketName.toUpperCase(), price: Number(this.state.price) },
                        this.state.values]

                }
            });
            return Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/master`, data).then((response) => {
                if (response.status === 200)
                    this.setState({ message: response.data.data.attributes.message, pagenation: false })
                toast.success(this.state.message);
            }).catch((err) => {
                if (err.response.status === 400) {
                    this.setState({ message: err.response.data.data.attributes.message })
                    return toast.error(this.state.message);
                }
            });
        }
    }
    loopTextFields(count) {
        for (let i = 0; i < count; i++) {
            this.fieldsArray.push(               
                <div className="loop-array" >
                    <input type="text" id="form8Example1" className="form-control" style={{ marginTop: "1.5%", marginRight: "2%" }} onChange={this.handleText.bind(this, this.inc)} />
                    {this.state.ticketNumberError && (<div style={{ "color": "red", "fontSize": "12px" }}>
                        {this.state.ticketNumberError}
                    </div>)}
                    <input type="text" id="form8Example2" className="form-control"  style={{ marginTop: "1.5%", marginRight: "2%" }} onChange={this.handleTicketNumberPrice.bind(this, this.inc)} />
                    {this.state.ticketNumberPriceError && (<div style={{ "color": "red", "fontSize": "12px" }}>
                        {this.state.ticketNumberPriceError}
                    </div>)}
                    <button className="btn  user-button" style={{ marginTop: "1.5%", marginRight: "2%" }} onClick={this.removeSumbit}>Remove </button>
                </div>
            );
            this.inc++;
        }
    }

    render() {
        return (
            <div>
                <h3 style={{ "marginTop": "3%" }}>Add Ticket Name</h3>
                <div className="user-form">
                    <div className="row">
                        <div className="col">
                            <div className="form-outline">
                                <label className="form-label" >Ticket Name *</label>
                                <input type="text" id="form8Example1" className="form-control" onChange={this.handleNameText} />
                                {this.state.ticketNameError && (<div style={{ "color": "red", "fontSize": "12px" }}>
                                    {this.state.ticketNameError}
                                </div>)}
                            </div>
                        </div>
                        <div className="col">

                            <div className="form-outline">
                                <label className="form-label">Price *</label>
                                <input type="email" id="form8Example2" className="form-control" onChange={this.handlePriceText} />
                                {this.state.priceError && (<div style={{ "color": "red", "fontSize": "12px" }}>
                                    {this.state.priceError}
                                </div>)}
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className="button-ticket">
                        <button style={{ marginTop: "1.5%", marginRight: "2%" }} className="btn  add-user-button" onClick={this.purchaseSumbit}>Add Ticket Name</button>
                        <button style={{ marginTop: "1.5%", marginRight: "2%" }} className="btn  add-user-button" onClick={this.viewTicket}>View Ticket</button>
                        <button style={{ marginTop: "1.5%", marginRight: "2%" }} className="btn  add-user-button" onClick={this.addItem}>Add Action</button>
                        <button style={{ marginTop: "1.5%", marginRight: "2%" }} className="btn  add-user-button" onClick={this.removeSumbit}>Remove Action</button>
                    </div>
                    < ToastContainer
                        position="top-right"
                        autoClose={3000} />
                    <div className="seprate-line">
                    </div>
                    <br></br>
                </div>
            </div>
        )
    }
}
export default ManageTicket