import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { LineChart, Line, CartesianGrid, XAxis, Tooltip, YAxis, ResponsiveContainer } from 'recharts';
import spinner from '../assets/loading.gif'
import { ButtonGroup } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { object } from 'prop-types';
import { BackgroundColor } from 'chalk';


const dateSort = (x,y) => {
    if (Date.parse(x.date) > Date.parse(y.date)){
        return -1
    }
    if (Date.parse(x.date) < Date.parse(y.date)){
        return 1
    }
    else {
        return 0
    }

}


const useStyles = makeStyles((theme) => ({
    rangebutton: {
        height: '4vmin',
        // marginLeft: "10vmin",
        marginTop: "1vmin"
    },
    selectedbutton: {
        height: '4vmin',
        // marginLeft: "10vmin",
        marginTop: "1vmin",
        color: 'black',
        fontSize: "2vmin"

    },
}));


const Ticker = () => {

    const classes = useStyles();
    const [tickerData, setTickerData] = useState({})
    const [dataLoaded, setDataLoaded] = useState(false)
    const [selectedTimeFrame, setSelectedTimeFrame] = useState('WEEK')
    const [cutoffDate, setCutoffDate] = useState(null)
    const [processedDisplayData, setProcessedDisplayData] = useState([])
    // const [dateArray, setDateArray] = useState([])

    let ticker_name = useParams()
    let today = new Date()

    
    useEffect(() => {
        fetch(`http://localhost:9292/tickers/name/${ticker_name.ticker_name}`)
        .then(resp => resp.json())
        .then(data => {
            // console.log(data)
            setTickerData(data)
            let cutoff = new Date()
            cutoff.setDate(cutoff.getDate() - 7);
            setCutoffDate(cutoff)

        })
        // .fetch(`https:`)

    }, [])
    
    const handleRangeClick = (e) => {

        setSelectedTimeFrame(e.target.innerText)
        
    }


    useEffect(() => {
        // let today = new Date()

        if (selectedTimeFrame === 'WEEK') {
            let cutoff = new Date()
            cutoff.setDate(cutoff.getDate() - 7);
            setCutoffDate(cutoff)
            console.log(cutoff)
        } else if (selectedTimeFrame === "MONTH") {
            let cutoff = new Date()
            cutoff.setMonth(cutoff.getMonth() - 1);
            setCutoffDate(cutoff)
        } else if (selectedTimeFrame === "YEAR"){
            let cutoff = new Date()
            cutoff.setFullYear(cutoff.getFullYear() - 1);
            setCutoffDate(cutoff)
        }
    }, [selectedTimeFrame])

    useEffect(() => {

        let today = new Date()
        console.log(cutoffDate)

        let displayData = []
        let dateArray = []
        console.log(tickerData)
        if (dataLoaded === true) {
            Object.keys(tickerData['mentions_by_recent']).forEach((item) => {
                
                let mention_date = Date.parse(tickerData['mentions_by_recent'][item]['date'])
    
                if (mention_date > cutoffDate.getTime()) {
    
                    displayData.push(tickerData['mentions_by_recent'][item])
    
                    let d = new Date(0)
                    d.setUTCSeconds(mention_date / 1000)
                    dateArray.push(d.toISOString().split('T')[0])

                }
            })

            const start = cutoffDate; //Start Date = cutoff
            const end = today; //End day = Today
            
            console.log(dateArray)

            let loop = new Date(start);
            while (loop <= end) {

                if (!dateArray.includes(loop.toISOString().split('T')[0])) {

                    //Date is missing from range, make sure to add it. We might disable all time graph for performance.
                    let fill = {
                        date: loop.toISOString().split('T')[0],
                        estimated_outreach: 0
                    }
                    displayData.push(fill)
                    
                }
    
                let newDate = loop.setDate(loop.getDate() + 1);
                loop = new Date(newDate);
            }
    
        }


        console.log(displayData)
        setProcessedDisplayData(displayData)
        
    }, [cutoffDate])
    

    useEffect(()=> {
        setTimeout(() => {
            if (processedDisplayData) {
                setDataLoaded(true)
            }
            }, 100)
    }, [tickerData])


    console.log(selectedTimeFrame)

    return (
        <div>
            {dataLoaded ?
                <>

                    <div className='graph-container'>
                        <div className='break' />
                        <ResponsiveContainer width="90%" height="95%">
                            <LineChart width={1000} height={300} data={(processedDisplayData.sort(dateSort)).reverse()} margin={{ top: 20, right: 0, bottom: 10, left: 50 }}>
                                <Line type="monotone" dataKey="estimated_outreach" stroke="#8884d8" dot={false} />
                                <CartesianGrid stroke="#ccc" />
                                <Tooltip />
                                <XAxis minTickGap={100} dataKey="date" tickCount={5} offset={10} />
                                <YAxis startOffset={100} />
                            </LineChart>
                        </ResponsiveContainer>


                    </div>

                    <div className='graph-options-container'>
                        <h3 className='graph-header'>${ticker_name.ticker_name}</h3>
                        <ButtonGroup color="primary" aria-label="outlined primary button group">
                            <Button className={selectedTimeFrame === 'WEEK' ? classes.selectedbutton : classes.rangebutton} onClick={handleRangeClick} name='week'>Week</Button>
                            <Button className={selectedTimeFrame === 'MONTH' ? classes.selectedbutton : classes.rangebutton} onClick={handleRangeClick} name='month'>Month</Button>
                            <Button className={selectedTimeFrame === 'YEAR' ? classes.selectedbutton : classes.rangebutton} onClick={handleRangeClick} name='year'>Year</Button>
                            {/* <Button className={selectedTimeFrame === 'ALL TIME' ? classes.selectedbutton : classes.rangebutton} onClick={handleRangeClick} name='all'>All Time</Button> */}
                        </ButtonGroup>

                    </div>

                </>
                : <img className='loading-spinner' src={spinner} alt='loading spinner'></img>}
        </div >
    )
}

export default Ticker
