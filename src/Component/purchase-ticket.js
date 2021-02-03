import React, { Component } from 'react';
import './style-sheet/purchase-ticket.css'
import _ from 'lodash';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from 'axios'
import history from '../history';
import moment from 'moment-timezone';
import {Grid,Paper} from '@material-ui/core';
import CustomizedInputs from './Input/Input';

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
            buttonDisable: true,
            ticketArray:[]
        }
        this.fieldsArray = [];
        this.inc = 0;
        this.today = moment().format('YYYY-MM-DD');
    }
    validate = () => {    
            let i = 0;          
            let ticketNumberCount = this.state.ticketNumber.filter(function(e){return e});
            let sellingPriceCount = this.state.sellingPrice.filter(function(e){return e});
            console.log(ticketNumberCount)
            if(ticketNumberCount.length != this.fieldsArray.length || sellingPriceCount.length != this.fieldsArray.length){
                //toast.error("Please add ticket number");
                return false;
            }
            else{
                while (i < ticketNumberCount.length) {
                    console.log(ticketNumberCount[i], sellingPriceCount[i])
                    if(!ticketNumberCount[i]){
                        toast.error("Please add ticket number");
                        return false
                    }
                    if(!sellingPriceCount[i]){
                        toast.error("Please add selling price");
                        return false
                    }
                    else{
                        this.state.values[i] = {
                            user_id: this.state.userName,
                            ticket_master_id: this.state.ticketName._id ? this.state.ticketName._id : this.state.ticketName,
                            actual_price: this.state.actualPrice,
                            ticket_number: ticketNumberCount[i],
                            show_time: this.state.showTime,
                            sell_price: sellingPriceCount[i],
                            date: new Date()
                        }
                        console.log(this.state.ticketNames, this.state.ticketName)
                        console.log(this.state.ticketNames._id)
                        this.setState({ values: this.state.values })                    
                        i++
                    }                               
                }   
                return true
            }                        
        // let ticketNumberError = '', sellingPriceError = ''
        // if (this.state.ticketNumber.length === 0) {
        //     ticketNumberError = "Ticket Number cannot be blank"
        // }
        // if (this.state.sellingPrice.length === 0) {
        //     sellingPriceError = "Selling Price cannot be blank"
        // }
        // if (ticketNumberError || sellingPriceError) {
        //     this.setState({ ticketNumberError: ticketNumberError, sellingPriceError: sellingPriceError });
        //     return false
        // }
        // return true
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

    handleUserNameSelection = event => {
        this.setState({ userName: event.target.value, })
    }
    handleTicketSelection = event => {
        const ticket = this.state.ticketNames.filter(x => x._id == event.target.value)[0];         
        this.setState({ ticketName: ticket, actualPrice: ticket.price, quantity : 0 })            
        this.fieldsArray = [];
    }
    handleQuantitySelection = event => {
        this.setState({ quantity: event.target.value })
        this.fieldsArray = [];
        this.loopTicketFunction(event.target.value);
    }
    handleShowTimeSelection = event => {
        this.setState({ showTime: event.target.value, })
    }
    handleTicketNumber = (i, event) => {
        this.state.ticketNumber[i] = event.target.value.toUpperCase()
        this.setState({ ticketNumber: this.state.ticketNumber })
    }

    handleSellingPrice = (i, event) => {
        this.state.sellingPrice[i] = event.target.value;
        this.setState({ sellingPrice: this.state.sellingPrice })
    }

    removeSumbit = () => {
        this.fieldsArray.splice(this.fieldsArray.length - 1, 1)
        this.setState({})
    }

    addItem = () => {
        this.setState({ quantity: parseFloat(this.state.quantity) + 1 })
        this.loopTicketFunction(1, 'add');
    }

    purchasCalculation = () => {
        history.push({
            pathname: '/purchase-calculation',
            search: `?name=${this.state.userName}`
        })
    }
    purchaseSumbit = () => {
        const values = this.validate();
        if(!values){
            toast.error("Please fill all the required fields.");
        }      
        else{
        let data = Object.assign({
            data: {
                attributes: this.state.values
            }
        })
        return Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/purchase/${this.state.userName}`, data).then((response) => {
            if (response.status === 200)                    
                this.setState({ message: response.data.data.attributes.message, buttonDisable: false });
                this.fieldsArray = [];
                toast.success(this.state.message);                
        }).catch((err) => {
            if (err.response.status === 400) {
                this.setState({ message: err.response.data.data.attributes.message })
                return toast.error(this.state.message);
            }
        });
       }
    }

    loopTicketFunction(count, add) {
        if(!add){
            this.fieldsArray = [];
        }                
        let sno = this.fieldsArray.length;
        for (let i = 0; i < count; i++) {
            sno = parseFloat(sno+1)
            this.fieldsArray.push(
                <div className="ticket-form" style={{marginTop: (i == 0 && !add) ? '15px' : '0px'}}>                            
                    <div>     
                        <CustomizedInputs height={30} width={50} disabled={true} marginTop={0} value={sno} label="Serial Number"/>                    
                    </div>
                    <div>     
                        <CustomizedInputs height={30} marginTop={0} onChange={this.handleTicketNumber.bind(this, this.inc)} label="Ticket Number"/>                    
                    </div>
                    <div>     
                        <CustomizedInputs height={30} marginTop={0} disabled={true} value={this.state.actualPrice} label="Actual Price"/>
                    </div>
                    <div>     
                        <CustomizedInputs height={30} marginTop={0} onChange={this.handleSellingPrice.bind(this, this.inc)} label="Selling Price"/>
                    </div>
                    <div>
                        <button style={{width:'100%', height:'30px', fontSize:14}} className="btn  add-user-button" onClick={this.removeSumbit}> Remove </button>                       
                    </div>                                                 
                </div>
            );
            this.inc++;
        }
    }

    render() {
        return (
            <div>                
                <Grid style={{padding:5}} container direction="row" justify="center" alignItems="center">
                    <Grid item xs={11}>
                    <h4>Purchase Tickets</h4>
                        <Paper style={{border : '1px solid #cccccc5c'}}>
                        <div className="ticket-form">
                            <div className="form-outline">  
                                <select className="select-box" value={this.state.value} onChange={this.handleUserNameSelection}>                      
                                    {this.state.userNames.map((value, index) => <option key={index} value={value._id}>{value.name}</option>)}
                                </select>
                            </div>
                            <div className="form-outline">    
                                <select className="select-box" value={this.state.value} onChange={this.handleTicketSelection}>
                                    {this.state.ticketNames.map((value, index) => <option key={index} value={value._id} name="hello">{value.name}</option>)}
                                </select> 
                            </div>                   
                            <div className="form-outline">                       
                            <select className="select-box" value={this.state.value} onChange={this.handleChange}>
                                    <option value="11:00 AM"> 11:00 AM</option>
                                    <option value="02:00 PM"> 02:00 PM</option>
                                    <option value="05:00 PM"> 05:00 PM</option>
                                    <option value="08:00 PM"> 08:00 PM </option>
                                </select>
                            </div>
                            <div className="form-outline" style={{marginTop:14}}>     
                                <CustomizedInputs purchase={true} value={this.state.quantity} onChange={this.handleQuantitySelection} label="Quantity"/> 
                            </div>
                            <div className="form-outline">
                                <button style={{width:'100%'}} className="btn  add-user-button" onClick={this.addItem}>Add Item </button>                       
                            </div>
                            <div className="form-outline">                        
                                <button style={{width:'100%'}} className="btn  add-user-button" onClick={this.purchaseSumbit}>Purchase</button>
                            </div>                                
                            </div>
                        </Paper>
                    </Grid>                    
                </Grid>  
                {
                    this.fieldsArray.length > 0 &&
                    <Grid style={{padding:18}} container direction="row" justify="center" alignItems="center">
                    <Grid item xs={10}>
                        <Paper style={{border : '1px solid #cccccc5c'}}>  
                        <div>
                            {this.fieldsArray}
                        </div>     
                    </Paper>
                    </Grid>                    
                </Grid>     
                }                                             
                < ToastContainer
                    position="top-right"
                    autoClose={3000} />
            </div>
        )
    }
}

export default PurchaseTicket
