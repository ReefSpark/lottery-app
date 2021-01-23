import React, { Component } from 'react'
import Pagenation from './tablePagation/manageTicketPagenation'
import SearchPagenation from './tablePagation/searchManageTicket'
import '../Component/style-sheet/tableStyle.css'
import history from '../history';

class ViewTickets extends Component {
    constructor(props) {
        super(props)

        this.state = {
            notSearch: false,
            searchName: ''
        }
    }

    handleSearch = (e) => {
        this.setState({ searchName: e.target.value, notSearch: true })
    
    }

    backSumbit = () => {
        history.push('/manage-tickets');
    }

    render() {
        return (
            <div>
                <div className="user-list-search">
                    <input type="submit" style={{ "backgroundColor": "black", color: "white", width: "20%" }} id="form8Example3" className="form-control search-button-controll" value="Back" onClick={this.backSumbit} />
                    <h3 className="search-text">Table Master Lists</h3>
                    <input type="text" className="form-control search-text" placeholder="Search ..." onChange={this.handleSearch} />
                </div>
                {!this.state.notSearch && (<Pagenation callChild={this.state.pagenation} />)}
                { this.state.notSearch && (<SearchPagenation searchName={this.state.searchName} />) }


            </div>
        )
    }
}
export default ViewTickets
