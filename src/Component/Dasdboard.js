import React, { Component } from 'react'
import "./style-sheet/dashboard.css"
import history from "../history";
import DatePicker from 'react-date-picker';
import Axios from 'axios';
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
        this.setState({ userName: event.target.value })
    }

    handleShowTimeSelection = (event) => {
        this.setState({ showTime: event.target.value })
    }

    dataPicker = (event) => {
        this.setState({ date: event })
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
        let i=0;
        if (this.state.userName != '') {
            let data = Object.assign({
                data: {
                    attributes: {
                        user: this.state.userName,
                        date: this.state.date
                    }
                }
            })

            let assignData = data.data.attributes;
            this.state.showTime != 'All' ? assignData['show_time'] = this.state.showTime :
                Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/purchase/dashboard`, data).then((response) => {
                    response = {
                        "data": [
                            { "qty": 3, "value": 270, "date": "2021-01-10T17:38:19.814Z", "rate": 90, "name": "Dubai" },
                            { "qty": 4, "value": 500, "date": "2021-01-10T17:38:19.814Z", "rate": 50, "name": "SARII3" },
                        ], "excess": 0, "balance": 0
                    }
                    
                    if (!this.state.controll) {
                        console.log("Helllo")
                        while(i<response.data.length){
                        
                            i++;
                        }
                        this.setState({ response: response.data, excess: response.excess, balance: response.balance, controll: true })

                    }

                }).catch((err) => {
                });
        }


    }

    render() {
        let data = {
            "data": [
                { "qty": 3, "value": 270, "date": "2021-01-10T17:38:19.814Z", "rate": 90, "name": "Dubai" },
                { "qty": 4, "value": 500, "date": "2021-01-10T17:38:19.814Z", "rate": 50, "name": "SARII3" },
            ], "excess": 0, "balance": 0
        }
        let i=0;
        console.log("Dataaa:",data)
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
                                <DatePicker className="picker-form-control"
                                    onChange={this.dataPicker}
                                    value={this.state.date}
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-outline">
                                <label className="form-label">Show Time *</label>
                                <select className="form-control" value={this.state.showTime} onChange={this.handleShowTimeSelection}>
                                    <option>11:00</option>
                                    <option> 14:00</option>
                                    <option> 17:00 </option>
                                    <option> 20:00 </option>
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
                                // data.map((value) => {
                                //     <tr>
                                //         <th scope="row">1</th>
                                //         <td>{value.name}</td>
                                //         <td>{value.qty}</td>
                                //         <td>{value.rate}</td>
                                //         <td>{value.value}</td>
                                //     </tr>
                                // })
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
