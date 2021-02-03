import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import CustomizedInputs from './Input/Input';
import DialogTitle from "@material-ui/core/DialogTitle";

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

export default function AddWinningNumber(props) {
    
  const classes = useStyles();
  const [winning_number, setwinning_number] = React.useState("");    

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
        <DialogTitle id="form-dialog-title">Add Winning Number</DialogTitle>
        <DialogContent>
            <div className={classes.textForm}>
              <CustomizedInputs width={"100%"} disabled={true} value={props.rate} label="Ticket Rate"/>       
              <CustomizedInputs width={"100%"} value={winning_number} onChange={(e)=>handleWinningNumber(e)} label="Winning Number"/>
            </div>
        </DialogContent>
        <DialogActions style={{ padding: "18px" }}>
            <button style={{marginTop:0, width : '100%'}}  className="btn add-user-button" onClick={() => submit()}>Submit</button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
