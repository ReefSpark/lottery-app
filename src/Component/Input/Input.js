import React from 'react';
import {
  makeStyles,
} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      marginTop : 20
    },    
    textField: {
        borderColor: "#000",
        height: "40px",
        marginTop:5
    },
    inputTicket:{
        borderColor: "#000",
        marginTop:5,
        height:45,  
        width:150
    }
  }));


export default function CustomizedInputs(props) {
  const classes = useStyles();

  return (   
      <>   
    <div>            
        <input
          type="text"
          className={props.purchase? classes.inputTicket : classes.textField}
          value={props.value}
          style={{height:props.height, marginTop : props.marginTop, width : props.width}}
          onChange={props.onChange}
          placeholder={props.label}
          disabled={props.disabled}
        />       
    </div>
     <span style={{color: "red", fontSize:11, visibility: props.visibility? "" : "hidden"}}>{"Please fill the field."}</span>
     </>
  );
}