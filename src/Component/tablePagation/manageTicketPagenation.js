import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Axios from 'axios';
// popup
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
const URL = `${process.env.REACT_APP_API_BASE_URL}`;
//popup
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const columns = [
  
  { id: 'name', label: 'Name', minWidth: 100 },
  {
    id: 'price',
    label: 'Price',
    minWidth: 100,
    align: 'right'
  },
  {
    id: 'created_date',
    label: 'Create Date',
    minWidth: 100,
    align: 'right'
  }
];
const ticketColumns = [
  {id: 'combination', label: 'Combination',minWidth: 100},
  {id: 'prize', label: 'Prize',minWidth: 100,}
]
const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});
export default function StickyHeadTable() {
  const classes = useStyles();
  const [rows, setRow] = React.useState([])
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // popup
  const [editData, setEditData] = React.useState({});
  const [readOnly, setReadOnly] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [tickets, setTickets] = React.useState([]);
  const [ticketLoading, setTicketLoading] = React.useState(false);
  // popup
  const handleClose = () => {
    setOpen(false);
    setTicketLoading(false);
    setTickets([])
    setReadOnly(true)
  };
  // component did mount
  useEffect(async () => {
    let { data } = await Axios.get(`${URL}/api/v1/master`);
    // let { data } = await Axios.get(`${URL}/api/v1/user?page_no=${page}&limit=${rowsPerPage}`);
    console.log(data.data.attributes.data)
    setRow(data.data.attributes.data);
  }, []);
  // our custom function
  const userPagination = async (event, something) => {
    let { data } = await Axios.get(`${URL}/api/v1/master`);
    // let { data } = await Axios.get(`${URL}/api/v1/user?page_no=${something}&limit=${rowsPerPage}`);
    setRow(data.data.attributes.data);
    setRowsPerPage(+rowsPerPage);
    setPage(something);
  }
  // it call whenever rowsperpage changes
  useEffect(() => {
    userPagination(rowsPerPage, 0)
  }, [rowsPerPage]);
  // popup
  const updateUser = async (payload) => {
    console.log('payload', payload)
    let { data } = await Axios.patch(`${URL}/api/v1/user/${payload._id}`, {
      data: {
        attributes: {
          email: payload.email
        }
      }
    });
    console.log('update data result', data);
    userPagination(rowsPerPage, 0)
    setOpen(false);
    setReadOnly(true);
  }
  const getTicket = async (a) => {
    setTicketLoading(true)
    let { data } = await Axios.get(`${URL}/api/v1/ticket/${a._id}`);
    console.log(data.data.attributes)
    setTickets(data.data.attributes.data);
    setTicketLoading(false);
  }
  function rowClick(a) {
    console.log(a);
    // setEditData(a);
    getTicket(a)
    setOpen(true);
  }
  // popup
  const changeReadonly = () => {
    setReadOnly(false)
  }
  // change rows per page
  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    // const classes = useStyles();
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow selected={true}>
              {columns.map((column) => (
                <TableCell
                  key={column._id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code} onClick={() => rowClick(row)}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? value : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 25, 100]} // we can set whatever we want
        component="div"
        count={29} // !! important ---> need to set total count of records
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={userPagination} // our custom function (NEXT, PREV) button
        onChangeRowsPerPage={handleChangeRowsPerPage} // rows per page function
      />
      {/* popup start */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        disableBackdropClick={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Tickets"}</DialogTitle>
        <DialogContent>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow selected={true}>
                {ticketColumns.map((column) => (
                  <TableCell
                    key={column._id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {tickets.length > 0} */}
              {tickets.length > 0 ? tickets.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code} onClick={() => rowClick(row)}>
                    {ticketColumns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? value : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              }): <TableRow>
                <TableCell>  </TableCell>
                <TableCell style={{textAlign: 'center'}}> No Data </TableCell>
                <TableCell>  </TableCell>
                </TableRow>}
            </TableBody>
          </Table>
          {/* <form className={classes.container}  >
            <TextField
              name={'email'}
              value={editData.email}
              inputProps={{
                readOnly: readOnly
              }}
              onInput={e => setEditData(prevState => {
                return {...prevState, [e.target.name]:e.target.value}
              })}
            /> <br />
            <TextField
              name={'name'}
              value={editData.name}
              InputProps={{
                readOnly: readOnly
              }}
              onInput={e => setEditData(prevState => {
                return {...prevState, [e.target.name]:e.target.value}
              })}
            />
          </form> */}
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => updateUser({ ...editData })} color="primary">
            Update
          </Button> */}
          {/* <Button onClick={changeReadonly} color="primary">
            Edit
          </Button> */}
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* popup end */}
    </Paper>
  );
}