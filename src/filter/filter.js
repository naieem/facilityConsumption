import React, { Component } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import * as axios from "axios";
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
    this.state = {
      resolution: "daily",
      fromDate: new Date(),
      toDate: new Date(),
      facilityId: "",
      disableBtn:true
    };
  }
  handleChange = event => {
    this.setState({
      resolution: event.target.value
    });
  };
  async componentDidMount() {
    await this.getFacilityId();
    this.getConsumptionData();
  }
  getFacilityId() {
    return new Promise(async (resolve, reject) => {
      const facilityData = await axios.get(
        "https://demo-api.greenely.com/v1/facility"
      );
      if (
        facilityData.status === 200 &&
        facilityData.data.data &&
        facilityData.data.data.length
      ) {
        this.setState({
          facilityId: facilityData.data.data[0].id
        });
        Service.spinnerObservable.next(false);
      }
      resolve(true);
    });
  }
  async getConsumptionData() {
    const { resolution, fromDate, toDate, facilityId } = this.state;
    Service.spinnerObservable.next(true);
    const fDate = this.formatDate(fromDate);
    const tDate = this.formatDate(toDate);
    const consumptionData = await axios.get(
      `https://demo-api.greenely.com/v1/facility/${facilityId}/consumption?from=${fDate}&to=${tDate}&resolution=${resolution}`
    );
    if (consumptionData.status === 200) {
      console.log(consumptionData);
      let chartData = this.generateChartData(
        consumptionData.data.data.consumption
      );
      debugger;
      Service.charDataObservable.next(chartData);
      Service.spinnerObservable.next(false);
    }
    debugger;
  }
  formatDate(date) {
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    return date.getFullYear() + "-" + month + "-" + day;
  }
  handleFromDateChange = date => {
    this.setState({
      fromDate: date
    },()=>{
      this.checksearchCriteria();
    });
  };
  handleToDateChange = date => {
    this.setState({
      toDate: date
    },()=>{
      this.checksearchCriteria();
    });
  };
  searchConsumption = () => {
    this.getConsumptionData();
  };
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
  generateMonthlyData(data) {
    let labels = [];
    let values = [];
    debugger;
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
  generateWeeklyData(data) {
    let labels = [];
    let values = [];
    debugger;
    for (const key in data) {
      labels.push(data[key].week_number);
      values.push(data[key].usage || 0);
    }
    return {
      labels: labels,
      values: values
    };
  }
  generateDailyData(data) {
    let labels = [];
    let values = [];
    debugger;
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
  checksearchCriteria() {
    const { resolution, fromDate, toDate } = this.state;
    debugger;
    if(toDate.getTime() > fromDate.getTime()){
      this.setState({
        disableBtn:false
      });
    }
  }
  render() {
    const { classes } = this.props;
    const { resolution, fromDate, toDate,disableBtn } = this.state;

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
