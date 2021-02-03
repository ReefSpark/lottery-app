import React, { Component } from 'react'
import Pagenation from './tablePagation/purchaseCalculation'
import '../Component/style-sheet/tableStyle.css'
import history from '../history';
import queryString from 'query-string';
class ViewTickets extends Component {
    constructor(props) {
        super(props)
    }

    backSumbit = () => {
        history.push('/purchase-ticket');
    }

    render() {
        const parsed = queryString.parse(window.location.search);
        return (
            <div>
                <div className="user-list-search">
                    <input type="submit" style={{ "backgroundColor": "black", color: "white", width: "20%" }} id="form8Example3" className="form-control search-button-controll" value="Back" onClick={this.backSumbit} />
                    <h3 className="search-text">Purchase Calculation</h3>
                    <h1></h1>
                </div>
                <Pagenation user={parsed.name} />
                
            </div>
        )
    }
}
export default ViewTickets
