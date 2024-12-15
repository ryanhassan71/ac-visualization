import React, { Fragment } from "react";
import { Chartjsbar } from "./chartjsdata";

const MonthlyPowerChart = ({ monthlyData }) => {
  // Function to process monthly data and split into weeks
  const processMonthlyData = (energyData, timeData) => {
    const weeks = [[], [], [], []]; // Initialize 4 weeks
    const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    let totalWeeks = 0;

    // Divide energy data into weeks based on the time range
    timeData.forEach((date, index) => {
      const day = new Date(date).getDate();

      if (day >= 1 && day <= 7) weeks[0].push(parseFloat(energyData[index]));
      else if (day >= 8 && day <= 14) weeks[1].push(parseFloat(energyData[index]));
      else if (day >= 15 && day <= 21) weeks[2].push(parseFloat(energyData[index]));
      else weeks[3].push(parseFloat(energyData[index]));
    });

    // Calculate the total weeks passed based on data availability
    totalWeeks = weeks.filter((week) => week.length > 0).length;

    // Sum up weekly data for display
    const weeklySums = weeks.map((week) =>
      week.length > 0 ? week.reduce((acc, val) => acc + val, 0) : 0
    );

    // Return only the relevant weeks and labels
    return {
      labels: weekLabels.slice(0, totalWeeks),
      data: weeklySums.slice(0, totalWeeks),
    };
  };

  // Extract energy data and time from monthlyData
  const energyData = monthlyData?.energy_data || [];
  const timeData = monthlyData?.time || [];

  const { labels, data } = processMonthlyData(energyData, timeData);

  // Chart configuration
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          boxWidth: 0,
          color: "#8c9097",
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            return ` ${Math.round(value)} kW/h`; // Round the value and append units
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Weekly Power Consumption (kW/h)",
        data: data,
        backgroundColor: "rgba(91, 44, 111, 0.7)", // Dark Purple with opacity
        borderColor: "rgb(91, 44, 111)", // Solid Dark Purple
        borderWidth: 1,
      },
    ],
  };

  return (
    <Fragment>
      <div className="grid grid-cols-12  mt-0 pt-0">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">

            <div className="box-body">
              {data.length > 0 ? (
                <Chartjsbar option={options} data={chartData} />
              ) : (
                <p>No data available for this month</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MonthlyPowerChart;
