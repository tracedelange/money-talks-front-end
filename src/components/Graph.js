import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, Tooltip, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { ButtonGroup } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    rangebutton: {
        height: '4vmin',
        marginTop: "1vmin"
    },
    selectedbutton: {
        height: '4vmin',
        marginTop: "1vmin",
        color: 'black',
        fontSize: "2vmin"
    },
    Paper: {
        width: "auto",
        height: "auto",
        paddingLeft: "2vmin",
        paddingRight: "2vmin",
        paddingTop: '0.5vmin',
        paddingBottom: '0.5vmin'
    }
}));

//https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript - Coming in clutch again
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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

const CustomTooltip = ({ active, payload, label }) => {

    const classes = useStyles()

	if (active) {
		return (
            <>
            <Paper className={classes.Paper} elevation={5}>
                <h3 className="tool-tip-header">{label}</h3>
                <p>Estimated Outreach:<br/>{numberWithCommas(payload[0]['value'])}</p>
                {payload[1] ? <p>Ticker Price: <br />{(payload[1]['value']).toFixed(2)}</p> : null}
            </Paper>
            </>
		);
	}
	return null;
};

const calculateAverage = (date, array) => {

    let epoch = Date.parse(date)
    let d = new Date(0)
    d.setUTCSeconds(epoch / 1000)

    let pastList = array.filter((item) => Date.parse(item.date) < epoch)
    let past = pastList[pastList.length-1]

    let futureList = array.filter((item) => Date.parse(item.date) > epoch)
    let future = futureList[0]

    if (past !== undefined && future !== undefined) {
        return ((past.avg + future.avg) / 2)
    } else if (past !== undefined){
        return past.avg
    } else if (future !== undefined) {
        return future.avg
    }
}

const Graph = ({processedDisplayData, ticker_name, selectedTimeFrame, handleRangeClick, processedVantageData}) => {
    const classes = useStyles();
    if (processedVantageData.length > 0) {

        Object.keys(processedDisplayData).forEach((item) => {
    
            let mentionDate = processedDisplayData[item]['date']
            let found = processedVantageData.find(item => item['date'] === mentionDate)

            if (found){
                processedDisplayData[item]['avg'] = found['avg']
            } else {
                let recentAvg = calculateAverage(processedDisplayData[item]['date'], processedVantageData)
                processedDisplayData[item]['avg'] = recentAvg
            }
        })
    }
    
    return (
        <>
            <div className='graph-container'>
                <div className='break' />
                <ResponsiveContainer width="90%" height="95%">
                    <LineChart width={1000} height={300} data={(processedDisplayData.sort(dateSort)).reverse()} margin={{ top: 20, right: 0, bottom: 10, left: 50 }}>
                        <CartesianGrid stroke="#ccc" />
                        <XAxis minTickGap={80} dataKey="date" tickCount={5} offset={10} label={{ value: 'Date Range', position: 'insideBottom', offset: -5 }} />
                        <YAxis yAxisId="left" tickFormatter={numberWithCommas} label={{ value: 'Estimated Outreach', angle: -90, position: 'insideLeft', offset: -30 }}/>
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Ticker Price', angle: 90, position: 'insideRight', offset: 8 }} />
                        <Line yAxisId="left" type="monotone" dataKey="estimated_outreach" stroke="red" dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="avg" stroke="blue" dot={false} />
                        <Tooltip content={<CustomTooltip />}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className='graph-options-container'>
                <h3 className='graph-header'>${ticker_name.ticker_name}{processedVantageData.length > 0 ? null : " (Only Mention Data Available)"}</h3>
                <ButtonGroup color="primary" aria-label="outlined primary button group">
                    <Button className={selectedTimeFrame === 'WEEK' ? classes.selectedbutton : classes.rangebutton} onClick={handleRangeClick} name='week'>Week</Button>
                    <Button className={selectedTimeFrame === 'MONTH' ? classes.selectedbutton : classes.rangebutton} onClick={handleRangeClick} name='month'>Month</Button>
                    <Button className={selectedTimeFrame === 'YEAR' ? classes.selectedbutton : classes.rangebutton} onClick={handleRangeClick} name='year'>Year</Button>
                </ButtonGroup>
            </div>
            
        </>
    )
}

export default Graph
