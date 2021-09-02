import React from 'react'
import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles';
import { NavLink } from 'react-router-dom';

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

const SearchResults = ({searchData}) => {

    const classes = useStyles();

    const searchDataArray = searchData.map((item =>  {
        return <li
        className="search-list-item"
        key={item.ticker_id}
        >
        <NavLink to={`/ticker/${item.ticker_name}`}>
            {item.ticker_name}
        </NavLink>

        </li>}))

    return (
        <div className="search-results-container">
            <Paper className={classes.root} elevation={1}>

            <h2 className="header2">Search Results:</h2>
            <ul>
                {searchDataArray}
            </ul>
            
            </Paper>
        </div>
    )
}

export default SearchResults
