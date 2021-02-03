import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CustomizedTables from './table';

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

export default function ReportTable(props) {
    
  const classes = useStyles();
  const [winning_number, setwinning_number] = React.useState("");
  const outSt =  Math.abs(parseFloat(props.data.reduce((total, ticket) => total + ticket.value, 0)) - parseFloat(props.totalWinAmt))

  const handleWinningNumber = event => {
    setwinning_number(event.target.value);
  }

  const submit = () => {
    if (winning_number !== "" && winning_number !== undefined) {     
        const fields = {
            ticket_rate : props.rate,
            winning_number : winning_number
        };
        props.submit_win_number(fields);     
    }
  };

  return (
    <div>
      <Dialog
        open={true}
        onClose={props.handleClose}
        aria-labelledby="form-dialog-title"
      >      
      <DialogTitle id="form-dialog-title">Summary</DialogTitle>
        <DialogContent>
            <CustomizedTables data={props.data} report={true} addWinNum={(rate)=>this.addWinNum(rate)}/>
            <div style={{float : 'right'}}>
            <p style={{marginTop : 20}} >
                Total Ticket Amount : 
                <span style={{color : 'blue', marginLeft : 5, fontSize : 16, fontWeight : 'bold'}}>{props.data.reduce((total, ticket) => total + ticket.value, 0)}</span>
            </p>
            <p>
                Total Winning Amount : 
                <span style={{color : 'blue', marginLeft : 5, fontSize : 16, fontWeight : 'bold'}}>{props.totalWinAmt}</span>
            </p>
            <p>
                Outstanding : 
                <span style={{color : 'blue', marginLeft : 5, fontSize : 16, fontWeight : 'bold'}}>{outSt}</span>                
            </p>
            </div>
        </DialogContent>        
      </Dialog>
    </div>
  );
}
