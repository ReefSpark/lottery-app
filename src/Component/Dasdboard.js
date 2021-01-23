import React, { Component } from 'react'
import "./style-sheet/dashboard.css"
import history from "../history";
import Axios from 'axios';
import { DatePicker, Space } from 'antd';
import moment from 'moment-timezone'
class Dasdboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userNames: [],
            userName: "",
            date: new Date(),
            showTime: "All",
            excess: 0,
            response: [{}],
            balance: 0,
            controll: false
        }
    }

    handleUserNameSelection = event => {
        this.setState({ userName: event.target.value, controll: false })
        this.remove()
    }

    handleShowTimeSelection = (event) => {
        this.setState({ showTime: event.target.value, controll: false })
        this.remove()
    }

    dataPicker = (date,datestring) => {
        this.setState({ date: datestring, controll: false })
        this.remove()
    }

    remove() {
        var array = this.state.response
        console.log("Count:",array)
        array.splice(0,array.length);
        this.setState({respone:array,excess:0,balance:0})
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
                                <DatePicker  className="form-control" defaultValue={moment(new Date, 'YYYY-MM-DD')} format={'YYYY-MM-DD'} onChange={this.dataPicker} />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-outline">
                                <label className="form-label">Show Time *</label>
                                <select className="form-control" value={this.state.showTime} onChange={this.handleShowTimeSelection}>
                                    <option>11:00 AM</option>
                                    <option> 02:00 AM</option>
                                    <option> 05:00 PM</option>
                                    <option> 08:00 PM </option>
                                    <option> All </option>
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


                            {/* <tr>
                               
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr> */}

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
