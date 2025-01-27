import { Component } from "react";
import ReactApexChart from "react-apexcharts";
import face4 from "../../../assets/images/faces/4.jpg";
import face15 from "../../../assets/images/faces/15.jpg";
import face11 from "../../../assets/images/faces/11.jpg";
import face8 from "../../../assets/images/faces/8.jpg";
import face9 from "../../../assets/images/faces/9.jpg";
import regularAcIcon from "../../../assets/icons/ac-card/regular-ac.svg";
import bigAcIcon from "../../../assets/icons/ac-card/big-ac.png";

//

export class Totalcustomers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [20, 14, 19, 10, 23, 20, 22, 9, 12],
        },
      ],
      options: {
        colors: ["rgb(132, 90, 223)"],
        chart: {
          type: "line",
          height: 40,
          width: 100,
          sparkline: {
            enabled: true,
          },
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 1.5,
          dashArray: 0,
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.9,
            opacityTo: 0.9,
            stops: [0, 98],
          },
        },
        yaxis: {
          min: 0,
          show: false,
          axisBorder: {
            show: false,
          },
        },
        xaxis: {
          // show: false,
          axisBorder: {
            show: false,
          },
        },
        tooltip: {
          enabled: false,
        },
      },
    };
  }

  render() {
    const { acSensorData, time } = this.props;
    return (
      <div style={{}  }>
        {acSensorData && (
          <>
    <p
    className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] text-right m-0"
    style={{
      textAlign: "right",
      marginBottom: 0,
      whiteSpace: "nowrap", // Prevent wrapping
      textOverflow: "ellipsis", // Add ellipsis for overflow
      
    }}
  >
            {acSensorData.place || "N/A"}
            
          </p>
          <p
    className="text-[#8c9097] dark:text-white/50 text-[0.6rem] text-right m-0 "
    style={{
      textAlign: "right",
      marginBottom: 0,
      whiteSpace: "nowrap", // Prevent wrapping
      textOverflow: "ellipsis", // Add ellipsis for overflow
      
    }}
  >
            {time || "N/A"}
            
          </p>
          </>
          


        )}

<div
  style={{
    display: "flex", // Flex container for horizontal layout
    justifyContent: "right", // Center content horizontally
    // Center content vertically
    marginTop: "10px",
    height: "30px", // Set a specific height for the box
     // Ensure the box spans the full width
  }}
>
  <span
    style={{
      fontSize: "1", // Text size
      fontWeight: "bold", // Bold text
      color: "green", // Text color
      marginRight: "10px", // Add spacing between the two spans
    }}
  >
    {Math.round(acSensorData.power)} kWh

  </span>
  <span
    style={{
      fontSize: "1", // Text size
      fontWeight: "bold", // Bold text
      color: "green", // Text color
    }}
  >
    {acSensorData.ac_remote_temp ? acSensorData.ac_remote_temp : "25"} °C
  </span>
</div>

      </div>
    );
  }
}
//
export class Totalrevenue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [20, 14, 20, 22, 9, 12, 19, 10, 25],
        },
      ],
      options: {
        colors: ["rgb(35, 183, 229)"],
        chart: {
          type: "line",
          height: 40,
          width: 100,
          sparkline: {
            enabled: true,
          },
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 1.5,
          dashArray: 0,
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.9,
            opacityTo: 0.9,
            stops: [0, 98],
          },
        },
        yaxis: {
          min: 0,
          show: false,
          axisBorder: {
            show: false,
          },
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
        },
        tooltip: {
          enabled: false,
        },
      },
    };
  }

  render() {
    return (
      <div style={{ width: 80, height: 40, paddingLeft: 30 }}>
        <img
          src={bigAcIcon}
          alt="AC Icon"
          style={{ width: "200%", height: "100%" }}
        />
      </div>
    );
  }
}

//
export class Conversionratio extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [20, 20, 22, 9, 14, 19, 10, 25, 12],
        },
      ],
      options: {
        colors: ["rgb(38, 191, 148)"],
        chart: {
          type: "line",
          height: 40,
          width: 100,
          sparkline: {
            enabled: true,
          },
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 1.5,
          dashArray: 0,
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.9,
            opacityTo: 0.9,
            stops: [0, 98],
          },
        },

        yaxis: {
          min: 0,
          show: false,
          axisBorder: {
            show: false,
          },
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
        },
        tooltip: {
          enabled: false,
        },
      },
    };
  }

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={40}
          width={100}
        />
      </div>
    );
  }
}
//
export class Totaldeals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Value",
          data: [20, 20, 22, 9, 12, 14, 19, 10, 25],
        },
      ],
      options: {
        colors: ["rgb(245, 184, 73)"],
        chart: {
          type: "line",
          height: 40,
          width: 100,
          sparkline: {
            enabled: true,
          },
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 1.5,
          dashArray: 0,
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.9,
            opacityTo: 0.9,
            stops: [0, 98],
          },
        },
        yaxis: {
          min: 0,
          show: false,
          axisBorder: {
            show: false,
          },
        },
        xaxis: {
          // show: false,
          axisBorder: {
            show: false,
          },
        },
        tooltip: {
          enabled: false,
        },
      },
    };
  }

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={40}
          width={100}
        />
      </div>
    );
  }
}
// revenueanalytics
export class Revenueanalytics extends Component {
  constructor(props) {
    super(props);

    // Store data in a dictionary
    const storeData = {
      D062: {
        2024: [
          { x: "Jan", y: 39120 },
          { x: "Feb", y: 44100 },
          { x: "Mar", y: 50760 },
          { x: "Apr", y: 68220 },
          { x: "May", y: 70500 },
          { x: "Jun", y: 81060 },
          { x: "Jul", y: 63600 },
          { x: "Aug", y: 64740 },
          { x: "Sep", y: 71220 },
          { x: "Oct", y: 71700 },
          { x: "Nov", y: 68520 },
          { x: "Dec", y: 68520 },
        ],
        2023: [
          { x: "Jan", y: 34320 },
          { x: "Feb", y: 41280 },
          { x: "Mar", y: 44280 },
          { x: "Apr", y: 54120 },
          { x: "May", y: 54480 },
          { x: "Jun", y: 59340 },
          { x: "Jul", y: 65640 },
          { x: "Aug", y: 66240 },
          { x: "Sep", y: 76560 },
          { x: "Oct", y: 65580 },
          { x: "Nov", y: 53280 },
          { x: "Dec", y: 42600 },
        ],
        2025: [
          { x: "Jan", y: props.currentMonth }, // Add January 2025 data
          { x: "Feb", y: 0 },
          { x: "Mar", y: 0},
          { x: "Apr", y: 0 },
          { x: "May", y: 0 },
          { x: "Jun", y: 0 },
          { x: "Jul", y: 0 },
          { x: "Aug", y: 0 },
          { x: "Sep", y: 0 },
          { x: "Oct", y: 0 },
          { x: "Nov", y: 0 },
          { x: "Dec", y: 0 },
        ],
      },
      D076: {
        2024: [
          { x: "Jan", y: 34359 },
          { x: "Feb", y: 35912 },
          { x: "Mar", y: 34965 },
          { x: "Apr", y: 49230 },
          { x: "May", y: 46485 },
          { x: "Jun", y: 56409 },
          { x: "Jul", y: 50568 },
          { x: "Aug", y: 51459 },
          { x: "Sep", y: 56112 },
          { x: "Oct", y: 50420 },
          { x: "Nov", y: 47918 },
          { x: "Dec", y: 47918 },
        ],
        2023: [
          { x: "Jan", y: 34755 },
          { x: "Feb", y: 35784 },
          { x: "Mar", y: 43843 },
          { x: "Apr", y: 47153 },
          { x: "May", y: 45074 },
          { x: "Jun", y: 42436 },
          { x: "Jul", y: 52697 },
          { x: "Aug", y: 56382 },
          { x: "Sep", y: 47877 },
          { x: "Oct", y: 50627 },
          { x: "Nov", y: 42248 },
          { x: "Dec", y: 37253 },
        ],
        2025: [
          { x: "Jan", y: props.currentMonth }, // Add January 2025 data
          { x: "Feb", y: 0 },
          { x: "Mar", y: 0},
          { x: "Apr", y: 0 },
          { x: "May", y: 0 },
          { x: "Jun", y: 0 },
          { x: "Jul", y: 0 },
          { x: "Aug", y: 0 },
          { x: "Sep", y: 0 },
          { x: "Oct", y: 0 },
          { x: "Nov", y: 0 },
          { x: "Dec", y: 0 },
        ],
      },
    };

    // Determine the store based on the prop (default to D062 if not provided)
    const outletCode = props.outletCode;

    this.state = {
      series: [
        {
          type: "line",
          name: "2025",
          data: storeData[outletCode]?.[2025] || [],
        },
        {
          type: "line",
          name: "2024",
          data: storeData[outletCode]?.[2024] || [],
        },
        {
          type: "line",
          name: "2023",
          data: storeData[outletCode]?.[2023] || [],
        },
      ],
      options: {
        chart: {
          height: 350,
          animations: {
            speed: 500,
          },
          dropShadow: {
            enabled: true,
            top: 8,
            left: 0,
            blur: 3,
            color: "#000",
            opacity: 0.1,
          },
          toolbar: {
            tools: {
              download: true, // Enable download button
              selection: true, // Enable selection tool
              zoom: true, // Enable zoom tool
              zoomin: true, // Enable zoom-in button
              zoomout: true, // Enable zoom-out button
              pan: true, // Enable pan functionality
              reset: true, // Enable reset button
            },
          },
        },
        colors: [
          "rgb(255, 99, 132)", // Color for 2025
          "rgb(132, 90, 223)", // Color for 2024
          "rgba(35, 183, 229, 0.85)", // Color for 2023
        ],
        dataLabels: {
          enabled: false,
        },
        grid: {
          borderColor: "#f1f1f1",
          strokeDashArray: 3,
        },
        stroke: {
          curve: "smooth",
          width: [2, 2, 2],
        },
        xaxis: {
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value + " kWh";
            },
          },
        },
        tooltip: {
          y: [
            {
              formatter: function (e) {
                return e ? e.toFixed(0) + " kWh" : e;
              },
            },
          ],
        },
        legend: {
          show: true,
          customLegendItems: ["2025", "2024", "2023"],
          inverseOrder: true,
        },
        title: {
          text: "Yearly comparison",
          align: "left",
          style: {
            fontSize: ".8125rem",
            fontWeight: "semibold",
            color: "#8c9097",
          },
        },
        markers: {
          hover: {
            sizeOffset: 5,
          },
        },
      },
    };
  }

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={350}
        />
      </div>
    );
  }
}




//
//ProfitEarned
export class Profitearned extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Profit Earned",
          data: [44, 42, 57, 86, 58, 55, 70],
        },
        {
          name: "Total Sales",
          data: [34, 22, 37, 56, 21, 35, 60],
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 180,
          toolbar: {
            show: false,
          },
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
        },
        grid: {
          borderColor: "#f1f1f1",
          strokeDashArray: 3,
        },
        colors: ["rgb(132, 90, 223)", "#e4e7ed"],
        plotOptions: {
          bar: {
            colors: {
              ranges: [
                {
                  from: -100,
                  to: -46,
                  color: "#ebeff5",
                },
                {
                  from: -45,
                  to: 0,
                  color: "#ebeff5",
                },
              ],
            },
            columnWidth: "60%",
            borderRadius: 5,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: undefined,
        },
        legend: {
          show: false,
          position: "top",
        },
        yaxis: {
          title: {
            style: {
              color: "#adb5be",
              fontSize: "13px",
              fontFamily: "poppins, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
          labels: {
            formatter: function (y) {
              return y.toFixed(0) + "";
            },
          },
        },
        xaxis: {
          type: "week",
          categories: ["S", "M", "T", "W", "T", "F", "S"],
          axisBorder: {
            show: true,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: true,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            width: 6,
            offsetX: 0,
            offsetY: 0,
          },
          labels: {
            rotate: -90,
          },
        },
      },
    };
  }

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={180}
        />
      </div>
    );
  }
}
//Leads by Source

export class Sourcedata extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [32, 27, 25, 16],
      options: {
        labels: ["My First Dataset"],
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
          height: 260,
          type: "donut",
        },
        dataLabels: {
          enabled: false,
        },

        legend: {
          show: false,
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "round",
          colors: ["#fff"],
          width: 0,
          dashArray: 0,
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "82%",
              labels: {
                show: false,
                name: {
                  show: true,
                  fontSize: "20px",
                  color: "#495057",
                  offsetY: -4,
                },
                value: {
                  show: true,
                  fontSize: "18px",
                  color: undefined,
                  offsetY: 8,
                  formatter: function (val) {
                    return val + "%";
                  },
                },
              },
            },
          },
        },
        colors: [
          "rgb(132, 90, 223)",
          "rgb(35, 183, 229)",
          "rgb(245, 184, 73)",
          "rgb(38, 191, 148)",
        ],
      },
    };
  }

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="donut"
          height={260}
        />
      </div>
    );
  }
}

export class Profit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [48],
      options: {
        chart: {
          height: 127,
          width: 100,
          type: "radialBar",
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            },
          },
        },
        colors: ["rgba(255,255,255,0.9)"],
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 0,
              size: "55%",
              background: "#fff",
            },
            dataLabels: {
              name: {
                offsetY: -10,
                color: "#4b9bfa",
                fontSize: ".625rem",
                show: false,
              },
              value: {
                offsetY: 5,
                color: "#4b9bfa",
                fontSize: ".875rem",
                show: true,
                fontWeight: 600,
              },
            },
          },
        },
        stroke: {
          lineCap: "round",
        },
        labels: ["Status"],
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="radialBar"
          width={100}
          height={127}
        />
      </div>
    );
  }
}
// Deals Statistics

export const Dealsstatistics = [
  {
    id: "1",
    src: face4,
    name: "Mayor Kelly",
    role: "Manufacture",
    mail: "mayorkelly@gmail.com",
    location: "Germany",
    date: "Sep 15 - Oct 12, 2023",
    color: "info",
    checked: "",
  },
  {
    id: "2",
    src: face15,
    name: "Andrew Garfield",
    role: "Development",
    mail: "andrewgarfield@gmail.com",
    location: "Canada",
    date: "Apr 10 - Dec 12, 2023",
    color: "primary",
    checked: "defaultChecked",
  },
  {
    id: "3",
    src: face11,
    name: "Simon Cowel",
    role: "Service",
    mail: "simoncowel234@gmail.com",
    location: "Europe",
    date: "Sep 15 - Oct 12, 2023",
    color: "danger",
    checked: "",
  },
  {
    id: "4",
    src: face8,
    name: "Mirinda Hers",
    role: "Marketing",
    mail: "mirindahers@gmail.com",
    location: "USA",
    date: "Apr 14 - Dec 14, 2023",
    color: "warning",
    checked: "defaultChecked",
  },
  {
    id: "5",
    src: face9,
    name: "Jacob Smith",
    role: "Social Plataform",
    mail: "jacobsmith@gmail.com",
    location: "Singapore",
    date: "Feb 25 - Nov 25, 2023",
    color: "success",
    checked: "defaultChecked",
  },
];

export const AcIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8 16a3 3 0 0 1 -3 3" />
    <path d="M16 16a3 3 0 0 0 3 3" />
    <path d="M12 16v4" />
    <path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
    <path d="M7 13v-3a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v3" />
  </svg>
);
