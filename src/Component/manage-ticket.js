import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from "react-toastify";
import Axios from 'axios'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CustomizedInputs from './Input/Input';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    marginTop:50,
    textAlign: 'center',
    boxShadow:'none',
    color: theme.palette.text.secondary,
  },
  cardroot: {
    minWidth: 450,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  textForm:{
    marginTop:20
  },
  pos: {
    marginBottom: 12,
  }
}));

export default function ManageTicket() {
  const classes = useStyles();
  const [ticket_name, set_ticket_name] = useState('');
  const [ticket_price, set_ticket_price] = useState('');
  const [name_error, set_name_error] = useState(false);
  const [price_error, set_price_error] = useState(false);

  const handleTicketName = event => {
    set_ticket_name(event.target.value);
    set_name_error(false)
  }

  const handleTicketPrice = event => {
    set_ticket_price(event.target.value);
    set_price_error(false)
  }

  const purchaseSumbit = () => {
    if(ticket_name == "" && ticket_price  == ""){
      set_name_error(true)
      set_price_error(true)
    }
    if(ticket_name == ""){     
      set_name_error(true)
    }
    else if(ticket_price  == ""){      
      set_price_error(true)
    }    
    else{
      const data = {
        data : {
          attributes: {
            name : ticket_name,
            price : ticket_price
          }
        }       
      }
      return Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/master`, data).then((response) => {
        if (response.status === 200)
            toast.success("Ticket Added Successfully");
            set_ticket_name('');
            set_ticket_price('');                    
        }).catch((err) => {               
            toast.error(err.response.data.data.attributes.message);            
        })
    }
  }

  return (
    <div className={classes.root}>
       <Grid container
          direction="row"
          justify="center"
          alignItems="center" item xs={12}>
          <Paper className={classes.paper}>
          <Card className={classes.cardroot}>
            <CardContent>        
              <Typography variant="h5" component="h2">
                Add Ticket
              </Typography>       
              <div className={classes.textForm}>
              <CustomizedInputs visibility={name_error} value={ticket_name} onChange={handleTicketName} label="Name"/>       
              <CustomizedInputs visibility={price_error} value={ticket_price} onChange={handleTicketPrice} label="Price"/>
              </div>
            </CardContent>
            <CardActions style={{justifyContent:'center'}}>
              <button style={{marginTop:0}}  className="btn add-user-button" onClick={purchaseSumbit}>Add Ticket</button>
            </CardActions>
          </Card>
          < ToastContainer
            position="top-right"
            autoClose={3000} />
          </Paper>
        </Grid>
   
    </div>
  );
}