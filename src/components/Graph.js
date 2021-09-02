import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, Tooltip, YAxis, ResponsiveContainer } from 'recharts';
import { ButtonGroup } from '@material-ui/core';
import { Button } from '@material-ui/core';
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


const Graph = ({processedDisplayData, ticker_name, selectedTimeFrame, handleRangeClick, processedVantageData}) => {

    const classes = useStyles();

    let combinedArray = []

    // Object.keys(processedVantageData).forEach((item) => {
    //     // console.log(processedVantageData[item]['date'])
    //     let vantageDate = processedVantageData[item]['date']
    //     let found = processedDisplayData.find(item => item['date'] === vantageDate)
    //     let i = processedDisplayData.indexOf(found)

    //     processedDisplayData[i]['avg'] = processedVantageData[item]['avg']

    // })

    let average = (processedVantageData.reduce((a, b) => ({avg: a.avg + b.avg})))


    console.log(average)

    Object.keys(processedDisplayData).forEach((item) => {

        let mentionDate = processedDisplayData[item]['date']
        let found = processedVantageData.find(item => item['date'] === mentionDate)
        // let i = processedVantageData.indexOf(found)

        if (found){
            processedDisplayData[item]['avg'] = found['avg']
        } else {
            processedDisplayData[item]['avg'] = (average.avg) / processedVantageData.length
        }
            // processedDisplayData[item]['avg'] = (average['avg']/processedVantageData.length)

    })

    // console.log(processedDisplayData)
    console.log(processedDisplayData)
    
    

    // console.log(combinedArray)

    return (
        <>
            <div className='graph-container'>
                <div className='break' />
                <ResponsiveContainer width="90%" height="95%">
                    <LineChart width={1000} height={300} data={(processedDisplayData.sort(dateSort)).reverse()} margin={{ top: 20, right: 0, bottom: 10, left: 50 }}>
                        <CartesianGrid stroke="#ccc" />
                        <XAxis minTickGap={80} dataKey="date" tickCount={5} offset={10} />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Line yAxisId="left" type="monotone" dataKey="estimated_outreach" stroke="#a0e6ff" dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="avg" stroke="blue" dot={false} />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>


            </div>

            <div className='graph-options-container'>
                <h3 className='graph-header'>${ticker_name.ticker_name}</h3>
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
