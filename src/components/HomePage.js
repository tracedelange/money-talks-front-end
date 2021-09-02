import React, { useState, useEffect } from 'react'
import { Button, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { InputAdornment } from '@material-ui/core';
import SearchResults from './SearchResults';
import PopularList from "./PopularList"


const useStyles = makeStyles((theme) => ({
    root: {
        width: "50%",
        position: "absolute",
        top: "5vh",
        left: "25%",
    },
    resize: {
        fontSize: "2.5vmin"
    },
    searchButton: {
        position: "absolute",
        backgroundColor: "#a0e6ff;",
        opacity: '0.9',
        fontSize: "2vmin",
        left: "76%",
        top: "5vh",
        height: "6vmin"

    }
}));


const HomePage = ({popular}) => {

    const classes = useStyles();

    const [tickerInput, setTickerInput] = useState('')

    const handleTickerInputChange = (e) => {
        let new_input = e.target.value.toUpperCase().replace(' ', '')
        setTickerInput(new_input)
    }

    const [searchData, setSearchData] = useState({})


    const handleSearchSubmit = (e, searchInput) => {
        e.preventDefault()

        fetch(`http://localhost:9292/tickers/search/${searchInput}`)
            .then(resp => resp.json())
            .then(data => {
                setSearchData(data)
            })
    }

    return (
        <div className='search-page'>
            <form onSubmit={(e) => handleSearchSubmit(e, tickerInput)}>

                <TextField
                    id="outlined-basic"
                    className={classes.root}
                    InputLabelProps={{ className: classes.resize }}
                    InputProps={{
                        className: classes.resize,
                        startAdornment:
                            <InputAdornment position="start">
                                {"$"}
                            </InputAdornment>
                    }}
                    label="Ticker Symbol"
                    variant="outlined"
                    onChange={handleTickerInputChange}
                    value={tickerInput}
                />

                <Button
                    type='submit'
                    className={classes.searchButton}>
                    Search
                </Button>
            </form>

            {searchData.length > 0 ? <SearchResults searchData={searchData} /> : popular ? <PopularList popular={popular} /> : null }

        </div>
    )
}

export default HomePage
