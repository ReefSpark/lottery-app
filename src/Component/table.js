import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
  root:{
    padding:10
  },
  head: {
    backgroundColor: "black",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function CustomizedTables(props) {
  const classes = useStyles();

  const retrievedObject = localStorage.getItem("win_items");
  const stored  = JSON.parse(retrievedObject);

  return (
    <TableContainer component={Paper}>
      <Table style={{width : '100%'}} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align={"center"}>S.No</StyledTableCell>
            <StyledTableCell>Ticket Name</StyledTableCell>
            <StyledTableCell>Rate</StyledTableCell>
            <StyledTableCell>Qty</StyledTableCell>
            <StyledTableCell>Total</StyledTableCell>
            {
              !props.report ?
              <StyledTableCell align="center">Winning Number</StyledTableCell> :
              <StyledTableCell align="center">Winning Amount</StyledTableCell>

            }            
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data?.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell align="center" component="th" scope="row">
                {row.sno}
              </StyledTableCell>
              <StyledTableCell>{row.name}</StyledTableCell>
              <StyledTableCell>{row.rate}</StyledTableCell>
              <StyledTableCell>{row.qty}</StyledTableCell>
              <StyledTableCell>{row.value}</StyledTableCell>
              {
              !props.report ?
              <StyledTableCell align="center">
              {
                stored?.filter(x=>x.ticket_rate == row.rate)[0]?.winning_number ? 
                <span style={{marginTop:0, color : 'blue'}} onClick={()=>props.addWinNum(row.rate)}>
                {stored.filter(x=>x.ticket_rate == row.rate)[0].winning_number}
                </span>  :
                <span style={{marginTop:0, textDecoration:'underline', cursor:'pointer'}} onClick={()=>props.addWinNum(row.rate)}>
                  Add Winning Number
                </span> 
              }
              </StyledTableCell> :
              <StyledTableCell align="center">
                {row.tickets.reduce((total, ticket) => total + ticket.winning_amt, 0)}
              </StyledTableCell>
              }
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}