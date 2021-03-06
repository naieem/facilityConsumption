import React from "react";
import { Line } from "react-chartjs-2";
import { makeStyles } from "@material-ui/core/styles";
import Service from "../service";

const useStyles = makeStyles(theme => ({
  chatContainer: {
    marginTop: 20
  }
}));

export default function Chart() {
  const classes = useStyles();
  /**
   * default demo data for initial load
   */
  let data = {
    labels: [],
    datasets: [
      {
        label: "Consumptions",
        fill: true,
        lineTension: 0.5,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: []
      }
    ]
  };
  let [chartData, setChartData] = React.useState(data);
  /**
   * subscribing for getting chart data
   */
  Service.charDataObservable.subscribe((info)=>{
    
    data.labels=info.labels;
    data.datasets[0].data=info.values;
    setChartData(data);
  });
  return (
    <div className={classes.chatContainer}>
    {chartData.labels.length > 0 && 
      <Line data={chartData} />
    }
    </div>
  );
}
