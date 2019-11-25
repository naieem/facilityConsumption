import React, { Component } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {withStyles } from "@material-ui/core/styles";
import * as axios from "axios";
import Service from "../service";
const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
});

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: ""
    };
  }
  handleChange = event => {
    this.setState({
      age: event.target.value
    });
  };
  componentDidMount() {
    Service.spinnerObservable.next(true);
    axios
      .get("https://demo-api.greenely.com/v1/facility")
      .then((response)=>{
        Service.spinnerObservable.next(false);
      })
      .catch(function(error) {
        Service.spinnerObservable.next(false);
      })
      .then(()=> {
        Service.spinnerObservable.next(false);
      });
  }
  render() {
    const { classes } = this.props;
    const { age } = this.state;
    const resolution = [
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
    return (
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Resolution</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            onChange={this.handleChange}
          >
            {resolution.map(data => (
              <MenuItem value={data.key}>{data.value}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
}
Filter.prototypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Filter);
