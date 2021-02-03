import React, { Component } from 'react';
import './style-sheet/purchase-ticket.css'
import _ from 'lodash';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from 'axios'
import history from '../history';
import moment from 'moment-timezone';


class PurchaseTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userNames: [],
            ticketNames: [],
            userName: "",
            ticketName: '',
            quantity: 0,
            showTime: '11:00 AM',
            actualPrice: 0,
            ticketNumber: [],
            sellingPrice: [],
            ticketNumberError: '',
            sellingPriceError: '',
            message: '',
            values: [{}],
            buttonDisable: true
        }
        this.fieldsArray = [];
        this.inc = 0;
        this.today = moment().format('YYYY-MM-DD');
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

        Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/master`).then((response) => {
            this.setState({ ticketNames: response.data.data.attributes.data, actualPrice: response.data.data.attributes.data[0].price, ticketName: response.data.data.attributes.data[0]._id })
            //this.loopTicketFunction(1)
        }).catch((err) => {
        });
        Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user`).then((response) => {

            this.setState({ userNames: response.data.data.attributes.data, userName: response.data.data.attributes.data[0]._id })

        }).catch((err) => {
        });

    }
    // componentDidUpdate() {
    //     this.setState({})
    // }

    handleUserNameSelection = event => {

        this.setState({ userName: event.target.value, })
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
        this.loopTicketFunction(event.target.value);
    }
    handleShowTimeSelection = event => {
        this.setState({ showTime: event.target.value, })
    }
    handleText = (i, event) => {
        this.state.ticketNumber[i] = event.target.value.toUpperCase()
        this.setState({ ticketNumber: this.state.ticketNumber, })
    }

    handleSellingPrice = (i, event) => {
        // var regExp = new RegExp("/^\d+$/");
        // var strNumber = event.target.value;
        // var isValid = regExp.test(strNumber);
        // console.log(isValid)
        this.state.sellingPrice[i] = event.target.value;
        this.setState({ sellingPrice: this.state.sellingPrice, })
    }

    removeSumbit = () => {
        this.fieldsArray.splice(this.fieldsArray.length - 1, 1)
        this.setState({})
    }

    addItem = () => {
        this.setState({ quantity: 1 })
        this.loopTicketFunction(1);
    }

    purchasCalculation = () => {

        history.push({
            pathname: '/purchase-calculation',
            search: `?name=${this.state.userName}`
        })
    }
    purchaseSumbit = () => {
        const isValid = this.validate();
        if (this.inc == 0) {
            toast.error("Please Add Ticket Number");
        }
        let i = 0;
        // while (i < this.inc) {
        //     if()
        //     i++;
        // }
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
                    this.setState({ message: response.data.data.attributes.message, buttonDisable: false })
                toast.success(this.state.message);
            }).catch((err) => {
                if (err.response.status === 400) {
                    this.setState({ message: err.response.data.data.attributes.message })
                    return toast.error(this.state.message);
                }
            });
        }
    }

    loopTicketFunction(count) {

        for (let i = 0; i < count; i++) {
            this.fieldsArray.push(
                <div className="loop-array" >
                    <input type="text" style={{ marginTop: "1.5%", marginRight: "2%" }} id="form8Example1" className="form-control" onChange={this.handleText.bind(this, this.inc)} />
                    <select style={{ marginTop: "1.5%", marginRight: "2%" }} className="form-control">
                        <option value={this.state.actualPrice}>{this.state.actualPrice}</option>
                    </select>
                    <input type="email" style={{ marginTop: "1.5%", marginRight: "2%" }} id="form8Example2" className="form-control" onChange={this.handleSellingPrice.bind(this, this.inc)} />
                    <button className="btn  user-button" onClick={this.removeSumbit}>Remove </button>
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
                        <input type="text" id="form8Example1" className="form-control" onChange={this.handleQuantitySelection} />

                    </div>
                    <div className="form-outline">
                        <label className="form-label">Show Time *</label>
                        <select className="form-controls" value={this.state.showTime} onChange={this.handleShowTimeSelection}>
                            <option value="11:00 AM"> 11:00 AM</option>
                            <option value="02:00 PM"> 02:00 PM</option>
                            <option value="05:00 PM"> 05:00 PM</option>
                            <option value="08:00 PM"> 08:00 PM </option>
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
                    <button style={{ width: "10%" }} className="btn  add-user-button" onClick={this.addItem}>Add Item </button>
                    <button className="btn  add-user-button" onClick={this.purchaseSumbit}>Purchase</button>
                    <button className="btn  add-user-button" disabled={this.state.buttonDisable} onClick={this.purchasCalculation}>Purchase Calculation </button>
                </div>
                < ToastContainer
                    position="top-right"
                    autoClose={3000} />
            </div>
        )
    }
}

export default PurchaseTicket
