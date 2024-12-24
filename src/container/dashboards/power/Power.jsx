import React from "react";
import { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Pageheader from "../../../components/common/pageheader/pageheader";
import { Columnwithlabels, Distributed, Negativecolumn } from "../columndata";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Power.css";
import {
  fetchEnergyGraphData,
  DAILY_POWER_DATA_INTERVAL,
  fetchStoreList,
} from "../../../acApi";
import * as XLSX from 'xlsx-js-style';


function Power() {
  const [startDate, setStartDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [weeklyPowerData, setWeeklyPowerData] = useState(null);
  const [dailyPowerData, setDailyPowerData] = useState(null);
  const [storeInfo, setStoreInfo] = useState(null);
  const { powerId } = useParams();

  useEffect(() => {
    // Set the initial title based on the current month and year
    const currentMonth = startDate.toLocaleString("default", { month: "long" });
    const currentYear = startDate.getFullYear();
    setTitle(`${currentMonth} ${currentYear} Power Consumption Data`);

    const fetchData = async () => {
      try {
        // Fetch store list and find the store info for the given powerId
        const storeList = await fetchStoreList();
        const matchedStore = storeList.find(
          (store) => store.energy_meter_id === parseInt(powerId)
        );
        setStoreInfo(matchedStore);

        // Fetch weekly power data
        const weeklyResponse = await fetchEnergyGraphData("weekly", powerId);
        setWeeklyPowerData(weeklyResponse);

        // Fetch daily power data
        const dailyResponse = await fetchEnergyGraphData("daily", powerId);
        setDailyPowerData(dailyResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      fetchEnergyGraphData("daily", powerId)
        .then((response) => setDailyPowerData(response))
        .catch((error) => console.error("Error fetching daily power data:", error));
    }, DAILY_POWER_DATA_INTERVAL); // 1 hour in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [powerId]);

  const handleDateChange = (date) => {
    setStartDate(date);

    // Update the title when a new date is selected
    const monthName = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    setTitle(`${monthName} ${year} Power Consumption Data`);
  };

  const exportToExcel = (energyValues, time, fileName) => {
    if (!energyValues || !time) {
      alert("No data to export!");
      return;
    }
  
    // Get current date in dd-mm-yyyy format
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}-${currentDate.getFullYear()}`;
  
    // Define headers
    const headers = [
      { v: storeInfo.store_name, t: "s", s: { font: { bold: true, color: { rgb: "000000" } } } },
      { v: storeInfo.outlet_code, t: "s", s: { font: { bold: true, color: { rgb: "000000" } } } },
    ];

  
    const headers2 = [
      { v: "Date/Time", t: "s", s: { font: { bold: true, color: { rgb: "000000" } } } },
      { v: "Power Consumption (kWh)", t: "s", s: { font: { bold: true, color: { rgb: "000000" } } } },
    ];

  
    // Format time based on whether it's a weekly or daily dataset
    const formattedTime = time.map((t) => {
      // If the time is in "YYYY-MM-DD" format, convert it to "DD-MM-YYYY"
      if (t.includes("-")) {
        const [year, month, day] = t.split("-");
        return `${day}-${month}-${year}`;
      }
      // Otherwise, keep the time as is (e.g., "12 AM", "1 PM")
      return t;
    });
  
    // Add data rows
    const excelRows = energyValues.map((energyData, index) => {
      return [
        { v: formattedTime[index], t: "s" }, // Formatted time
        { v: energyData, t: "s" }, // Energy value
      ];
    });
  
    // Combine headers and data
    const excelData = [headers, headers2, ...excelRows];
  
    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData, {
      skipHeader: true, // This will skip headers in the sheet
    });

  // Define column widths
  worksheet["!cols"] = [
    { wch: 20 }, // Width for the first column (Outlet Name)
    { wch: 15 }, // Width for the second column (Outlet Code)
    { wch: 25 }, // Width for Date/Time
    { wch: 20 }, // Width for Power Consumption
  ]
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
    // Write file with date in name
    XLSX.writeFile(
      workbook,
      `${storeInfo.store_name}_${storeInfo.outlet_code}_${fileName}_${formattedDate}.xlsx`
    );
  };
  
  
  

  return (
    <Fragment>
      <Pageheader
        currentpage={storeInfo ? `${storeInfo.store_name} (${storeInfo.outlet_code})` : "Power"}
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
            <div className="box-header flex justify-between items-center">
            <div className="box-title   !text-[.8rem]">

                Last 7 days Power Consumption Data
              </div>
              <button
                type="button"
                className="ti-btn ti-btn-outline-secondary btn-wave !font-medium    !ms-0  !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none mb-0 !text-[.6rem] "
                onClick={() =>
                  exportToExcel(weeklyPowerData?.data[0]?.energy_data, weeklyPowerData?.data[0]?.time,
                    'WeeklyPowerData'
                  
                  )
                }
              >
                <i className="ri-upload-cloud-line inline-block"></i>Export
              </button>
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
          <div className="box-header flex justify-between items-center">
            <div className="box-title   !text-[.8rem]">

                Power Consumption Today
              </div>
              <button
                type="button"
                className="ti-btn ti-btn-outline-secondary btn-wave !font-medium    !ms-0  !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none mb-0 !text-[.6rem] "
                onClick={() =>
                  exportToExcel(dailyPowerData?.data[0]?.energy_data, dailyPowerData?.data[0]?.time, 'DailyPowerData'
                  
                  )
                }
              >
                <i className="ri-upload-cloud-line inline-block"></i>Export
              </button>
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
