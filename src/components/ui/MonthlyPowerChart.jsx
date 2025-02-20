import React, { Fragment } from "react";
import { Chartjsbar } from "./chartjsdata";

const MonthlyPowerChart = ({ monthlyData }) => {
  // Function to process monthly data and split into weeks
  const processMonthlyData = (energyData, timeData) => {
    // If there's no data, just return empty results
    if (!timeData.length) {
      return {
        labels: [],
        data: []
      };
    }
  
    // Identify the first date to find which month and year we are in
    const firstDate = new Date(timeData[0]);
    const currentMonth = firstDate.toLocaleString("default", { month: "short" });
    const currentYear = firstDate.getFullYear();
  
    // Use a Date trick to get the total days in the current month
    // new Date(year, monthIndex + 1, 0) will result in the last day
    // of the specified month
    const daysInMonth = new Date(currentYear, firstDate.getMonth() + 1, 0).getDate();
  
    // Prepare four arrays to hold the values for each "week-like" segment
    const weeks = [[], [], [], []];
  
    // Define the week labels dynamically
    const weekLabels = [
      `${currentMonth} 1-7`,
      `${currentMonth} 8-14`,
      `${currentMonth} 15-21`,
      // The final range ends at daysInMonth rather than 31
      `${currentMonth} 22-${daysInMonth}`
    ];
  
    // Loop through each timestamp and bucket its energy value into the correct segment
    timeData.forEach((dateString, index) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const energyVal = parseFloat(energyData[index]) || 0;
  
      if (day >= 1 && day <= 7) {
        weeks[0].push(energyVal);
      } else if (day >= 8 && day <= 14) {
        weeks[1].push(energyVal);
      } else if (day >= 15 && day <= 21) {
        weeks[2].push(energyVal);
      } else if (day >= 22 && day <= daysInMonth) {
        weeks[3].push(energyVal);
      }
    });
  
    // Sum up each bucket, defaulting to 0 if empty
    const weeklySums = weeks.map((bucket) =>
      bucket.length ? bucket.reduce((acc, val) => acc + val, 0) : 0
    );
  
    // Return labels and sums
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
