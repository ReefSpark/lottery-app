import React, { Component } from 'react'
import "./style-sheet/dashboard.css"
import history from "../history";
import DatePicker from 'react-date-picker';
import Axios from 'axios';
import {moment} from 'moment'
class Dasdboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userNames: [],
            userName: "",
            date: new Date(),
            showTime: "All",
            excess:0,
            balance:0,
        }
    }

    handleUserNameSelection = event => {
        this.setState({ userName: event.target.value })
    }

    handleShowTimeSelection = (event)=>{
        this.setState({showTime: event.target.value})
    }

    dataPicker = (event) => {
        console.log("date:",event)
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
    componentDidUpdate(){
        if(this.state.userName!= ''){
            let data= Object.assign({
                data:{
                    attributes:{
                        user:this.state.userName,
                        date:moment(this.state.date).tz('Asia/Kolkata').format()
                    }
                }
            })
            let assignData = data.data.attributes;
            this.state.showTime !='All'? assignData['show_time']=this.state.showTime:
            console.log("data:",data)
            Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/purchase/dashboard`,data).then((response) => {
                console.log("INside:",this.state)
            }).catch((err) => {
            });
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
                           
                            {/* <tr>
                                <th scope="row">1</th>
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
