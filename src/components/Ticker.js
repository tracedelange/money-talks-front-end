import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import spinner from '../assets/loading.gif'
import Graph from './Graph';
// import keys from '../secret'

const finKey = process.env.REACT_APP_FINKEY

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

    if (vantageData['resultsCount'] > 0){
        let displayData = []
        let dateArray = []
    
        Object.keys(vantageData['results']).forEach((item) => {
    
            let mention_date = vantageData['results'][item]['t']
    
            if ((mention_date) > cutoffDate.getTime()) {
    
                let avg = (parseFloat(vantageData['results'][item]['h']) + parseFloat(vantageData['results'][item]['l']))
                let vd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                vd.setUTCSeconds((vantageData['results'][item]['t']) / 1000);
    
                let displayItem = {
                    'date': vd.toISOString().split('T')[0],
                    'avg': parseFloat((avg.toFixed(2)) / 2)
                }
                displayData.push(displayItem)
    
                let d = new Date(0)
                d.setUTCSeconds(mention_date / 1000)
                dateArray.push(d.toISOString().split('T')[0])
    
            }
        })
        return displayData

    } else {
        return {}
    }
}

const fetchAndReturnDisplayData = (ticker, cutoff, setTickerData) => {

    return fetch(`https://money-talks-sinatra-api.herokuapp.com/tickers/name/${ticker}`)
        .then(resp => resp.json())
        .then(data => {
            setTickerData(data)
            let dataToBeGraphed = processData(cutoff, data)
            return dataToBeGraphed
        })
}

const fetchAndReturnVantageData = (ticker, cutoff, setVantageTickerData) => {

    let d = new Date()
    let today = d.toISOString().split('T')[0]
    let yearAgo = d.setFullYear(d.getFullYear() - 1);

    let ly = new Date(0)
    ly.setUTCSeconds(yearAgo / 1000)

    return fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${ly.toISOString().split('T')[0]}/${today}?adjusted=true&sort=asc&limit=1000&apiKey=${process.env.REACT_APP_FINKEY}`)
        .then(resp => resp.json())
        .then(data => {

            if (data.status === "ERROR") {
                return 'error'
            }
            console.log(data)
            setVantageTickerData(data) //save the data so when resolution is changed no re-render occurs
            let toBeGraphed = processVantageData(data, cutoff)
            return toBeGraphed
        })
}

const Ticker = () => {

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
                setProcessedDisplayData(data)
                setSelfDataLoaded(true)
            })

        fetchAndReturnVantageData(ticker_name.ticker_name, cutoff, setVantageTickerData)
            .then((data) => {
                if (data === 'error') {
                    alert('Rate Limit Exceeded, Please wait 1 minute and try again.')
                } else {
                    setProcessedVantageData(data)
                    setVantageTickerDataLoaded(true)
                }
            })
    }, [])

    const handleRangeClick = (e) => {
        setSelectedTimeFrame(e.target.innerText)
    }

    useEffect(() => {
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
            } else if (selectedTimeFrame === "YEAR") {
                let cutoff = new Date()
                cutoff.setFullYear(cutoff.getFullYear() - 1);

                setProcessedDisplayData(processData(cutoff, tickerData))
                setProcessedVantageData(processVantageData(vantageTickerData, cutoff))
            }
        }
    }, [selectedTimeFrame])

    return (
        <div>
            {selfDataLoaded && vantageTickerDataLoaded ?
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
