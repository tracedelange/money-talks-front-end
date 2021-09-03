import React, { useEffect, useState } from 'react'
import HomePage from './HomePage';
import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, Redirect } from 'react-router-dom';
import Ticker from './Ticker'
import spinner from "../assets/loading.gif"

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

    const [popular, setPopular] = useState([])
    const [popularLoaded, setPopularLoaded] = useState(false)

    useEffect(() => {
        //On initial app load, fetch popular items and pass them to main-stage on load finish
        let d = new Date()
        d.setDate(d.getDate() - 7)
        let queryDate = (d.toISOString()).split('T')[0]

        fetch(`https://money-talks-sinatra-api.herokuapp.com/mentions/by-date/${queryDate}`)
            .then(resp => resp.json())
            .then(data => {
                setPopular(data)
                setPopularLoaded(true)
            })
    }, [])

    return (
        <div className='main-stage'>
            <Paper className={classes.root} elevation={3}>
                <Switch>
                    <Route exact path='/ticker/:ticker_name'>
                        <Ticker />
                    </Route>
                    <Route path='/'>
                        <HomePage popular={popularLoaded ? popular : null } />
                    </Route>
                </Switch>
            </Paper>
        </div>
    )
}

export default MainStage
