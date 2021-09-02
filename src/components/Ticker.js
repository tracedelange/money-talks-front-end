import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { LineChart, Line, CartesianGrid, XAxis, Tooltip, YAxis, ResponsiveContainer } from 'recharts';
import spinner from '../assets/loading.gif'
import { ButtonGroup } from '@material-ui/core';
import { Button } from '@material-ui/core';
import Graph from './Graph';
import { makeStyles } from '@material-ui/core/styles';



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


const processData = (cutoffDate, tickerData) => {

    let today = new Date()
    let displayData = []
    let dateArray = []

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
    return displayData
}

const processVantageData = (vantageData, cutoffDate) => {

    // console.log('cutoff date')
    console.log(cutoffDate)

    let displayData = []
    let dateArray = []

    console.log(vantageData)

    Object.keys(vantageData['results']).forEach((item) => {

        let mention_date = vantageData['results'][item]['t']
        // console.log(vantageData['results'][item]['t'])

        // console.log(mention_date)
        // console.log(cutoffDate.getTime())
        // console.log(cutoffDate.getTime() < mention_date/1000)

        if ((mention_date) > cutoffDate.getTime()) {

            let avg = (parseFloat(vantageData['results'][item]['h']) + parseFloat(vantageData['results'][item]['l']))

            let vd = new Date(0); // The 0 there is the key, which sets the date to the epoch
            vd.setUTCSeconds((vantageData['results'][item]['t']) / 1000);


            let displayItem = {

                date: vd.toISOString().split('T')[0],
                avg: parseFloat(avg.toFixed(2))

            }

            displayData.push(displayItem)

            let d = new Date(0)
            d.setUTCSeconds(mention_date / 1000)
            dateArray.push(d.toISOString().split('T')[0])

        }
    })
    console.log(displayData)
    return displayData
}

const fetchAndReturnDisplayData = (ticker, cutoff, setTickerData) => {

    return fetch(`http://localhost:9292/tickers/name/${ticker}`)
        .then(resp => resp.json())
        .then(data => {

            // console.log('We should only see this once per reload')
            setTickerData(data)
            // let cutoff = new Date()
            // cutoff.setDate(cutoff.getDate() - 7);

            let dataToBeGraphed = processData(cutoff, data)
            return dataToBeGraphed
            // setDataLoaded(true)
        })

}

const fetchAndReturnVantageData = (ticker, cutoff, setVantageTickerData) => {

    let d = new Date()
    let today = d.toISOString().split('T')[0]
    let yearAgo = d.setFullYear(d.getFullYear() - 1);

    let ly = new Date(0)
    ly.setUTCSeconds(yearAgo / 1000)

    return fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${ly.toISOString().split('T')[0]}/${today}?adjusted=true&sort=asc&limit=1000&apiKey=bWEa_uqaWdOXNLpPFHRMgQ3YksGyOatW`)
    .then(resp => resp.json())
    .then(data => {

        console.log(data)
        setVantageTickerData(data) //save the data so when resolution is changed no re-render occurs


        
        let toBeGraphed = processVantageData(data, cutoff)
        console.log(toBeGraphed)
        return toBeGraphed


        // let processedData = processVantageData(cutoff, data)



    })

}


const Ticker = () => {


    //Should be responsible for loading and serving the display data to Graph.

    const classes = useStyles();

    const [tickerData, setTickerData] = useState({})
    const [selfDataLoaded, setSelfDataLoaded] = useState(false)

    const [vantageTickerData, setVantageTickerData] = useState({}) //meant to hold the inital back end call to preserve data and not recall each render
    const [vantageTickerDataLoaded, setVantageTickerDataLoaded] = useState(false)
    const [processedVantageData, setProcessedVantageData] = useState([])

    const [selectedTimeFrame, setSelectedTimeFrame] = useState('WEEK')
    const [processedDisplayData, setProcessedDisplayData] = useState([])

    const ticker_name = useParams()
    useEffect(() => { //on load, fetch ticker info from the backend, set ticker data on response and set cutoff date to one week in the past.

        let cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - 7);

        fetchAndReturnDisplayData(ticker_name.ticker_name, cutoff, setTickerData)
            .then((data) => {
                // console.log(data)
                setProcessedDisplayData(data)
                setSelfDataLoaded(true)
            })

        fetchAndReturnVantageData(ticker_name.ticker_name, cutoff, setVantageTickerData)
        .then((data) => {
            // console.log(data)
            setProcessedVantageData(data)
            setVantageTickerDataLoaded(true)
        })
    }, [])


    const handleRangeClick = (e) => {
        setSelectedTimeFrame(e.target.innerText)
    }


    useEffect(() => {
        // let today = new Date()
        console.log('UseEffect Activated Via TimeFrameSelection Changing')
        if (selfDataLoaded) {
            if (selectedTimeFrame === 'WEEK') {
                let cutoff = new Date()
                cutoff.setDate(cutoff.getDate() - 7);
    

                setProcessedDisplayData(processData(cutoff, tickerData))
                setProcessedVantageData(processVantageData(vantageTickerData, cutoff))
                
                
            } else if (selectedTimeFrame === "MONTH") {
                let cutoff = new Date()
                cutoff.setMonth(cutoff.getMonth() - 1);
                
                setProcessedDisplayData(processData(cutoff, tickerData))
                setProcessedVantageData(processVantageData(vantageTickerData, cutoff))
                // let dataToBeGraphed = processData(cutoff, tickerData)
                // setProcessedDisplayData(dataToBeGraphed)
    
            } else if (selectedTimeFrame === "YEAR") {
                let cutoff = new Date()
                cutoff.setFullYear(cutoff.getFullYear() - 1);
                
                setProcessedDisplayData(processData(cutoff, tickerData))
                setProcessedVantageData(processVantageData(vantageTickerData, cutoff))
            }
        }
    }, [selectedTimeFrame])



    // console.log(processedDisplayData)

    return (
        <div>
            {selfDataLoaded ?
                <Graph
                    ticker_name={ticker_name}
                    processedDisplayData={processedDisplayData}
                    processedVantageData={processedVantageData}
                    selectedTimeFrame={selectedTimeFrame}
                    handleRangeClick={handleRangeClick}
                />
                : <img className='loading-spinner' src={spinner} alt='loading spinner'></img>}
        </div >
    )
}

export default Ticker
