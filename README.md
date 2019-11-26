## Goal
The Goal of this project is to render consumption history of customer in a chart.
Here customer can filter his/her consumption data by selecting filter criteria.

### Filter
Two filters are added here.One is date filter and other is resolution filter. So clients can filter according to their will.

Validation is added in filter.The logic behind that follows the below.

There are a few restrictions to date ranges depending on the selected resolution.

* For 'daily' resolution:
The oldest historical data that can be requested is 3 months old
The maximum allowed date range between the from and to parameters is 1 month
* For 'weekly' resolution:
The oldest historical data that can be requested is 3 months old
The maximum allowed date range between the from and to parameters is 3 months
* For 'monthly' resolution:
The oldest historical data that can be requested is 12 months old
The maximum allowed date range between the from and to parameters is 12 months

So no one will get any data if the filter is not set.

** Initially 1 months data will be loaded in the chart which is the last 1 month from current date.

## Libraries Used Here:
* React
* Chartjs
* RxJs
* Axios
* Material UI
* React Datepicker
* Enzyme

## Available Scripts

In the project directory, you can run:

### `npm i`

To install all the dependencies.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run test`

To run test file.You can update test file 'App.test.js'
