import React, { Component } from 'react'
import "./style-sheet/dashboard.css"
import history from "../history";
import Axios from 'axios';
import { DatePicker, Space } from 'antd';
import moment from 'moment-timezone';

const possible_winnig_amt = [
    // {'ticket_rate':15, 'combination':'C', 'price_amount':1000},
    // {'ticket_rate':15, 'combination':'B', 'price_amount':1000},
    // {'ticket_rate':15, 'combination':'A', 'price_amount':1000},
    // {'ticket_rate':13, 'combination':'C', 'price_amount':100},
    // {'ticket_rate':13, 'combination':'B', 'price_amount':100},
    // {'ticket_rate':13, 'combination':'A', 'price_amount':100},
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
        this.today = moment().format('YYYY-MM-DD')
        this.state = {
            userNames: [],
            userName: "",
            date: this.today,
            showTime: "All",
            excess: 0,
            response: [{}],
            balance: 0,
            controll: false
        }
    }

    digitize = n => [...`${n}`].map(i => parseInt(i));   

    componentDidMount = () => {
        const tickets = [
            {"ticketNumber":67636, "name" : 'Dubai', "rate" : 25},
            {"ticketNumber":84573, "name" : 'IS', "rate" : 25},
            {"ticketNumber":58433, "name" : 'Dubai', "rate" : 25},
            {"ticketNumber":85765, "name" : 'Dubai', "rate" : 250},
            {"ticketNumber":86433, "name" : 'In', "rate" : 250},
            {"ticketNumber":67663, "name" : 'In', "rate" : 25},
            {"ticketNumber":23445, "name" : 'Dubai', "rate" : 50},
            {"ticketNumber":34635, "name" : 'IS', "rate" : 50},
            {"ticketNumber":68457, "name" : 'Dubai', "rate" : 50},
            {"ticketNumber":28537, "name" : 'ID', "rate" : 50},
            {"ticketNumber":95784, "name" : 'ID', "rate" : 25},
            {"ticketNumber":47854, "name" : 'Dubai', "rate" : 25},
        ]
        const winning_num = this.digitize(78465);
        const winning_balance = 0;        
        const res = tickets.map(item => {
            const t_number = this.digitize(item.ticketNumber);           
            console.log(t_number);            
        })
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
        console.log("Count:", array)
        array.splice(0, array.length);
        this.setState({ respone: array, excess: 0, balance: 0 })
    }

    // componentDidMount() {
    //     if (!localStorage.getItem('token')) {
    //         Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user`).then((response) => {
    //             this.setState({ userNames: response.data.data.attributes.data, userName: response.data.data.attributes.data[0]._id })
    //         }).catch((err) => {
    //         });
    //     }
    //     else {
    //         history.push('/login')
    //     }
    // }

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

    render() {
        return (
            <div className="start">
                <div className="user-status">
                    <div className="row">
                        <div className="col">
                            <div className="form-outline">
                                <label className="form-label">Username </label>
                                <select className="form-control " onChange={this.handleUserNameSelection}>
                                    {this.state.userNames.map((value, index) => <option key={index} value={value._id}>{value.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-outline">
                                <label className="form-label">DatePicker </label>
                                <DatePicker className="form-control" defaultValue={moment(this.today, 'YYYY-MM-DD')} format={'YYYY-MM-DD'} onChange={this.dataPicker} />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-outline">
                                <label className="form-label">Show Time *</label>
                                <select className="form-control" value={this.state.showTime} onChange={this.handleShowTimeSelection}>
                                    <option value="11:00 AM"> 11:00 AM</option>
                                    <option value="02:00 PM"> 02:00 PM</option>
                                    <option value="05:00 PM"> 05:00 PM</option>
                                    <option value="08:00 PM"> 08:00 PM </option>
                                    <option value="All"> All </option>
                                </select>
                            </div>
                        </div>
                    </div>  
                </div>
                <br></br>
                <div className="dashboard">
                    <table className="table">
                        <thead className="thead-dark ">
                            <tr>
                                <th scope="col">Sno</th>
                                <th scope="col">Ticket Name</th>
                                <th scope="col">Qty</th>
                                <th scope="col"> Rate</th>
                                <th scope="col"> Value </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.response.map((value) => {
                                    return (<tr>
                                        <th scope="row">{value.sno}</th>
                                        <td>{value.name}</td>
                                        <td>{value.qty}</td>
                                        <td>{value.rate}</td>
                                        <td>{value.value}</td>
                                    </tr>)
                                })
                            }
                           
                        </tbody>
                    </table>
                </div>
                <div className='row'>
                    <div className="col">
                        <h4>Excess : {this.state.excess}</h4>
                    </div>
                    <div className="col">
                        <h4>Balance : {this.state.balance}</h4>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dasdboard
