import React from "react";
import { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Pageheader from "../../../components/common/pageheader/pageheader";
import { Columnwithlabels, Distributed, Negativecolumn } from "../columndata";
import { Revenueanalytics } from "../crm/crmdata";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Power.css";
import {
  fetchEnergyGraphData,
  DAILY_POWER_DATA_INTERVAL,
  fetchStoreList,
  fetchMonthlyEnergyData,
  fetchPowerParameters,
} from "../../../acApi";
import * as XLSX from "xlsx-js-style";
import { Link } from "react-router-dom";
import store from "../../../redux/store";

function Power() {
  const [startDate, setStartDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [weeklyPowerData, setWeeklyPowerData] = useState(null);
  const [dailyPowerData, setDailyPowerData] = useState(null);
  const [monthlyPowerData, setMonthlyPowerData] = useState(null);
  const [storeInfo, setStoreInfo] = useState(null);
  const [currentTotal, setCurrentTotal] = useState(0); // Add state for total
  const [powerParams, setPowerParams] = useState(null);
  const { storeId, powerId } = useParams();
  // Compare selected month/year to current
  const selectedMonth = startDate.getMonth();
  const selectedYear = startDate.getFullYear();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const isCurrentMonth =
    selectedMonth === currentMonth && selectedYear === currentYear;

  const selectedMonthName = startDate.toLocaleString("default", {
    month: "short",
  });
  const monthlyLabel = isCurrentMonth
    ? "This Month (as of today)"
    : `${selectedMonthName} ${selectedYear}`;

  useEffect(() => {
    // Calculate the total whenever monthlyPowerData changes

    setCurrentTotal(0);
  }, [powerId]);

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
        .catch((error) =>
          console.error("Error fetching daily power data:", error)
        );
    }, DAILY_POWER_DATA_INTERVAL); // 1 hour in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [powerId]);

  useEffect(() => {
    // Fetch monthly power data based on the selected month and year
    const fetchData = async () => {
      const monthlyResponse = await fetchMonthlyEnergyData(
        powerId,
        startDate.getMonth() + 1, // Months are 0-indexed
        startDate.getFullYear()
      );

      setMonthlyPowerData(monthlyResponse);
    };

    fetchData();
  }, [powerId]);

  useEffect(() => {
    // Call fetchPowerParameters when storeId is available
    if (storeId) {
      const getPowerParams = async () => {
        try {
          const response = await fetchPowerParameters(storeId);
          setPowerParams(response);
        } catch (error) {
          console.error("Error fetching power parameters:", error);
        }
      };
      getPowerParams();
    }
  }, [storeId]);

  const handleDateChange = async (date) => {
    setStartDate(date);

    const month = date.getMonth() + 1; // Months are 0-indexed
    const year = date.getFullYear();

    // Update the title
    const monthName = date.toLocaleString("default", { month: "long" });
    setTitle(`${monthName} ${year} Power Consumption Data`);

    // Fetch monthly data
    try {
      const monthlyResponse = await fetchMonthlyEnergyData(
        powerId,
        month,
        year
      );

      setMonthlyPowerData(monthlyResponse);
    } catch (error) {
      console.error("Error fetching monthly power data:", error);
    }
  };

  const exportToExcel = (energyValues, time, fileName) => {
    if (!energyValues || !time) {
      alert("No data to export!");
      return;
    }

    // Get current date in dd-mm-yyyy format
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(
      2,
      "0"
    )}-${String(currentDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${currentDate.getFullYear()}`;

    // Define headers
    const headers = [
      {
        v: storeInfo.store_name,
        t: "s",
        s: { font: { bold: true, color: { rgb: "000000" } } },
      },
      {
        v: storeInfo.outlet_code,
        t: "s",
        s: { font: { bold: true, color: { rgb: "000000" } } },
      },
    ];

    const headers2 = [
      {
        v: "Date/Time",
        t: "s",
        s: { font: { bold: true, color: { rgb: "000000" } } },
      },
      {
        v: "Power Consumption (kWh)",
        t: "s",
        s: { font: { bold: true, color: { rgb: "000000" } } },
      },
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
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write file with date in name
    XLSX.writeFile(
      workbook,
      `${storeInfo.store_name}_${storeInfo.outlet_code}_${fileName}_${formattedDate}.xlsx`
    );
  };

  useEffect(() => {
    // Calculate the total whenever monthlyPowerData changes
    if (monthlyPowerData) {
      const total = Math.round(
        monthlyPowerData.data[0].energy_data.reduce(
          (acc, value) => acc + parseFloat(value),
          0
        )
      );
      setCurrentTotal(total);
    } else {
      setCurrentTotal(0);
    }
  }, [monthlyPowerData]);

  // Short helper to safely parse and round values
  const toRoundedInt = (val) => (val ? Math.round(parseFloat(val)) : 0);

  // If data is available, prepare the numeric values:
  const powerParamsData = powerParams?.data?.[0];
  const vAB = powerParamsData ? powerParamsData.vAB : 0;
  const vBC = powerParamsData ? powerParamsData.vBC : 0;
  const vCA = powerParamsData ? powerParamsData.vCA : 0;

  // Voltage average => round((vAB + vBC + vCA) / 3)
  const voltageAvg = powerParamsData
    ? ((parseFloat(powerParamsData.vAB || 0)
                + parseFloat(powerParamsData.vBC || 0)
                + parseFloat(powerParamsData.vCA || 0)) / 3).toFixed(2)
    : 0;

  // AN / BN / CN
  const vAN = powerParamsData ? powerParamsData.vA : 0;
  const vBN = powerParamsData ? powerParamsData.vB : 0;
  const vCN = powerParamsData ? powerParamsData.vC : 0;

  // Currents A/B/C
  const iA = powerParamsData ? powerParamsData.iA : 0;
  const iB = powerParamsData ? powerParamsData.iB : 0;
  const iC = powerParamsData ? powerParamsData.iC : 0;

  // Current average
  const currentAvg = powerParamsData
  ? (
      (
        parseFloat(powerParamsData.iA || 0) +
        parseFloat(powerParamsData.iB || 0) +
        parseFloat(powerParamsData.iC || 0)
      ) / 3
    ).toFixed(2)
  : "0.00";


  // Active Power, Frequency, Power Factor
  const activePower = powerParamsData
    ? powerParamsData.active_power
    : 0;
  const frequency = powerParamsData
    ? powerParamsData.frequency
    : 0;
  // Power factor is not rounded
  const powerFactor = powerParamsData?.power_factor || "--";

  return (
    <Fragment>
      <Pageheader
        currentpage={
          storeInfo
            ? `${storeInfo.store_name} (${storeInfo.outlet_code})`
            : "Power"
        }
        activepage="Main"
        mainpage="Power"
        storeId={storeId} // <-- pass storeId
        powerId={powerId} // <-- pass powerId
      />

      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12">
          <div className="box custom-box">
            {/* Responsive flexbox container */}
            <div className="box-header flex flex-wrap md:flex-nowrap items-center">
              {/* Title (Left for larger screens, first row for mobile) */}
              <div className="flex-1 text-left mb-2 md:mb-0 hidden md:block">
                <div className="box-title">{title}</div>
              </div>

              {/* Date picker (Center for larger screens, second row for mobile) */}
              <div className="flex-1 text-center mb-2 md:mb-0 md:!ml-36">
                <div className="form-group">
                  <div className="input-group !flex-nowrap justify-center">
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

              {/* Export button (Right for larger screens, third row for mobile) */}
              <div className="flex-1 text-right">
                <button
                  type="button"
                  className="ti-btn ti-btn-outline-secondary btn-wave !font-medium !ms-0  !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none mb-0 !text-[.6rem]"
                  onClick={() =>
                    exportToExcel(
                      monthlyPowerData?.data[0]?.energy_data,
                      monthlyPowerData?.data[0]?.time,
                      "MonthlyPowerData"
                    )
                  }
                >
                  <i className="ri-upload-cloud-line inline-block"></i>Export
                </button>
              </div>
            </div>

            <div className="box-body">
              <div id="column-negative">
                <Negativecolumn data={monthlyPowerData?.data[0]} />
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
                  exportToExcel(
                    weeklyPowerData?.data[0]?.energy_data,
                    weeklyPowerData?.data[0]?.time,
                    "WeeklyPowerData"
                  )
                }
              >
                <i className="ri-upload-cloud-line inline-block"></i>Export
              </button>
            </div>

            <div className="box-body">
              <div id="columns-distributed">
                <Distributed data={weeklyPowerData?.data?.[0]
    ? {
        ...weeklyPowerData.data[0],
        energy_data: weeklyPowerData.data[0].energy_data.map((val) =>
          Math.round(parseFloat(val))
        ),
      }
    : null} />
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
                  exportToExcel(
                    dailyPowerData?.data[0]?.energy_data,
                    dailyPowerData?.data[0]?.time,
                    "DailyPowerData"
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

        {/* Parent: Takes full width */}
        <div className="col-span-12">
          {/* Child grid for these two boxes */}
          <div className="grid grid-cols-12 gap-x-6">
            {/* -------------------------------------------
        1) POWER CONSUMPTION SUMMARY
    -------------------------------------------- */}
            <div className="md:col-span-6 col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">Power Consumption Summary</div>
                </div>
                <div className="box-body">
                  <div
                    className="
              sm:grid
              sm:grid-cols-12
              sm:justify-items-center
              sm:gap-0
              gap-y-3
              lg:ps-[3rem]
            "
                  >
                    {/* Today */}
                    <div
                      className="
                xl:col-span-4
                lg:col-span-4
                md:col-span-4
                sm:col-span-12
                sm:text-center
                md:text-left
                mb-3
              "
                    >
                      <div className="mb-1 earning first-half md:ms-4">
                        Today
                      </div>
                      <div className="mb-0">
                        <span className="mt-1 text-[1rem] font-semibold me-2">
                          {weeklyPowerData?.data?.[0]?.energy_data
                            ? Math.round(
                                parseFloat(
                                  weeklyPowerData?.data?.[0]?.energy_data[
                                    weeklyPowerData?.data?.[0]?.energy_data
                                      .length - 1
                                  ]
                                )
                              )
                            : 0}{" "}
                          kWh
                        </span>
                      </div>
                    </div>

                    {/* Last 7 Days */}
                    <div
                      className="
                xl:col-span-4
                lg:col-span-4
                md:col-span-4
                sm:col-span-12
                sm:text-center
                md:text-left
                mt-3
              "
                    >
                      <div className="mb-1 earning top-gross md:ms-4">
                        Last 7 days
                      </div>
                      <div className="mb-0">
                        <span className="mt-1 text-[1rem] font-semibold me-2">
                          {weeklyPowerData?.data?.[0]?.energy_data
                            ? Math.round(
                                weeklyPowerData.data[0].energy_data.reduce(
                                  (acc, val) => acc + parseFloat(val),
                                  0
                                )
                              )
                            : 0}{" "}
                          kWh
                        </span>
                      </div>
                    </div>

                    {/* Month Label */}
                    <div
                      className="
                xl:col-span-4
                lg:col-span-4
                md:col-span-4
                sm:col-span-12
                sm:text-center
                md:text-left
                mt-3
              "
                    >
                      <div className="mb-1 earning second-half md:ms-3">
                        {monthlyLabel}
                      </div>
                      <div className="mb-0">
                        <span className="mt-1 text-[1rem] font-semibold me-2">
                          {monthlyPowerData?.data?.[0]?.energy_data
                            ? Math.round(
                                monthlyPowerData.data[0].energy_data.reduce(
                                  (acc, val) => acc + parseFloat(val),
                                  0
                                )
                              )
                            : 0}{" "}
                          kWh
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* END: Power Consumption Summary */}

            {/* -------------------------------------------
        2) VISITORS BY COUNTRIES
    -------------------------------------------- */}
            <div className="md:col-span-6 col-span-12">
              <div className="box overflow-hidden">
                <div className="box-header justify-between">
                  <div className="box-title">Power Parameters</div>
                </div>
                <div className="box-body !p-0">
                  <div className="grid grid-cols-12 gap-x-4">
                    <div className=" xl:col-span-6 col-span-12 sales-visitors-countries">
                      <div className="mt-2">
                        <ul className="list-none p-6 my-auto">
                          {/* Group 1: AB, BC, CA, Avg */}
                          <li className="mb-4">
                            <span className="text-[0.75rem]">
                              <i className="ri-checkbox-blank-circle-fill align-middle me-2 inline-block text-primary"></i>
                              Voltage - AB
                            </span>
                            <span className="font-semibold ltr:float-right rtl:float-left">
                              {vAB} V
                            </span>
                          </li>
                          <li className="mb-4">
                            <span className="text-[0.75rem]">
                              <i className="ri-checkbox-blank-circle-fill align-middle me-2 inline-block text-primary"></i>
                              Voltage - BC
                            </span>
                            <span className="font-semibold ltr:float-right rtl:float-left">
                              {vBC} V
                            </span>
                          </li>
                          <li className="mb-4">
                            <span className="text-[0.75rem]">
                              <i className="ri-checkbox-blank-circle-fill align-middle me-2 inline-block text-primary"></i>
                              Voltage - CA
                            </span>
                            <span className="font-semibold ltr:float-right rtl:float-left">
                              {vCA} V
                            </span>
                          </li>
                          <li className="mb-4">
                            <span className="text-[0.75rem]">
                              <i className="ri-checkbox-blank-circle-fill align-middle me-2 inline-block text-primary"></i>
                              Voltage - Avg
                            </span>
                            <span className="font-semibold ltr:float-right rtl:float-left">
                              {voltageAvg} V
                            </span>
                          </li>

                          {/* Group 2: AN, BN, CN */}
                          <li className="mb-4">
                            <span className="text-[0.75rem]">
                              <i className="ri-checkbox-blank-circle-fill align-middle me-2 inline-block text-danger"></i>
                              Voltage - AN
                            </span>
                            <span className="font-semibold ltr:float-right rtl:float-left">
                              {vAN} V
                            </span>
                          </li>
                          <li className="mb-4">
                            <span className="text-[0.75rem]">
                              <i className="ri-checkbox-blank-circle-fill align-middle me-2 inline-block text-danger"></i>
                              Voltage - BN
                            </span>
                            <span className="font-semibold ltr:float-right rtl:float-left">
                              {vBN} V
                            </span>
                          </li>
                          <li className="mb-0">
                            <span className="text-[0.75rem]">
                              <i className="ri-checkbox-blank-circle-fill align-middle me-2 inline-block text-danger"></i>
                              Voltage - CN
                            </span>
                            <span className="font-semibold ltr:float-right rtl:float-left">
                              {vCN} V
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* Add additional columns if needed */}
                    <div className=" xl:col-span-6 col-span-12 sales-visitors-countries">
                      <div className="mt-2">
                        <ul className="list-none p-6 my-auto">
                          {/* First four share same color */}
                          <li className="mb-4">
                            <span className="text-[0.75rem]">
                              <i className="ri-checkbox-blank-circle-fill align-middle me-2 inline-block text-primary"></i>
                              Current - A
                            </span>
                            <span className="font-semibold ltr:float-right rtl:float-left">
                              {iA} A
                            </span>
                          </li>
                          <li className="mb-4">
                            <span className="text-[0.75rem]">
                              <i className="ri-checkbox-blank-circle-fill align-middle me-2 inline-block text-primary"></i>
                              Current - B
                            </span>
                            <span className="font-semibold ltr:float-right rtl:float-left">
                              {iB} A
                            </span>
                          </li>
                          <li className="mb-4">
                            <span className="text-[0.75rem]">
                              <i className="ri-checkbox-blank-circle-fill align-middle me-2 inline-block text-primary"></i>
                              Current - C
                            </span>
                            <span className="font-semibold ltr:float-right rtl:float-left">
                              {iC} A
                            </span>
                          </li>
                          <li className="mb-4">
                            <span className="text-[0.75rem]">
                              <i className="ri-checkbox-blank-circle-fill align-middle me-2 inline-block text-primary"></i>
                              Current - Avg
                            </span>
                            <span className="font-semibold ltr:float-right rtl:float-left">
                              {currentAvg} A
                            </span>
                          </li>

                          {/* Each of the following items has a unique color */}
                          <li className="mb-4">
                            <span className="text-[0.75rem]">
                              <i className="ri-checkbox-blank-circle-fill align-middle me-2 inline-block text-lime-600"></i>
                              Active Power
                            </span>
                            <span className="font-semibold ltr:float-right rtl:float-left">
                              {activePower} kW
                            </span>
                          </li>
                          <li className="mb-4">
                            <span className="text-[0.75rem]">
                              <i className="ri-checkbox-blank-circle-fill align-middle me-2 inline-block text-red"></i>
                              Frequency
                            </span>
                            <span className="font-semibold ltr:float-right rtl:float-left">
                              {frequency} Hz
                            </span>
                          </li>
                          {/* Power Factor Row */}
                          <li className="mb-0">
                            <span className="text-[0.75rem]">
                              <i className="ri-checkbox-blank-circle-fill align-middle me-2 inline-block text-orange"></i>
                              Power Factor
                            </span>
                            <span
                              className={`font-semibold ltr:float-right rtl:float-left ${
                                !isNaN(parseFloat(powerFactor)) &&
                                parseFloat(powerFactor) <= 0.8
                                  ? "text-red text-[1rem]"
                                  : ""
                              }`}
                            >
                              {/* Show danger icon if powerFactor <= 0.8 */}
                              {!isNaN(parseFloat(powerFactor)) &&
                                parseFloat(powerFactor) <= 0.8 && (
                                  <i
                                    className="hs-tooltip-toggle fe fe-alert-triangle mr-2"
                                    title="Low Power Factor"
                                  ></i>
                                )}
                              {powerFactor}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* END: Visitors By Countries */}
          </div>
        </div>

        {/* Add the Revenueanalytics chart */}
        <div className="col-span-12">
          <div className="box">
            <div className="box-header">
              {storeInfo?.store_name} {storeInfo?.outlet_code} Power Analytics
            </div>
            <div className="box-body">
              {storeInfo && monthlyPowerData && currentTotal > 0 && (
                <Revenueanalytics
                  key={`${powerId}`} // Add a unique key to force re-render
                  outletCode={storeInfo?.outlet_code}
                  currentMonth={currentTotal}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Power;
