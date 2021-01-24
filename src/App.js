
import './App.css';
import Login from './Component/login'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import history from './history';
import Dashboard from './Component/header'
import ViewTicket from './Component/viewTickets'
import ViewUsers from './Component/viewUsers'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";


function App() {
  return (
    <div className="App">
      {/* <Dashboard/> */}
      <Switch>
        <Router history={history}>
          {/* <Route
                exact
                path="/"
                render={() => {
                    return (
                      !localStorage.getItem('token') ?
                      <Redirect to="/login" /> :
                      <Redirect to="/dashboard" /> 
                    )
                }}
              /> */}
          <Route exact path="/" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/users" component={Dashboard} />
          <Route exact path="/manage-tickets" component={Dashboard} />
          <Route exact path="/purchase-ticket" component={Dashboard} />
          <Route exact path="/view-users" component={ViewUsers} />
          <Route exact path="/view-ticket" component={ViewTicket} />
        </Router>
      </Switch>


    </div>
  );
}

export default App;
