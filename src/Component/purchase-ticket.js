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
            quantity: 0,
            showTime: '11:00',
            actualPrice: 0,
            ticketNumber: [],
            sellingPrice: [],
            ticketNumberError: '',
            sellingPriceError: '',
            message: '',
            values: [{}]
        }

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

            this.setState({ userNames: response.data.data.attributes.data, userName: response.data.data.attributes.data[0]._id })

        }).catch((err) => {
        });
        Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/master`).then((response) => {
            this.setState({ ticketNames: response.data.data.attributes.data, actualPrice: response.data.data.attributes.data[0].price, ticketName: response.data.data.attributes.data[0]._id })
        }).catch((err) => {
        });
    }
    // componentDidUpdate() {
    //     this.setState({ quantity: 0 })
    // }

    handleUserNameSelection = event => {
        this.setState({ userName: event.target.value })
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
    }
    handleQuantitySelection = event => {
        this.setState({ quantity: event.target.value })
    }
    handleShowTimeSelection = event => {

        this.setState({ showTime: event.target.value })
    }
    handleText = (i, event) => {
        this.state.ticketNumber[i] = event.target.value.toUpperCase()
        this.setState({ ticketNumber: this.state.ticketNumber })
    }

    handleSellingPrice = (i, event) => {
        this.state.sellingPrice[i] = event.target.value.toUpperCase()
        this.setState({ sellingPrice: this.state.sellingPrice })
    }

    removeSumbit = () => {
        let count = this.state.quantity;
        this.setState({ quantity: --count })
    }
    purchaseSumbit = () => {
        const isValid = this.validate();
        console.log(isValid)
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

    render() {
        var fieldsArray = [];
        for (let i = 0; i <= this.state.quantity; i++) {
            fieldsArray.push(
                <div className="row loop-array">
                    <div className="col">
                        <div className="form-outline">
                            <input type="text" id="form8Example1" className="form-control" onChange={this.handleText.bind(this, i)} />
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
                            <input type="email" id="form8Example2" className="form-control" onChange={this.handleSellingPrice.bind(this, i)} />
                            {this.state.sellingPriceError && (<div style={{ "color": "red", "fontSize": "12px" }}>
                                {this.state.sellingPriceError}
                            </div>)}
                        </div>
                    </div>
                </div>

            );
        }
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
                            <option>11:00</option>
                            <option> 14:00</option>
                            <option> 17:00 </option>
                            <option> 20:00 </option>
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
                    {fieldsArray}
                </div>
                <div className="button-ticket">
                    <button className="btn  add-user-button" onClick={this.purchaseSumbit}>Purchase</button>
                    <button className="btn  add-user-button" onClick={this.removeSumbit}>Remove Action</button>
                </div>
                < ToastContainer
                    position="bottom-right"
                    autoClose={3000} />
            </div>
        )
    }
}

export default PurchaseTicket
