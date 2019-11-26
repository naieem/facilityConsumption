import React from "react";
import "./App.css";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import Header from "./header";
import Filter from "./filter/filter";
import * as axios from 'axios';
import Service from "./service";
import Chart from "./chart";
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = 'Bearer LWgUxt7aMmyQuoEWUxlcUPbfUpRpVM';

function App() {
  const [spinnerStatus, setspinnerStatus] = React.useState(false);
  Service.spinnerObservable.subscribe((decision)=>{
    setspinnerStatus(decision);
  });
  return (
    <React.Fragment>
      <Container fixed>
      {spinnerStatus && 
      <LinearProgress color="secondary" />
      }
        <Header></Header>
        <Filter></Filter>        
        <Chart></Chart>
      </Container>
    </React.Fragment>
  );
}

export default App;
