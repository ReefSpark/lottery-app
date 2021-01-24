import React, { Component } from 'react';
import './style-sheet/purchase-ticket.css'
import _ from 'lodash';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from 'axios'

class PurchaseTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userNames: [],
            ticketNames: [],
            userName: "",
            ticketName: '',
            quantity: 1,
            showTime: '11:00',
            actualPrice: 0,
            ticketNumber: [],
            sellingPrice: [],
            ticketNumberError: '',
            sellingPriceError: '',
            message: '',
            values: [{}]
        }
        this.fieldsArray = [];
        this.inc = 0;
    }
    validate = () => {
        let ticketNumberError = '', sellingPriceError = ''
        if (this.state.ticketNumber.length === 0) {
            ticketNumberError = "Ticket Number cannot be blank"
        }
        if (this.state.sellingPrice.length === 0) {
            sellingPriceError = "Selling Price cannot be blank"
        }
        if (ticketNumberError || sellingPriceError) {
            this.setState({ ticketNumberError: ticketNumberError, sellingPriceError: sellingPriceError });
            return false
        }
        return true
    }
    componentDidMount() {

        Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user`).then((response) => {
            this.setState({ userNames: response.data.data.attributes.data, userName: response.data.data.attributes.data[0]._id})

        }).catch((err) => {
        });
        Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/master`).then((response) => {
            this.setState({ ticketNames: response.data.data.attributes.data, actualPrice: response.data.data.attributes.data[0].price, ticketName: response.data.data.attributes.data[0]._id })
            this.loopTicketFunction(1)
        }).catch((err) => {
        });
    }
    // componentDidUpdate() {
    //     this.setState({ quantity: 0 })
    // }

    handleUserNameSelection = event => {
        this.setState({ userName: event.target.value, quantity: 0 })
    }
    handleTicketSelection = event => {
        let i = 0;
        let ticketIndex = this.state.ticketNames;
        while (i < ticketIndex.length) {
            if (ticketIndex[i]._id === event.target.value) {
                this.setState({ ticketName: event.target.value, actualPrice: ticketIndex[i].price })
            }
            i++;
        }
        this.setState({ quantity: 0 })
    }
    handleQuantitySelection = event => {
        this.setState({ quantity: event.target.value })
        this.loopTicketFunction(event.target.value);
        event.target.value=0;
    }
    handleShowTimeSelection = event => {
        this.setState({ showTime: event.target.value, quantity: 0 })
    }
    handleText = (i, event) => {
        this.state.ticketNumber[i] = event.target.value.toUpperCase()
        this.setState({ ticketNumber: this.state.ticketNumber, quantity: 0 })
    }

    handleSellingPrice = (i, event) => {
        this.state.sellingPrice[i] = event.target.value.toUpperCase()
        this.setState({ sellingPrice: this.state.sellingPrice, quantity: 0 })
    }

    removeSumbit = () => {
        this.fieldsArray.splice(this.fieldsArray.length - 1, 1)
        this.setState({ quantity: 0 })
    }
    purchaseSumbit = () => {
        this.setState({ quantity: 0 })
        const isValid = this.validate();
        if (isValid) {
            let i = 0;
            let ticketNumberCount = this.state.ticketNumber
            let sellingPriceCount = this.state.sellingPrice
            while (i < ticketNumberCount.length) {
                this.state.values[i] = {
                    user_id: this.state.userName,
                    ticket_master_id: this.state.ticketName,
                    actual_price: this.state.actualPrice,
                    ticket_number: ticketNumberCount[i],
                    show_time: this.state.showTime,
                    sell_price: sellingPriceCount[i],
                    date: new Date()
                }
                this.setState({ values: this.state.values })
                i++
            }
            let data = Object.assign({
                data: {
                    attributes: this.state.values
                }
            })
            return Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/purchase/${this.state.userName}`, data).then((response) => {
                if (response.status === 200)
                    this.setState({ message: response.data.data.attributes.message })
                toast.success(this.state.message);
            }).catch((err) => {
                if (err.response.status === 400) {
                    this.setState({ message: err.response.data.data.attributes.message })
                    return toast.error(this.state.message);
                }
            });
        }
    }

    loopTicketFunction(count){

        for (let i = 0; i < count; i++) {
            this.fieldsArray.push(
                <div className="row loop-array">
                    <div className="col">
                        <div className="form-outline">
                            <input type="text" id="form8Example1" className="form-control" onChange={this.handleText.bind(this, this.inc)} />
                            {this.state.ticketNumberError && (<div style={{ "color": "red", "fontSize": "12px" }}>
                                {this.state.ticketNumberError}
                            </div>)}
                        </div>
                    </div>

                    <div className="form-outline">
                        <select className="form-control">
                            <option value={this.state.actualPrice}>{this.state.actualPrice}</option>
                        </select>

                    </div>
                    <div className="col">
                        <div className="form-outline">
                            <input type="email" id="form8Example2" className="form-control" onChange={this.handleSellingPrice.bind(this, this.inc)} />
                            {this.state.sellingPriceError && (<div style={{ "color": "red", "fontSize": "12px" }}>
                                {this.state.sellingPriceError}
                            </div>)}
                        </div>
                    </div>
                </div>

            );
            this.inc++;
        }
    }

    render() {
       
        return (
            <div>
                <h1 style={{ "marginTop": "3%" }}>Purchase Ticket</h1>
                <div className="ticket-form">
                    <div className="form-outline">
                        <label className="form-label">Username *</label>
                        <select className="form-controls " onChange={this.handleUserNameSelection}>
                            {this.state.userNames.map((value, index) => <option key={index} value={value._id}>{value.name}</option>)}
                        </select>

                    </div>
                    <div className="form-outline">
                        <label className="form-label">Ticket Name *</label>
                        <select className="form-controls" id="dropDownMenu" onChange={this.handleTicketSelection}>
                            {this.state.ticketNames.map((value, index) => <option key={index} value={value._id} name="hello">{value.name}</option>)}
                        </select>

                    </div>
                    <div className="form-outline">
                        <label className="form-label">Quantity *</label>
                        <select className="form-controls " onChange={this.handleQuantitySelection}>
                            {_.range(1, 50).map(value => <option key={value} value={value}>{value}</option>)}
                        </select>

                    </div>
                    <div className="form-outline">
                        <label className="form-label">Show Time *</label>
                        <select className="form-controls" value={this.state.showTime} onChange={this.handleShowTimeSelection}>
                            <option> 11:00 AM</option>
                            <option> 02:00 AM</option>
                            <option> 05:00 PM</option>
                            <option> 08:00 PM </option>
                        </select>

                    </div>
                </div>
                <br></br>
                <div className="seprate-line">
                </div>
                <div className="purchase-ticket-form">
                    <div className="row">
                        <div className="col">
                            <label className="form-label" >Ticket Number *</label>
                        </div>
                        <div className="col">
                            <label className="form-label" >Actual Price *</label>
                        </div>
                        <div className="col">
                            <label className="form-label" >Selling Price *</label>
                        </div>

                    </div>
                    <div>
                        {this.fieldsArray}
                    </div>

                </div>
                <div className="button-ticket">
                    <button className="btn  add-user-button" onClick={this.purchaseSumbit}>Purchase</button>
                    <button className="btn  add-user-button" onClick={this.removeSumbit}>Remove Action</button>
                </div>
                < ToastContainer
                    position="top-right"
                    autoClose={3000} />
            </div>
        )
    }
}

export default PurchaseTicket
