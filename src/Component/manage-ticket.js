import React, { Component } from 'react'
import _ from 'lodash';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from 'axios'
import './style-sheet/manage-tickets.css'
import Pagenation from './tablePagation/manageTicketPagenation'

class ManageTicket extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ticketName: '',
            price: 0,
            quantity: 0,
            ticketNumber: [],
            ticketNumberPrice: [],
            ticketNumberError: '',
            ticketNumberPriceError: '',
            ticketNameError: '',
            priceError: '',
            values: [{}],
            pagenation:true
        }
    }
    handleNameText = event => {
        this.setState({ ticketName: event.target.value })
    }
    handlePriceText = event => {
        this.setState({ price: event.target.value })
    }
    handleQuantitySelection = event => {

        this.setState({ quantity: event.target.value })
    }
    handleText = (i, event) => {
        this.state.ticketNumber[i] = event.target.value.toUpperCase()
        this.setState({ ticketNumber: this.state.ticketNumber })
    }

    handleTicketNumberPrice = (i, event) => {
        this.state.ticketNumberPrice[i] = event.target.value.toUpperCase()
        this.setState({ ticketNumberPrice: this.state.ticketNumberPrice })
    }
    removeSumbit = () => {
        let count = this.state.quantity;
        this.setState({ quantity: --count })
    }
    // componentWillUpdate(){
    //     this.setState({quantity:0})
    // }
    validate = () => {
        let ticketNumberError = '', ticketNumberPriceError = '', ticketNameError = '', priceError = ''
        if (this.state.ticketNumber.length === 0) {
            ticketNumberError = "Ticket Number cannot be blank"
        }
        if (this.state.ticketNumberPrice.length === 0) {
            ticketNumberPriceError = " Price cannot be blank"
        }
        if (this.state.ticketName === '') {
            ticketNameError = "Ticket name cannot be blank"
        }
        if (this.state.price === 0) {
            priceError = "Price cannot be blank"
        }
        if (ticketNumberError || ticketNumberPriceError || ticketNameError || priceError) {
            this.setState({ ticketNumberError: ticketNumberError, ticketNumberPriceError: ticketNumberPriceError, ticketNameError: ticketNameError, priceError: priceError });
            return false
        }
        return true
    }
    
    purchaseSumbit = () => {
        const isValid = this.validate();
        console.log(isValid)
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
                        {name:this.state.ticketName.toUpperCase(), price:Number(this.state.price)},
                        this.state.values]

                }
            })
            return Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/master`, data).then((response) => {
                if (response.status === 200)
                    this.setState({ message: response.data.data.attributes.message,pagenation:false })
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
        let count = this.state.quantity;
        for (let i = 0; i <= count; i++) {
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
                    <div className="col">
                        <div className="form-outline">
                            <input type="email" id="form8Example2" className="form-control" onChange={this.handleTicketNumberPrice.bind(this, i)} />
                            {this.state.ticketNumberPriceError && (<div style={{ "color": "red", "fontSize": "12px" }}>
                                {this.state.ticketNumberPriceError}
                            </div>)}
                        </div>
                    </div>
                </div>

            );

        }
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
                        <div className="col">
                            <label className="form-label"> Ticket Number Quantity*</label>
                            <select className="form-control" onChange={this.handleQuantitySelection}>
                                {_.range(1, 25).map(value => <option key={value} value={value}>{value}</option>)}
                            </select>

                        </div>
                    </div>
                    <br></br>

                    <div className="purchase-ticket-form">
                        <div className="row">
                            <div className="col">
                                <label className="form-label" >Ticket Number *</label>
                            </div>

                            <div className="col">
                                <label className="form-label" >Prize *</label>
                            </div>

                        </div>
                        {fieldsArray}
                    </div>
                    <div className="button-ticket">
                        <button className="btn  add-user-button" onClick={this.purchaseSumbit}>Add</button>
                        <button className="btn  add-user-button" onClick={this.removeSumbit}>Remove Action</button>
                    </div>
                    < ToastContainer
                        position="bottom-right"
                        autoClose={3000} />
                    <div className="seprate-line">
                    </div>
                    <br></br>
                    <h4>Ticket Master List</h4>
                    <Pagenation callChild={this.state.pagenation} />

                </div>
            </div>
        )
    }
}
export default ManageTicket