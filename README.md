<!-- # Money Talks - Sinatra API -->


<!-- PROJECT LOGO -->
<br />
<p align="center">
<img src='./src/assets/bfb.png' alt='Project Logo' style="margin-right: 10%; width: 30%; height:auto">
  <!-- <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

  <h3 align="center">Money Talks - React Frontend</h3>

  <p align="center">
    Frontend application designed with react to fetch and display data collected from a Twitter scraper and served by a Sinatra API.
    <br />
  </p>
</p>

<!-- ABOUT THE PROJECT -->
## About The Project
This repo contains the code for the front-end client associated with the Money-Talks project. The front-end client is responsible for accessing a Sinatra API which serves financial market data scraped from Twitter.

There is a specific subset of users on Twitter who monitor, analyze and comment on various tradable stock market assets. These users have a wide range of followers ranging from 10-40 followers to several hundred thousand followers. The Money-Talks projects aims at scraping tweets from these users and tracking the relative mention frequency of tradable stock market "Tickers".

The primary metric used to track tickers is the "Estimated Outreach" of a particular ticker on a particular day. The estimated outreach of a ticker is the combined sum of mentions by each user multiplied by the number of followers each particular user has. If a ticker symbol is mentioned ten times by a user with ten followers, the estimated outreach for that ticker on that day would be 100. If a user with one million followers mentioned the same ticker later that day (Think Elon Musk Tweeting Dogecoin memes...) the estimated outreach of that ticker on that day would increase to 1,000,100, the sum of the two users.

The front-end client is responsible for accessing and graphing estimated outreach for tickers over time. For ticker symbols which are actually tradable, the front-end client will display historical prices of that ticker symbol and superimpose it onto the graph for comparison.

When first visiting the site, a call is made to the sinatra API to display a list of the tickers with the highest sum outreach over the last week, giving a quick view on which tickers are being talked about right now.

The goal of this project was to determine the correlation, if any, between the value of a tradable asset and the chatter or "hype" behind it. There are several examples in the dataset where you can see stock prices and mentions increase together in a very short time-span. It's out of my league to determine if chatter inspires market change or if market change inspires chatter, but the data is interesting nonetheless. 

The Money-Talks front-end client was developed with React and can be visited <a href='https://money-talks-front-end.herokuapp.com/'>here.</a>


## Sister Repos:

 * [Twitter Scraper](https://github.com/tracedelange/money-talks-twitter-scrape)
 * [Sinatra API](https://github.com/tracedelange/money-talks-sinatra)


### Built With

* [Ruby](https://www.ruby-lang.org/en/)
* [Sinatra](http://sinatrarb.com/)
* [ActiveRecord](https://guides.rubyonrails.org/active_record_basics.html)
* [Postgresql](https://www.postgresql.org/)
* [Heroku](https://id.heroku.com/login)



<!-- GETTING STARTED -->
## Access

The front-end site can be accessed [here](https://money-talks-front-end.herokuapp.com/)


<!-- CONTACT -->
## Contact

Trace DeLange - [LinkedIn](linkedin.com/in/trace-delange-991067169) - tracedelange@me.com

Project Link: [Money-Talks-Sinatra](https://github.com/tracedelange/money-talks-front-end)

Want to learn more about this project? Check out [my blog](https://tracedelange.github.io/)
