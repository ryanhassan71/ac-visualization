import React, { Fragment } from "react";
import { Chartjsbar } from "./chartjsdata";

const MonthlyPowerChart = ({ monthlyData }) => {
  // Function to process monthly data and split into weeks
  const processMonthlyData = (energyData, timeData) => {
    // We'll track four arrays: one for each week's worth of data
    const weeks = [[], [], [], []];

    // Figure out the month name from the first timestamp (if present)
    const currentMonth = timeData.length > 0
      ? new Date(timeData[0]).toLocaleString("default", { month: "short" })
      : "";

    // Always define four labels
    const weekLabels = [
      `${currentMonth} 1-7`,
      `${currentMonth} 8-14`,
      `${currentMonth} 15-21`,
      `${currentMonth} 22-31`
    ];

    // Loop through each timestamp and bucket its energy value into the right week
    timeData.forEach((date, index) => {
      const day = new Date(date).getDate();
      const energyVal = parseFloat(energyData[index]);

      if (day >= 1 && day <= 7) {
        weeks[0].push(energyVal);
      } else if (day >= 8 && day <= 14) {
        weeks[1].push(energyVal);
      } else if (day >= 15 && day <= 21) {
        weeks[2].push(energyVal);
      } else {
        weeks[3].push(energyVal);
      }
    });

    // Compute sum of each week's data
    // If a week had no data, the sum is 0
    const weeklySums = weeks.map((week) =>
      week.length > 0 ? week.reduce((acc, val) => acc + val, 0) : 0
    );

    // Return four labels + the four sums
    return {
      labels: weekLabels,
      data: weeklySums
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
            return ` ${Math.round(value)} kW/h`; // Round and append units
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
        borderColor: "rgb(91, 44, 111)",           // Solid Dark Purple
        borderWidth: 1,
        // Optionally tweak bar width to make single bars look larger
        // barPercentage: 0.9,
        // categoryPercentage: 0.9
      },
    ],
  };

  return (
    <Fragment>
      <div className="grid grid-cols-12 mt-0 pt-0">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-body">
              {data.some((val) => val !== 0) ? (
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
