import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCrm } from "./CrmContext";
import {
  fetchTemperatureData,
  fetchEnergyGraphData,
  TEMPERATURE_DATA_INTERVAL,
  fetchStoreList,
  fetchWeatherData,
} from "../../../acApi";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Conversionratio,
  Dealsstatistics,
  Profit,
  Profitearned,
  Revenueanalytics,
  Totalcustomers,
  Totaldeals,
  Totalrevenue,
  AcIcon,
} from "./crmdata";
import ReactApexChart from "react-apexcharts";
import ReactModal from "react-modal";
import AcRemote from "../../../components/ui/AcRemote";
import "./Crm.css";
import MonthlyPowerChart from "../../../components/ui/MonthlyPowerChart";
import { CARBON_EMISSION_CONSTANT, MOBILE_WIDTH } from "../../../config";

const weatherIconMap = {
  "Clear sky": "ri-sun-line",
  "Mainly clear": "ri-sun-line",
  Rain: "ri-rainy-line",
  "Rain showers": "ri-rainy-line",
  "Patchy rain possible": "ri-cloud-drizzle-line",
  Drizzle: "ri-cloud-drizzle-line",
  "Partly cloudy": "ri-cloudy-line",
  Overcast: "ri-cloud-line",
  "Overcast clouds": "ri-cloud-line",
  "Broken clouds": "ri-cloud-line",
  "Scattered clouds": "ri-cloud-line",
  Windy: "ri-windy-line",
  Thunderstorm: "ri-thunderstorms-line",
  Fog: "ri-foggy-line",
  Mist: "ri-mist-line",
  Default: "ri-cloud-line",
};

const Crm = () => {
  
  const { storeId, powerId } = useParams();
  const { getStoreData, setStoreData } = useCrm();

  const {
    acSensors = [],
    energyData = null,
    monthlyData = null,
  } = getStoreData(storeId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAcId, setSelectedAcId] = useState(null);
  const [selectedAcName, setSelectedAcName] = useState(""); // State to store the selected AC name
  const [storeInfo, setStoreInfo] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const acSensorsData = await fetchTemperatureData(storeId);
      setStoreData(storeId, "acSensors", acSensorsData);
    };

    const fetchDataForStoreList = async () => {
      try {
        // Fetch store list and find the store info for the given powerId
        const storeList = await fetchStoreList();
        const matchedStore = storeList.find(
          (store) => store.energy_meter_id === parseInt(powerId)
        );
        setStoreInfo(matchedStore);
      } catch (error) {
        console.error("Error fetching store name", error);
      }
    };

    const fetchWeatherInfo = async () => {
      try {
        const data = await fetchWeatherData();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchData();
    fetchDataForStoreList();
    fetchWeatherInfo();
    const interval = setInterval(fetchData, TEMPERATURE_DATA_INTERVAL);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [storeId]);

  useEffect(() => {
    // Fetch energy data when the component loads
    const fetchEnergyData = async () => {
      const energyGraphData = await fetchEnergyGraphData("weekly", powerId);
      setStoreData(storeId, "energyData", energyGraphData);
    };

    fetchEnergyData();
  }, [powerId]);

  useEffect(() => {
    // Fetch monthly energy data
    const fetchMonthlyData = async () => {
      const monthlyEnergyData = await fetchEnergyGraphData("monthly", powerId);
      setStoreData(storeId, "monthlyData", monthlyEnergyData);
    };

    fetchMonthlyData();
  }, [powerId]);

  // Format dates from API response
  const formattedDates = energyData?.data[0].time.map((dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  });

  const totalPowerConsumption = energyData?.data[0].energy_data.reduce(
    (acc, value) => acc + parseFloat(value),
    0
  );

  const openModal = (acId, acName) => {
    setSelectedAcId(acId);
    setIsModalOpen(true);
    setSelectedAcName(acName);
  };

  const closeModal = () => {
    setSelectedAcId(null);
    setIsModalOpen(false);
  };

  // Calculate total monthly power consumption
  const totalMonthlyConsumption = monthlyData
    ? Math.round(
        monthlyData.data[0].energy_data.reduce(
          (acc, value) => acc + parseFloat(value),
          0
        )
      )
    : 0;

  // Calculate total consumption for the latest 7 days
  const latest7DaysConsumption = monthlyData?.data[0]?.energy_data
    .slice(-7)
    .reduce((acc, value) => acc + parseFloat(value), 0);

  // Calculate the percentage of the month's total consumption
  const latest7DaysPercentage =
    totalMonthlyConsumption > 0
      ? Math.round((latest7DaysConsumption / totalMonthlyConsumption) * 100)
      : 100; // Default to 100% if it's the beginning of the month

  // Filter ACs that are online
  const onlineAcs = acSensors.filter(
    (sensor) => sensor?.sensors[0]?.status === true
  );

  // Calculate the count of ACs that are "Off" among the online ones
  const totalOff = onlineAcs.filter(
    (sensor) => sensor?.sensors[0]?.state?.toUpperCase() === "OFF"
  ).length;

  // Calculate the count of ACs that are "On" among the online ones
  const totalOn = onlineAcs.length - totalOff;

  // Calculate the total online and offline ACs
  const totalOnline = onlineAcs.length;
  const totalOffline = acSensors.length - totalOnline;

  const getWeatherIcon = (description) => {
    return weatherIconMap[description] || weatherIconMap.Default;
  };

  // Update state based on screen width
  useEffect(() => {
    const updateView = () => {
      setIsMobile(window.innerWidth <= MOBILE_WIDTH); // Define mobile as screen width <= 768px
    };

    updateView(); // Initial check
    window.addEventListener("resize", updateView); // Update on resize

    return () => window.removeEventListener("resize", updateView); // Cleanup
  }, []);

  return (
    <Fragment>
      <div className="md:flex items-center justify-between  page-header-breadcrumb">
        {/* Outlet Name on the Left */}
        {!isMobile && (
          <div>
            <p className="font-semibold text-[1.4rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0">
              AC Controls and Monitoring Dashboard - {storeInfo?.store_name} (
              {storeInfo?.outlet_code})
            </p>
          </div>
        )}

        <div>
          <div
            className="box-body flex items-center justify-between gap-x-4 rounded-lg shadow-lg my-2 !p-1"
            style={{
              position: window.innerWidth <= 1000 ? "fixed" : "", // Fixed for mobile, sticky for desktop
              top: "50px", // Sticks to the top
              background: "linear-gradient(to right, #6dd5fa, #2980b9)", // Gradient background
              color: "white", // White text for contrast
              zIndex: 1, // Ensures it stays on top of other elements
              width: window.innerWidth <= MOBILE_WIDTH ? "90%" : "auto", // Full width on mobile
            }}
          >
            {/* Location with Pin */}
            <div className="flex items-center ">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full "
                style={{
                  background:
                    "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)", // Pin gradient
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", // Subtle shadow
                }}
              >
                <i className="ri-map-pin-line text-white text-[1.5rem]"></i>
              </div>
              <div className="ml-3 text-center">
                <p className="text-[1rem] font-semibold">
                  {weather?.weather_city}
                </p>
              </div>
            </div>

            {/* Weather Icon and Description */}
            <div className="text-center">
              <div
                className="flex items-center justify-center h-12 w-12 rounded-full mx-auto p-0"
                style={{
                  background:
                    "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)", // Icon gradient
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", // Subtle shadow
                }}
              >
                <i
                  className={`${getWeatherIcon(
                    weather?.weather_description
                  )} text-[1.5rem] text-yellow-300`}
                ></i>
              </div>
              <p className="text-[0.8rem] mt-2">
                {weather?.weather_description}
              </p>
            </div>

            {/* Temperature */}
            <div className="text-center">
              <p className="text-[1.2rem] font-bold">
                <i
                  className="ri-thermometer-line text-[1rem] text-yellow-300 mr-2"
                  style={{
                    background: "linear-gradient(to bottom, #ff9a9e, #fad0c4)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                ></i>
                {weather?.weather_temperature}
              </p>
              <p className="text-[0.8rem]">Air Temp</p>
            </div>

            {/* Humidity */}
            <div className="text-center">
              <p className="text-[1.2rem] font-bold">
                <i
                  className="ri-drop-line text-[1rem] text-blue-300 mr-2"
                  style={{
                    background: "linear-gradient(to bottom, #89f7fe, #66a6ff)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                ></i>
                {weather?.weather_humidity}
              </p>
              <p className="text-[0.8rem]">Humidity</p>
            </div>
          </div>
          {isMobile && (
            <div
              style={{
                position: window.innerWidth <= 1000 ? "fixed" : "", // Fixed for mobile, sticky for desktop
                top: "135px", // Sticks to the top
                zIndex: 1, // Ensures it stays on top of other elements
                textAlign: "center", // Centers the text
                background: "linear-gradient(to right, #6dd5fa, #2980b9)", // Matches the weather card gradient
                color: "white", // Explicitly sets text color to white
                padding: "10px", // Adds some padding for better appearance

                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", // Adds subtle shadow
                width: "90%",
              }}
            >
              <p className="font-semibold text-[.6rem] text-white !mb-0 mt-0">
                AC Controls and Monitoring Dashboard - {storeInfo?.store_name} (
                {storeInfo?.outlet_code})
              </p>
            </div>
          )}
        </div>
      </div>
      {isMobile && <div className="mb-20">.</div>}
      <div className="grid grid-cols-12 gap-0 !mt-0 !sm:mt-14">
        <div className="col-span-12">
          <div
            className="box"
            style={{
              background: "linear-gradient(135deg, #85FFBD 0%, #FFFB7D 100%)", // Light mode gradient
              color: "white", // Text color for readability in light mode
              darkBackground:
                "linear-gradient(135deg, #1A535C 0%, #4ECDC4 100%)", // Dark mode gradient
            }}
          >
            <div className="box-body !p-0 !m-0">
              <div className="grid grid-cols-10 gap-x-0 ">
                {/* Total Devices */}
                <div className="col-span-10 lg:col-span-2 border-e border-dashed dark:border-defaultborder/10">
                  <div className="flex flex-wrap items-start py-4 px-2">
                    <div className="me-4 leading-none">
                      <span
                        className="avatar avatar-md !rounded-full shadow-sm"
                        style={{ backgroundColor: "#001f3f" }} // Dark navy blue
                      >
                        <AcIcon />
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-semibold text-lg md:text-base dark:text-black">
                        {acSensors.length}
                      </h5>
                      <p className="text-[#8c9097] mb-0 text-[0.75rem]">
                        Total Installed Devices
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total ACs ON */}
                <div className="col-span-10 lg:col-span-2 border-e border-dashed dark:border-defaultborder/10">
                  <div className="flex flex-wrap items-start py-4 px-2">
                    <div className="me-4 leading-none">
                      <span className="avatar avatar-md !rounded-full !bg-success shadow-sm">
                        <AcIcon />
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-semibold text-lg md:text-base dark:text-black">
                        {totalOn}
                      </h5>
                      <p className="text-[#8c9097]  mb-0 text-[0.75rem]">
                        Total ACs ON
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total ACs OFF */}
                <div className="col-span-10 lg:col-span-2 border-e border-dashed dark:border-defaultborder/10">
                  <div className="flex flex-wrap items-start py-4 px-2">
                    <div className="me-3 leading-none">
                      <span className="avatar avatar-md !rounded-full bg-gray-500 shadow-sm">
                        <AcIcon />
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-semibold text-lg md:text-base dark:text-black">
                        {totalOff}
                      </h5>
                      <p className="text-[#8c9097]  mb-0 text-[0.75rem]">
                        Total ACs OFF
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total ACs Online */}
                <div className="col-span-10 lg:col-span-2 border-e border-dashed dark:border-defaultborder/10">
                  <div className="flex flex-wrap items-start py-4 px-2">
                    <div className="me-3 leading-none">
                      <span className="avatar avatar-md !rounded-full bg-success shadow-sm">
                        <i className="ti ti-wifi text-[1.125rem]"></i>
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-semibold text-lg md:text-base dark:text-black">
                        {totalOnline}
                      </h5>
                      <p className="text-[#8c9097]  mb-0 text-[0.75rem] ">
                        Total Devices Online
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total ACs Offline */}
                <div className="col-span-10 lg:col-span-2">
                  <div className="flex flex-wrap items-start py-4 px-2">
                    <div className="me-3 leading-none">
                      <span className="avatar avatar-md !rounded-full bg-danger shadow-sm">
                        <i className="ti ti-wifi-off text-[1.125rem]"></i>
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-semibold text-lg md:text-base dark:text-black">
                        {totalOffline}
                      </h5>
                      <p className="text-[#8c9097]  mb-0 text-[0.75rem]">
                        Total Devices Offline
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6 ">
        <div className="xxl:col-span-9 xl:col-span-12  col-span-12 ">
          <div className="grid grid-cols-12 gap-x-6 ">
            <div className="xxl:col-span-12  xl:col-span-12  col-span-12 ">
              <div className="grid grid-cols-12 gap-x-6">
                {acSensors.map((sensor, index) => (
                  <div
                    className="high:col-span-4 above:col-span-6  col-span-12"
                    key={index}
                  >
                    <Link
                      to={`/${storeId}/${powerId}/ac/temp-graph/${sensor.id}`}
                    >
                      <div className="box overflow-hidden">
                        <div className="box-body">
                          <div className="flex items-top justify-between">
                            <div>
                              <span
                                className={`!text-[0.8rem] !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center ${
                                  sensor.sensors[0].status
                                    ? sensor.sensors[0]?.state?.toUpperCase() ===
                                      "OFF"
                                      ? "bg-gray-500" // Grey background for online and off state
                                      : "bg-success" // Green background for online and on state
                                    : "bg-danger" // Red background for offline
                                }`}
                              >
                                {sensor.sensors[0].status ? (
                                  <AcIcon /> // AC icon for online
                                ) : (
                                  <span className="avatar avatar-md !rounded-full bg-danger shadow-sm">
                                    <i className="ti ti-wifi-off text-[1.125rem]"></i>
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex-grow ms-4">
                              <div className="flex items-center justify-between flex-wrap">
                                <div>
                                  <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">
                                    {sensor.name}
                                  </p>
                                  <h4
                                    className="font-semibold !mb-2 text-[1rem] break-words whitespace-normal w-[100px] text-left"
                                    style={{
                                      color:
                                        sensor?.sensors[0]?.state_color ||
                                        "inherit",
                                      wordBreak: "break-word",
                                      whiteSpace: "normal",
                                      overflowWrap: "break-word",
                                      maxWidth: "100px",
                                      textAlign: "left", // Ensures left alignment
                                      marginLeft: "0", // Removes any left margin
                                      marginRight: "0", // Removes any right margin
                                    }}
                                  >
                                    {sensor?.sensors[0]?.ac_state || "N/A"}
                                  </h4>
                                </div>
                                <div id={`crm-total-deals-${index}`}>
                                  <Totalcustomers
                                    acSensorData={sensor?.sensors[0] || {}}
                                    time={sensor?.temperature_time}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <div>
                                  <button
                                    className="text-[0.813rem] font-bold"
                                    style={{
                                      color: "blue",
                                      fontWeight: "bold",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent triggering the outer link
                                      e.preventDefault(); // Prevent default action of link

                                      openModal(sensor.id, sensor.name);
                                    }}
                                  >
                                    Control {sensor.name}
                                    <i className="ti ti-arrow-narrow-right ms-2 font-semibold inline-block"></i>
                                  </button>
                                </div>
                                <div className="text-end flex items-center">
                                  <div className="text-center">
                                    <p
                                      className="mb-0 text-[0.813rem] font-semibold"
                                      style={{
                                        color:
                                          sensor?.sensors[0]?.ambient_color ||
                                          "inherit",
                                      }}
                                    >
                                      {sensor?.sensors[0]?.ambient_temp
                                        ? `${Math.round(
                                            parseFloat(
                                              sensor?.sensors[0]?.ambient_temp.replace(
                                                "°C",
                                                ""
                                              )
                                            )
                                          )}°C`
                                        : "N/A"}
                                    </p>
                                    <p
                                      className="text-[#8c9097] dark:text-white/50 opacity-[0.7] text-[0.6875rem]"
                                      style={{
                                        color:
                                          sensor?.sensors[0]?.ambient_color ||
                                          "inherit",
                                      }}
                                    >
                                      Room
                                    </p>
                                  </div>
                                  <div className="text-center ms-4">
                                    <p
                                      className="mb-0 text-[0.813rem] font-semibold"
                                      style={{
                                        color:
                                          sensor?.sensors[0]?.airflow_color ||
                                          "inherit",
                                      }}
                                    >
                                      {sensor?.sensors[0]?.airflow_temp !==
                                      undefined
                                        ? Math.round(
                                            sensor?.sensors[0]?.airflow_temp
                                          )
                                        : "N/A"}{" "}
                                      °C
                                    </p>
                                    <p
                                      className="text-[#8c9097] dark:text-white/50 opacity-[0.7] text-[0.6875rem]"
                                      style={{
                                        color:
                                          sensor?.sensors[0]?.airflow_color ||
                                          "inherit",
                                      }}
                                    >
                                      Airflow
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}

                <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                  <div className="box">
                    <div className="box-header !gap-0 !m-0 justify-between">
                      <div className="box-title">
                        {storeInfo?.store_name} ({storeInfo?.outlet_code}) Power
                        Analytics
                      </div>
                      <div className="hs-dropdown ti-dropdown">
                        <Link
                          to="#"
                          className="text-[0.75rem] px-2 font-normal text-[#8c9097] dark:text-white/50"
                          aria-expanded="false"
                        >
                          View All
                          <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                        </Link>
                        <ul
                          className="hs-dropdown-menu ti-dropdown-menu hidden"
                          role="menu"
                        >
                          <li>
                            <Link
                              className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                              to="#"
                            >
                              Today
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                              to="#"
                            >
                              This Week
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                              to="#"
                            >
                              Last Week
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="box-body !py-5">
                      <div id="crm-revenue-analytics">
                        {storeInfo && totalMonthlyConsumption != 0 && (
                          <Revenueanalytics
                            key={storeInfo.outlet_code} // Add a unique key to force re-render
                            outletCode={storeInfo?.outlet_code}
                            currentMonth={Math.round(totalMonthlyConsumption)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-3 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-12 xl:col-span-12  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">
                    Current Week Power Consumption
                  </div>
                </div>
                <div className="box-body overflow-hidden">
                  <div className="leads-source-chart flex items-center justify-center">
                    <div>
                      {energyData ? (
                        <ReactApexChart
                          options={{
                            labels: formattedDates, // Use formatted dates for labels
                            chart: {
                              height: 260,
                              type: "donut",
                              events: {
                                mounted: (chart) => {
                                  chart.windowResizeHandler();
                                },
                              },
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
                              "#845ADF", // Color for first value
                              "#23B7E5", // Color for second value
                              "#F5B849", // Color for third value
                              "#26BF94", // Color for fourth value
                              "#FF6F61", // Color for fifth value
                              "#FFA07A", // Color for sixth value
                              "#B22222", // Color for seventh value
                            ],
                            tooltip: {
                              y: {
                                formatter: function (val) {
                                  return val + " kW/h";
                                },
                              },
                            },
                          }}
                          series={energyData?.data[0].energy_data.map((idx) =>
                            parseFloat(idx)
                          )} // Use energy data as the series data
                          type="donut"
                          height={260}
                        />
                      ) : (
                        <div className="text-center py-6">
                          <h4 className="text-lg font-semibold text-gray-500">
                            Under Construction
                          </h4>
                        </div>
                      )}
                    </div>
                    {energyData && (
                      <div className="lead-source-value ">
                        <span className="block text-[0.875rem] ">Total</span>
                        <span className="block text-[1.5625rem] font-bold">
                          {Math.round(totalPowerConsumption)} kWh
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-7 border-t border-dashed dark:border-defaultborder/10">
                  {formattedDates?.map((date, index) => {
                    // Remove year from the formatted date
                    const dateWithoutYear = date.replace(/\s\d{4}$/, ""); // Removes the year (e.g., "28 Feb 2024" -> "28 Feb")

                    return (
                      <div key={index} className="col !p-0">
                        <div className="p-[0.95rem] text-center ">
                          <span
                            className="text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-1 crm-lead-legend inline-block"
                            style={{
                              color: [
                                "#845ADF",
                                "#23B7E5",
                                "#F5B849",
                                "#26BF94",
                                "#FF6F61",
                                "#FFA07A",
                                "#B22222",
                              ][index],
                            }}
                          >
                            {dateWithoutYear}
                          </span>
                          <div>
                            <span
                              className="text-[1rem] font-semibold"
                              style={{
                                color: [
                                  "#845ADF",
                                  "#23B7E5",
                                  "#F5B849",
                                  "#26BF94",
                                  "#FF6F61",
                                  "#FFA07A",
                                  "#B22222",
                                ][index],
                              }}
                            >
                              {Math.round(
                                parseFloat(
                                  energyData.data[0].energy_data[index]
                                )
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="xxl:col-span-12 xl:col-span-12  col-span-12">
              <div className="box">
                <div className="box-header justify-between ">
                  <div className="box-title">Power Consumption Summary</div>
                </div>
                <div className="box-body !p-0 border-none">
                  {monthlyData?.data?.length > 0 ? (
                    <MonthlyPowerChart monthlyData={monthlyData?.data[0]} />
                  ) : (
                    <div className="text-center py-6">
                      <h4 className="text-lg font-semibold text-gray-500">
                        Under Construction
                      </h4>
                    </div>
                  )}
                  <div className="flex items-center mb-[0.8rem]">
                    <h4 className="font-bold mb-0 text-[1.5rem] p-2">
                      {totalPowerConsumption
                        ? (
                            totalPowerConsumption * CARBON_EMISSION_CONSTANT
                          ).toFixed(0)
                        : 0}{" "}
                    </h4>
                    <div className="">
                      <span className="py-[0.18rem]  rounded-sm text-success !font-medium !text-[0.8rem] bg-success/10">
                        <i className="ri-cloud-line align-middle "></i> kg CO
                        <sub>2</sub>
                      </span>

                      <span className="text-[#8c9097] dark:text-white/50 text-[0.6rem] ms-1">
                        Carbon Emission last 7 days
                      </span>
                    </div>
                  </div>

                  {monthlyData && energyData && (
                    <ul className="list-none mb-0 pt-2 crm-deals-status p-2">
                      <li className="primary">
                        <div className="flex items-center text-[0.813rem] justify-between">
                          <div>Today</div>
                          <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                            {energyData?.data[0]?.energy_data?.length > 0
                              ? `${Math.round(
                                  parseFloat(
                                    energyData.data[0].energy_data.slice(-1)[0]
                                  )
                                )} kWh`
                              : "0 kWh"}
                          </div>
                        </div>
                      </li>
                      <li className="info">
                        <div className="flex items-center text-[0.813rem] justify-between">
                          <div>Last 7 days</div>
                          <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                            {totalPowerConsumption !== undefined
                              ? `${Math.round(totalPowerConsumption)} kWh`
                              : "0 kWh"}
                          </div>
                        </div>
                      </li>
                      <li className="warning">
                        <div className="flex items-center text-[0.813rem] justify-between">
                          <div>This Month</div>
                          <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                            {totalMonthlyConsumption !== undefined
                              ? `${Math.round(totalMonthlyConsumption)} kWh`
                              : "0 kWh"}
                          </div>
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="transition fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 opacity-0 hidden"></div>
      {/* Modal for AcControl */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="AC Controls"
        className="modal-content"
        overlayClassName="modal-overlay"
        style={{
          overlay: {
            zIndex: 999999,
           
          },
          content: {
            zIndex: 1000000,

          },
        }}
      >
        <div className="modal-header">
          <h4>{selectedAcName}</h4>
          <button onClick={closeModal} className="close-button">
            &times;
          </button>
        </div>
        <div className="modal-body">
          {selectedAcId && (
            <AcRemote
              acId={selectedAcId}
              storeId={storeId}
              closeModal={closeModal} // Pass the closeModal function
            />
          )}
        </div>
      </ReactModal>
    </Fragment>
  );
};

export default Crm;
