import { useState, useEffect, Fragment, Component } from 'react';
import { useParams } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { fetchTemperatureGraphData, TEMPERATURE_GRAPH_DATA_TIMER } from '../../acApi';
import dayjs from 'dayjs';

// Updated ZoomableTime component to dynamically accept chart data
class ZoomableTime extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [{
        name: 'Temperature Data',
        data: props.data || []
      }],
      options: {
        chart: {
          type: 'area',
          stacked: false,
          height: 320,
          zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: 'zoom'
          },
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler();
            }
          },
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
        },
        title: {
          text: 'Temperature Over Time',
          align: 'left',
          style: {
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#8c9097'
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          },
        },
        grid: {
          borderColor: '#f2f5f7',
        },
        colors: ["#845adf"],
        yaxis: {
          labels: {
            formatter: function (val) {
              return val.toFixed(2);
            },
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: '11px',
              fontWeight: 600,
              cssClass: 'apexcharts-yaxis-label',
            },
          },
          title: {
            text: 'Temperature (°C)',
            style: {
              color: "#8c9097",
              fontSize: '13px',
              fontWeight: 'bold',
            }
          },
        },
        xaxis: {
          type: 'datetime',
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: '11px',
              fontWeight: 600,
              cssClass: 'apexcharts-xaxis-label',
            },
            formatter: function (value) {
              return dayjs(value).format('hh:mm A'); // Formatting the timestamp to show only the time
            }
          },
        },
        tooltip: {
          shared: false,
          x: {
            formatter: function (value) {
              return dayjs(value).format('hh:mm A'); // Formatting the timestamp to show only the time in the tooltip
            }
          },
          y: {
            formatter: function (val) {
              return `${val.toFixed(2)} °C`;
            }
          }
        }
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        series: [{
          name: 'Temperature Data',
          data: this.props.data
        }]
      });
    }
  }

  render() {
    return (
      <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={300} />
    );
  }
}

const AcChart = () => {
  const { acId } = useParams();
  const [chartData, setChartData] = useState([]);
  const [acName, setAcName] = useState()

  // Function to fetch and set chart data
  const fetchAndSetChartData = async () => {
    const data = await fetchTemperatureGraphData(acId);
    if (data && data.length > 0) {
      const acData = data[0]; // Assuming the first element matches the requested AC
      const { name, temperature, time } = acData;
      setAcName(name)

      if (temperature.length && time.length && temperature.length === time.length) {
        const formattedData = temperature.map((temp, index) => {
          const timestamp = new Date(`2024-11-27 ${time[index]}`).getTime(); // Assuming the date is static as per your example
          return [timestamp, parseFloat(temp)];
        });
        
        setChartData(formattedData);
      }
    }
  };

  // Fetch data when the component mounts and set interval to fetch every 15 minutes
  useEffect(() => {
    fetchAndSetChartData();
    const interval = setInterval(fetchAndSetChartData, TEMPERATURE_GRAPH_DATA_TIMER); // 15 minutes

    // Clear interval when component unmounts
    return () => clearInterval(interval);
  }, [acId]);

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">{acName}</div> {/* Display capitalized acId */}
            </div>
            <div className="box-body">
              <div id="zoom-chart-1">
                <ZoomableTime data={chartData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AcChart;
