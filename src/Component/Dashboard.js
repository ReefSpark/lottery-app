import React, { Component } from 'react'
import "./style-sheet/dashboard.css"
import {Grid,Paper} from '@material-ui/core';
import history from "../history";
import { ToastContainer, toast } from "react-toastify";
import Axios from 'axios';
import { DatePicker, Space } from 'antd';
import moment from 'moment-timezone';
import CustomizedTables from './table';
import AddWinningNumber from './addForm';
import ReportTable from './modalDetail';

const possible_winnig_amt = [
    {'ticket_rate':15, 'combination':'C', 'price_amount':1000},
    {'ticket_rate':15, 'combination':'B', 'price_amount':1000},
    {'ticket_rate':15, 'combination':'A', 'price_amount':1000},
    {'ticket_rate':13, 'combination':'C', 'price_amount':100},
    {'ticket_rate':13, 'combination':'B', 'price_amount':100},
    {'ticket_rate':13, 'combination':'A', 'price_amount':100},
    {'ticket_rate':35, 'combination':'C', 'price_amount':50},
    {'ticket_rate':35, 'combination':'B', 'price_amount':1000},
    {'ticket_rate':35, 'combination':'A', 'price_amount':12000},
    {'ticket_rate':25, 'combination':'C', 'price_amount':0},
    {'ticket_rate':25, 'combination':'B', 'price_amount':1000},
    {'ticket_rate':25, 'combination':'A', 'price_amount':10000},
    {'ticket_rate':30, 'combination':'C', 'price_amount':0},
    {'ticket_rate':30, 'combination':'B', 'price_amount':1000},
    {'ticket_rate':30, 'combination':'A', 'price_amount':11000},
    {'ticket_rate':40, 'combination':'C', 'price_amount':0},
    {'ticket_rate':40, 'combination':'B', 'price_amount':1000},
    {'ticket_rate':40, 'combination':'A', 'price_amount':13000},
    {'ticket_rate':50, 'combination':'C', 'price_amount':100},
    {'ticket_rate':50, 'combination':'B', 'price_amount':1000},
    {'ticket_rate':50, 'combination':'A', 'price_amount':20000},
    {'ticket_rate':60, 'combination':'C', 'price_amount':100},
    {'ticket_rate':60, 'combination':'B', 'price_amount':1000},
    {'ticket_rate':60, 'combination':'A', 'price_amount':28000},
    {'ticket_rate':70, 'combination':'C', 'price_amount':100},
    {'ticket_rate':70, 'combination':'B', 'price_amount':2000},
    {'ticket_rate':70, 'combination':'A', 'price_amount':30000},
    {'ticket_rate':100, 'combination':'C', 'price_amount':100},
    {'ticket_rate':100, 'combination':'B', 'price_amount':1000},
    {'ticket_rate':100, 'combination':'A', 'price_amount':10000},
    {'ticket_rate':100, 'combination':'D', 'price_amount':500000},
    {'ticket_rate':150, 'combination':'C', 'price_amount':750},
    {'ticket_rate':150, 'combination':'B', 'price_amount':3500},
    {'ticket_rate':150, 'combination':'A', 'price_amount':37000},
    {'ticket_rate':150, 'combination':'D', 'price_amount':100000},
    {'ticket_rate':150, 'combination':'E', 'price_amount':250000}
]

class Dasdboard extends Component {
    constructor(props) {
        super(props)
        const bal = localStorage.getItem("out_balance");
        this.today = moment().format('YYYY-MM-DD')
        this.state = {
            userNames: [],
            userName: "",
            date: this.today,
            showTime: "All",
            excess: 0,
            response: [{}],
            balance: 0,
            controll: false,
            modal : false, modalRate : 0,
            totalWinAmt : 0,
            outStBl : 0, reportModal : false
        }
    }

    digitize = n => [...`${n}`].map(i => parseInt(i));

    ticketCalculation = (tickets) => {
        const retrievedObject = localStorage.getItem("win_items");
        const stored  = JSON.parse(retrievedObject);                   
        let winning_balance = 0;
        const res = tickets.map((item, i) => {
            const t_number = this.digitize(item.ticket_number);            
            const rate = item.actual_price;
            if(!stored || stored.filter(x=>x.ticket_rate == rate).length == 0){
                toast.error("Add winning number to all tickets");  
                return
            }
            else if (this.state.response.length > stored.length){
                toast.error("Add winning number to all tickets");  
                return
            }
            else{
                let winning_amt = 0;
                const winning_num = this.digitize(stored.filter(x=>x.ticket_rate == rate)[0].winning_number);
                if(rate == 150){                                
                    if(t_number[4] == winning_num[4] && t_number[3] == winning_num[3] && t_number[2] == winning_num[2] && t_number[1] == winning_num[1] && t_number[0] == winning_num[0])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'E')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else if(t_number[1] == winning_num[1] && t_number[2] == winning_num[2] && t_number[3] == winning_num[3] && t_number[4] == winning_num[4])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'D')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else if(t_number[2] == winning_num[2] && t_number[3] == winning_num[3] && t_number[4] == winning_num[4])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'A')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else if(t_number[3] == winning_num[3] && t_number[4] == winning_num[4])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'B')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else if(t_number[4] == winning_num[4])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'C')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else{  winning_balance = winning_balance + 0 }
                }
                if(rate == 100){                      
                    if(t_number[1] == winning_num[1] && t_number[2] == winning_num[2] && t_number[3] == winning_num[3] && t_number[4] == winning_num[4])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'D')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else if(t_number[2] == winning_num[2] && t_number[3] == winning_num[3] && t_number[4] == winning_num[4])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'A')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else if(t_number[3] == winning_num[3] && t_number[4] == winning_num[4])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'B')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else if(t_number[4] == winning_num[4])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'C')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else{  winning_balance = winning_balance + 0 }
                }
                if(rate == 15){                
                    if(t_number[1] == winning_num[1] && t_number[2] == winning_num[2])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'C')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else if(t_number[1] == winning_num[1] && t_number[0] == winning_num[0])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'B')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else if(t_number[0] == winning_num[0] && t_number[2] == winning_num[2])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'A')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }               
                    else{  winning_balance = winning_balance + 0 }
                }
                if(rate == 13){                
                    if(t_number[2] == winning_num[2])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'C')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else if(t_number[1] == winning_num[1])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'B')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else if(t_number[0] == winning_num[0])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'A')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }               
                    else{  winning_balance = winning_balance + 0 }
                }
                else{                                            
                    if(t_number[2] == winning_num[2] && t_number[1] == winning_num[1] && t_number[0] == winning_num[0])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'A')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else if(t_number[1] == winning_num[1] && t_number[2] == winning_num[2])
                    {      
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'B')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }
                    else if(t_number[2] == winning_num[2])
                    {
                        winning_amt = possible_winnig_amt.filter(x=> x.ticket_rate == rate && x.combination == 'C')[0].price_amount;
                        winning_balance = winning_balance + winning_amt;
                    }               
                    else{  winning_balance = winning_balance + 0 }
                }
                item.winning_amt = winning_amt;
                const {response} = this.state;
                response.filter(x=> x.rate == rate)[0].tickets
                    .map((tic,index) => {
                        if(tic.ticket_number == item.ticket_number)
                        {
                            tic.winning_amt = winning_amt
                        }
                })     
                console.log(response)          
                this.setState({
                    response : response
                })
            }           
        })
        localStorage.setItem("out_balance", winning_balance);    
        const outst = Math.abs(parseFloat(this.state.response.reduce((total, ticket) => total + ticket.value, 0)) - parseFloat(winning_balance))  
        this.setState({outStBl : outst, reportModal : true, totalWinAmt : winning_balance}) 
    }

    handleUserNameSelection = event => {
        this.setState({ userName: event.target.value, controll: false })
        this.remove()
    }

    handleShowTimeSelection = (event) => {
        this.setState({ showTime: event.target.value, controll: false })
        this.remove()
    }

    dataPicker = (date, datestring) => {
        this.setState({ date: datestring, controll: false })
        this.remove()
    }

    remove() {
        var array = this.state.response
        array.splice(0, array.length);
        this.setState({ respone: array, excess: 0, balance: 0 })
    }

    componentDidMount() {
        if (!localStorage.getItem('token')) {
            Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user`).then((response) => {                
                this.setState({ userNames: response.data.data.attributes.data, userName: response.data.data.attributes.data[0]._id })
            }).catch((err) => {
            });
        }
        else {
            history.push('/login')
        }
    }

    componentDidUpdate() {
        let i = 0;
        if (this.state.userName != '') {
            let data = Object.assign({
                data: {
                    attributes: {
                        user: this.state.userName,
                        date: this.state.date
                    }
                }
            })

            if (this.state.showTime != 'All') data.data.attributes['show_time'] = this.state.showTime
            if (!this.state.controll) {
                Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/purchase/dashboard`, data).then((response) => {
                    let res = response.data.data;
                    while (i < res.length) {
                        this.state.response[i] = {
                            sno: i + 1,
                            name: res[i].name,
                            qty: res[i].qty,
                            value: res[i].value,
                            tickets : res[i].purchaseTickets,
                            rate: res[i].rate
                        }
                        this.setState({ respone: this.state.response })
                        i++;
                    }
                    this.setState({ excess: response.data.excess, balance: response.data.balance, controll: true })
                }).catch((err) => {
                });
            }
        }
    }

    Calculate = () => {
        let tickets = [];
        this.state.response.map(item => {
            tickets = tickets.concat(item.tickets)
        })        
        this.ticketCalculation(tickets);
    }

    submit_win_number = (fields) => {
        const retrievedObject = localStorage.getItem("win_items");
        const stored  = JSON.parse(retrievedObject);
        if(stored == null){
            const win_items = [];       
            win_items.push(fields);
            localStorage.setItem("win_items", JSON.stringify(win_items));
        }
        else{
            stored.push(fields);
            localStorage.setItem("win_items", JSON.stringify(stored));
        }
        this.setState({modal : false})
    }

    handleClose = () => {
        this.setState({modal : false})
    }

    handleReportClose = () => {
        this.setState({reportModal : false})
    }

    addWinNum = (rate) => {        
        this.setState({modal : true, modalRate : rate})
    }

    render() {
        return (
            <div>           
            <Grid style={{padding:10}} container direction="row" justify="center" alignItems="center">
                <Grid item xs={8}>
                    <h4>Outstating Balance : {this.state.outStBl}</h4>
                    <Paper style={{border : '1px solid #cccccc5c'}}>                   
                    <div className="ticket-form">
                        <div className="form-outline">
                            <select className="select-box" value={this.state.value} onChange={this.handleUserNameSelection}>
                                {this.state.userNames.map((value, index) => <option key={index} value={value._id}>{value.name}</option>)}
                            </select>
                        </div>
                        <div className="form-outline">
                        <DatePicker className="form-control datePicker" defaultValue={moment(this.today, 'YYYY-MM-DD')} format={'YYYY-MM-DD'} onChange={this.dataPicker} />
                        </div>
                        <div className="form-outline">
                        <select className="select-box" value={this.state.value} onChange={this.handleChange}>
                                <option value="11:00 AM"> 11:00 AM</option>
                                <option value="02:00 PM"> 02:00 PM</option>
                                <option value="05:00 PM"> 05:00 PM</option>
                                <option value="08:00 PM"> 08:00 PM </option>
                            </select>
                        </div>
                        <div className="form-outline">
                            <button style={{width:'100%', marginTop:0}} className="btn  add-user-button" onClick={this.Calculate}>Calculate</button>
                        </div>
                        </div>
                    </Paper>
                </Grid>                
            </Grid>
            <Grid style={{padding:18}} container direction="row" justify="center" alignItems="center">
            <Grid item xs={10}>
                <Paper style={{border : '1px solid #cccccc5c'}}>  
                    <CustomizedTables data={this.state.respone} addWinNum={(rate)=>this.addWinNum(rate)}/>
                </Paper>
            </Grid>
            </Grid>
            {
                this.state.modal && 
                <AddWinningNumber handleClose={this.handleClose} submit_win_number={this.submit_win_number} rate={this.state.modalRate}/>
            }
            {
                this.state.reportModal && 
                <ReportTable totalWinAmt = {this.state.totalWinAmt} handleClose={this.handleReportClose} data={this.state.respone}/>
            }
            < ToastContainer
                position="top-right"
                autoClose={3000} />
        </div>
        )
    }
}

export default Dasdboard
