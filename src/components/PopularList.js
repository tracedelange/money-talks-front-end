import React from 'react'
import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles';
import { NavLink } from 'react-router-dom';
import HelpDialog from './HelpDialog'
import help from '../assets/q-mark.png'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        width: "47vw", //1vw margin on each side of the header
        left: "1vw",
        top: "1vh",
        height: "63vh",
        overflowY: "scroll"
    },
}));

//https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript - Coming in clutch again
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const PopularList = ({ popular }) => {

    const classes = useStyles()

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let tickerList = []
    let popularTickerArray = popular.map((item) => {

        if (!tickerList.includes(item.ticker_id)) {

            tickerList.push(item.ticker_id)

            return (
                <li key={item.ticker_id} >
                    <NavLink to={`/ticker/${item.ticker.ticker_name}`}>
                        {item.ticker.ticker_name} - {numberWithCommas(item.estimated_outreach)} E.O.
                    </NavLink>
                </li>
            )
        }
    })


    return (
        <div className="popular-results-container">
            <Paper className={classes.root} elevation={3}>
                <h2 className="header2">Popular This Week <img onClick={handleClickOpen} src={help} className="help" alt="Help" /></h2>

                <ul>

                    {popularTickerArray}

                </ul>


            </Paper>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Estimated Outreach"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        E.O. is the sum of mentions multiplied by the number of followers each mentioning user has. If a symbol was mentioned by a user with 10 followers ten times and mentioned by a user with 1,000,000 followers once
                        , the estimated outreach would be 1,000,000 + 100 = 1,000,100
                        <br />
                        <br />
                        The following tickers are those with the highest Estimated Outreach over the past 7 days

                    </DialogContentText>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default PopularList