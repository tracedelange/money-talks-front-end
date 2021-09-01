import React from 'react'
import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        width: "98vw", //1vw margin on each side of the header
        left: "1vw",
        top: "1vw",
        height: "8vh",
        backgroundColor:"#a0e6ff;"

    },
  }));

  
  const Header = ({resetSearch}) => {

    const classes = useStyles();

    return (
        <div className="header-root" >
            <Paper className={classes.root} elevation={3}>
                <div className="header-content" >
                    <NavLink to='/' onClick={resetSearch} ><h2>Money Talks</h2></NavLink>


                </div>
            </Paper>
        </div>
    )
}

export default Header
