import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCrm } from './CrmContext';
import { fetchTemperatureData, fetchEnergyGraphData } from '../../../acApi';
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
import ReactApexChart from "react-apexcharts"

const Crm = () => {
  const { storeId, powerId } = useParams();
  const { acSensors, setAcSensors, energyData, setEnergyData } = useCrm();
  const [loading, setLoading] = useState(acSensors.length === 0);
  const [energyLoading, setEnergyLoading] = useState(energyData === null);

  useEffect(() => {
    const fetchData = async () => {
      const acSensorsData = await fetchTemperatureData(storeId); // Fetch the AC data
      setAcSensors(acSensorsData);
      setLoading(false);
    };

    // Fetch data every 5 seconds
    const interval = setInterval(fetchData, 5000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch energy data when the component loads
    const fetchEnergyData = async () => {
      const data = await fetchEnergyGraphData("weekly", powerId);
      setEnergyData(data);
      setEnergyLoading(false);
    };
    fetchEnergyData();
  }, []);

  if (loading || energyLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="ti-spinner" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Format dates from API response
  const formattedDates = energyData.data[0].time.map((dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  });

  const totalPowerConsumption = energyData.data[0].energy_data.reduce(
    (acc, value) => acc + parseFloat(value),
    0
  );
  return (
    <Fragment>
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div>
          <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 ">
            Welcome back, Khawja Belal !
          </p>
          <p className="font-normal text-[#8c9097] dark:text-white/50 text-[0.813rem]">
            Track your sales activity, leads and deals here.
          </p>
        </div>
        <div className="btn-list md:mt-0 mt-2">
          <button
            type="button"
            className="ti-btn bg-primary text-white btn-wave !font-medium !me-[0.375rem] !ms-0 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none mb-0"
          >
            <i className="ri-filter-3-fill  inline-block"></i>Filters
          </button>
          <button
            type="button"
            className="ti-btn ti-btn-outline-secondary btn-wave !font-medium  !me-[0.375rem]  !ms-0 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none mb-0"
          >
            <i className="ri-upload-cloud-line  inline-block"></i>Export
          </button>
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
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                <AcIcon />
                              </span>
                            </div>
                            <div className="flex-grow ms-4">
                              <div className="flex items-center justify-between flex-wrap">
                                <div>
                                  <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">
                                    {sensor.name}
                                  </p>
                                  <h4
                                    className="font-semibold text-[1.5rem] !mb-2"
                                    style={{
                                      color:
                                        sensor?.sensors[0]?.state_color ||
                                        "inherit",
                                    }}
                                  >
                                    {sensor?.sensors[0]?.ac_state || "N/A"}
                                  </h4>
                                </div>
                                <div id={`crm-total-deals-${index}`}>
                                  <Totalcustomers
                                    acSensorData={sensor?.sensors[0] || {}}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <div>
                                  <button
                                    className="text-warning text-[0.813rem]"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent triggering the outer link
                                      e.preventDefault(); // Prevent default action of link
                                      window.open(
                                        `/ac-control/${storeId}/${sensor.id}`,
                                        "_blank"
                                      );
                                    }}
                                  >
                                    {sensor.name} Remote
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
  ? `${Math.round(parseFloat(sensor?.sensors[0]?.ambient_temp.replace("°C", "")))}°C`
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
                                      Ambient
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
    {sensor?.sensors[0]?.airflow_temp !== undefined
      ? Math.round(sensor?.sensors[0]?.airflow_temp)
      : "N/A"} °C
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







                {/* End of ac list  */}
                <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                  <div className="box">
                    <div className="box-header !gap-0 !m-0 justify-between">
                      <div className="box-title">Revenue Analytics</div>
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
                        <Revenueanalytics />
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
                  <div className="box-title">Power Consumption</div>
                </div>
                <div className="box-body overflow-hidden">
                  <div className="leads-source-chart flex items-center justify-center">
                    <div>
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
                        series={energyData.data[0].energy_data.map((idx) =>
                          parseFloat(idx)
                        )} // Use energy data as the series data
                        type="donut"
                        height={260}
                      />
                    </div>
                    <div className="lead-source-value ">
                      <span className="block text-[0.875rem] ">Total</span>
                      <span className="block text-[1.5625rem] font-bold">
                        {Math.round(totalPowerConsumption)} kW/h
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-7 border-t border-dashed dark:border-defaultborder/10">
                  {formattedDates.map((date, index) => {
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
            <div className="xxl:col-span-12 xl:col-span-6  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">Deals Status</div>
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
                <div className="box-body">
                  <div className="flex items-center mb-[0.8rem]">
                    <h4 className="font-bold mb-0 text-[1.5rem] ">4,289</h4>
                    <div className="ms-2">
                      <span className="py-[0.18rem] px-[0.45rem] rounded-sm text-success !font-medium !text-[0.75em] bg-success/10">
                        1.02
                        <i className="ri-arrow-up-s-fill align-mmiddle ms-1"></i>
                      </span>
                      <span className="text-[#8c9097] dark:text-white/50 text-[0.813rem] ms-1">
                        compared to last week
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full h-[0.3125rem] mb-6 rounded-full overflow-hidden">
                    <div
                      className="flex flex-col justify-center rounded-s-[0.625rem] overflow-hidden bg-primary w-[21%]"
                      style={{ width: "21%" }}
                      aria-valuenow={21}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                    <div
                      className="flex flex-col justify-center rounded-none overflow-hidden bg-info w-[26%]"
                      style={{ width: "26%" }}
                      aria-valuenow={26}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                    <div
                      className="flex flex-col justify-center rounded-none overflow-hidden bg-warning w-[35%]"
                      style={{ width: "35%" }}
                      aria-valuenow={35}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                    <div
                      className="flex flex-col justify-center rounded-e-[0.625rem] overflow-hidden bg-success w-[18%]"
                      style={{ width: "18%" }}
                      aria-valuenow={18}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                  <ul className="list-none mb-0 pt-2 crm-deals-status">
                    <li className="primary">
                      <div className="flex items-center text-[0.813rem]  justify-between">
                        <div>Successful Deals</div>
                        <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                          987 deals
                        </div>
                      </div>
                    </li>
                    <li className="info">
                      <div className="flex items-center text-[0.813rem]  justify-between">
                        <div>Pending Deals</div>
                        <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                          1,073 deals
                        </div>
                      </div>
                    </li>
                    <li className="warning">
                      <div className="flex items-center text-[0.813rem]  justify-between">
                        <div>Rejected Deals</div>
                        <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                          1,674 deals
                        </div>
                      </div>
                    </li>
                    <li className="success">
                      <div className="flex items-center text-[0.813rem]  justify-between">
                        <div>Upcoming Deals</div>
                        <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                          921 deals
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="transition fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 opacity-0 hidden"></div>
    </Fragment>
  );
};

export default Crm;
