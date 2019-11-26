import React, { Component } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Service from "../service";
const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  DatePicker: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10
  },
  searchBtn: {
    marginTop: 20,
    marginLeft: 10
  }
});
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const resolutionType = [
  {
    key: "daily",
    value: "Daily"
  },
  {
    key: "weekly",
    value: "Weekly"
  },
  {
    key: "monthly",
    value: "Monthly"
  }
];
class Filter extends Component {
  constructor(props) {
    super(props);
    /**
     * By default set the from address to 1 month back from current date
     */
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth()-1);
    this.state = {
      resolution: "daily",
      fromDate: currentDate,
      toDate: new Date(),
      facilityId: "",
      disableBtn: true
    };
  }
  /**
   * handling resolution dropdown
   */
  handleChange = event => {
    this.setState(
      {
        resolution: event.target.value
      },
      () => {
        this.checksearchCriteria();
      }
    );
  };
  async componentDidMount() {
    await this.getFacilityId();
    this.getConsumptionData();
  }
  /**
   * getting facility id 
   */
  getFacilityId() {
    return new Promise(async (resolve, reject) => {
      const facilityId = await Service.getFacilityId();
      
      if (facilityId ) {
        this.setState({
          facilityId: facilityId
        });
        Service.spinnerObservable.next(false);
        resolve(true);
      }else
      resolve(false);
    });
  }
  /**
   * getting all consumption data
   */
  async getConsumptionData() {
    const { resolution, fromDate, toDate, facilityId } = this.state;
    Service.spinnerObservable.next(true);
    const fDate = this.formatDate(fromDate); // formatting date according to api acceptance
    const tDate = this.formatDate(toDate); // formatting date according to api acceptance
    const consumptionData = await Service.getConsumptionData(facilityId,fDate,tDate,resolution);
    if (consumptionData.status === 200) {
      let chartData = this.generateChartData(
        consumptionData.data.data.consumption
      );
      
      Service.charDataObservable.next(chartData); // setting chart data
      Service.spinnerObservable.next(false); // spinner off
    }
    
  }
  /**
   * formatting date as per api acceptance
   * @param {*} date 
   * @return year-month-day 
   */
  formatDate(date) {
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    return date.getFullYear() + "-" + month + "-" + day;
  }
  /**
   * handles from date changing action
   */
  handleFromDateChange = date => {
    this.setState(
      {
        fromDate: date
      },
      () => {
        this.checksearchCriteria();
      }
    );
  };
  /**
   * handles to date changing action
   */
  handleToDateChange = date => {
    this.setState(
      {
        toDate: date
      },
      () => {
        this.checksearchCriteria();
      }
    );
  };
  /**
   * handles search button click event
   */
  searchConsumption = () => {
    this.getConsumptionData();
  };
  /**
   * generates chart data from api data
   * @param {*} data 
   */
  generateChartData(data) {
    const { resolution } = this.state;
    let info = {};
    switch (resolution) {
      case "daily":
        info = this.generateDailyData(data);
        break;
      case "weekly":
        info = this.generateWeeklyData(data);
        break;
      case "monthly":
        info = this.generateMonthlyData(data);
        break;
      default:
        break;
    }
    return info;
  }
  /**
   * generates monthly filtered data
   * @param {*} data 
   */
  generateMonthlyData(data) {
    let labels = [];
    let values = [];
    
    for (const key in data) {
      let date = new Date(data[key].localtime);
      let month = months[date.getMonth()];
      labels.push(month);
      values.push(data[key].usage || 0);
    }
    return {
      labels: labels,
      values: values
    };
  }
  /**
   * generates weekly filtered data
   * @param {*} data 
   */
  generateWeeklyData(data) {
    let labels = [];
    let values = [];
    
    for (const key in data) {
      labels.push(data[key].week_number);
      values.push(data[key].usage || 0);
    }
    return {
      labels: labels,
      values: values
    };
  }
  /**
   * generates daily filtered data
   * @param {*} data 
   */
  generateDailyData(data) {
    let labels = [];
    let values = [];
    
    for (const key in data) {
      let date = new Date(data[key].localtime);
      let day = date.getDate();
      labels.push(day);
      values.push(data[key].usage || 0);
    }
    return {
      labels: labels,
      values: values
    };
  }
  /**
   * validation check on date change and dropdown change while searching
   */
  checksearchCriteria() {
    const { resolution, fromDate, toDate } = this.state;
    this.setState({
      disableBtn: true
    });
    let toDateTime = toDate.getTime();
    let frmDateTime = fromDate.getTime();
    if (toDateTime > frmDateTime) {
      switch (resolution) {
        case "daily":
          this.searchButtonValidator(3, 1);
          break;
        case "weekly":
          this.searchButtonValidator(3, 3);
          break;
        case "monthly":
          this.searchButtonValidator(12, 12);
          break;
        default:
          break;
      }
    }
  }
  /**
   * generic function for validating button status
   * @param {*} monthLimit
   * @param {*} diffRangeInMonth 
   */
  searchButtonValidator(monthLimit, diffRangeInMonth) {
    const { fromDate, toDate } = this.state;
    let comparedDate = new Date();
    comparedDate.setMonth(comparedDate.getMonth() - monthLimit);
    let comparedDateTime = comparedDate.getTime();

    let newFrmDate = new Date(fromDate.getTime());
    let newToDate = new Date(toDate.getTime());
    
    let frmDateTime = newFrmDate.getTime();
    if (frmDateTime >= comparedDateTime) {
      newToDate.setMonth(newToDate.getMonth() - diffRangeInMonth);
      if (frmDateTime >= newToDate.getTime()) {
        this.setState({
          disableBtn: false
        });
      }
    }
  }
  render() {
    const { classes } = this.props;
    const { resolution, fromDate, toDate, disableBtn } = this.state;

    return (
      <div>
        {/* from date */}
        <FormControl className={classes.DatePicker}>
          <DatePicker
            selected={fromDate}
            onChange={this.handleFromDateChange}
          />
          <InputLabel>From Date</InputLabel>
        </FormControl>
        {/* to date */}
        <FormControl className={classes.DatePicker}>
          <DatePicker selected={toDate} onChange={this.handleToDateChange} />
          <InputLabel>End Date</InputLabel>
        </FormControl>
        {/* Resolution */}
        <FormControl className={classes.formControl}>
          <InputLabel>Resolution</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={resolution}
            onChange={this.handleChange}
          >
            {resolutionType.map(data => (
              <MenuItem key={data.key} value={data.key}>
                {data.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* search button */}
        <Button
          disabled={disableBtn}
          className={classes.searchBtn}
          variant="contained"
          color="primary"
          onClick={this.searchConsumption}
        >
          Search
        </Button>
      </div>
    );
  }
}
Filter.prototypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Filter);
