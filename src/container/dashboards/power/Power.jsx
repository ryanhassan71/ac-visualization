import React from "react";
import { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Pageheader from "../../../components/common/pageheader/pageheader";
import { Columnwithlabels, Distributed, Negativecolumn } from "../columndata";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Power.css";
import { fetchEnergyGraphData, DAILY_POWER_DATA_INTERVAL } from "../../../acApi";

function Power() {
  const [startDate, setStartDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [weeklyPowerData, setWeeklyPowerData] = useState(null);
  const [dailyPowerData, setDailyPowerData] = useState(null);
  const { powerId } = useParams();

  useEffect(() => {
    // Set the initial title based on the current month and year
    const currentMonth = startDate.toLocaleString("default", { month: "long" });
    const currentYear = startDate.getFullYear();
    setTitle(`${currentMonth} ${currentYear} Power Consumption Data`);

    // Fetch weekly power data on component load
    const fetchDataWeekly = async () => {
      try {
        const response = await fetchEnergyGraphData("weekly", powerId); // Replace "ENERGY_DEVICE_ID" with the appropriate ID
        if (response) {
          setWeeklyPowerData(response); // Store the fetched data in state
        } else {
          console.error("No data received for weekly power consumption");
        }
      } catch (error) {
        console.error("Error fetching weekly power data:", error);
      }
    };

    // Fetch weekly power data on component load
    const fetchDataDaily = async () => {
      try {

        const response = await fetchEnergyGraphData("daily", powerId); // Replace "ENERGY_DEVICE_ID" with the appropriate ID
        if (response) {
          setDailyPowerData(response); // Store the fetched data in state
          
        } else {
          console.error("No data received for daily power consumption");
        }
      } catch (error) {
        console.error("Error fetching daily power data:", error);
      }
    };

    fetchDataWeekly();
    fetchDataDaily();
    const interval = setInterval(() => {
      fetchDataDaily();
    }, DAILY_POWER_DATA_INTERVAL); // 1 hour in milliseconds
  
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  
  }, [powerId]); // Empty dependency array to run only on mount

  const handleDateChange = (date) => {
    setStartDate(date);

    // Update the title when a new date is selected
    const monthName = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    setTitle(`${monthName} ${year} Power Consumption Data`);
  };

  return (
    <Fragment>
      <Pageheader
        currentpage="Power"
        activepage="Apex Charts"
        mainpage="Apex Column Charts"
      />

      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12">
          <div className="box custom-box">
            <div className="box-header flex justify-between items-center">
              <div className="box-title">{title}</div>
              <div className="form-group">
                <div className="input-group !flex-nowrap">
                  <div className="input-group-text text-[#8c9097] dark:text-white/50">
                    <i className="ri-calendar-line"></i>
                  </div>
                  <DatePicker
                    placeholderText="Choose month and year"
                    className="ti-form-input focus:z-10"
                    showIcon
                    selected={startDate}
                    onChange={handleDateChange} // Use the handler
                    dateFormat="MM/yyyy" // Display format
                    showMonthYearPicker // Only month and year selection
                    popperClassName="high-z-index-datepicker" // Apply custom class for z-index
                  />
                </div>
              </div>
            </div>
            <div className="box-body">
              <div id="column-negative">
                <Negativecolumn />
              </div>
            </div>
          </div>
        </div>

        {/* Add two charts side by side */}
        <div className="col-span-12 xl:col-span-4">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">
                Last 7 days Power Consumption Data
              </div>
            </div>
            <div className="box-body">
              <div id="columns-distributed">
                <Distributed data={weeklyPowerData?.data[0]} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-8">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">Power Consumption Today</div>
            </div>
            <div className="box-body">
              <div id="column-datalabels">
              <Columnwithlabels data={dailyPowerData?.data[0]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Power;
