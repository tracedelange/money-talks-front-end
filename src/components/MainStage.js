import React, {useEffect, useState} from 'react'
import HomePage from './HomePage';
import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, Redirect } from 'react-router-dom';
import Ticker from './Ticker'

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        width: "98vw", //1vw margin on each side of the header
        left: "1vw",
        top: "12vh",
        height: "86vh",
    },
  }));


const MainStage = () => {

    const classes = useStyles();





    return (
        <div className='main-stage'>
            <Paper className={classes.root} elevation={3}>
                <Switch>
                    <Route exact path='/ticker/:ticker_name'>
                        <Ticker />
                    </Route>
                    <Route path = '/'>
                        <HomePage />
                    </Route>
                </Switch>
            </Paper>
        </div>
    )
}

export default MainStage
