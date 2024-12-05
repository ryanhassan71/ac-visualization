import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { controlAcSettings, fetchTemperatureData } from "../../acApi";
import "./AcControl.css";

function AcControl() {
  const { acId, storeId } = useParams();
  const [temperature, setTemperature] = useState();
  const [power, setPower] = useState();
  const [mode, setMode] = useState();
  const [speed, setSpeed] = useState();
  const [buttonText, setButtonText] = useState("Apply ");
  const [buttonColor, setButtonColor] = useState("#007bff");
  const [applyAllText, setApplyAllText] = useState("Apply for all");
  const [applyAllColor, setApplyAllColor] = useState("#007bff");

  const [popupMessage, setPopupMessage] = useState(""); // State for the popup message
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false); // State for confirmation popup visibility
  const [confirmationResponse, setConfirmationResponse] = useState(null); // State for user's confirmation response
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    // Fetch AC data when the component loads
    const fetchAcData = async () => {
      try {
        const acSensors = await fetchTemperatureData(storeId);
        const currentAc = acSensors.find(sensor => sensor.id === parseInt(acId));

        if (currentAc && currentAc.sensors.length > 0) {
          const sensorData = currentAc.sensors[0];
          setTemperature(sensorData.ac_remote_temp ? parseInt(sensorData.ac_remote_temp) : 23);
          setPower(sensorData.ac_remote_state?.toLowerCase() === "on" ? "ON" : "OFF");
          setMode(sensorData.ac_remote_mode || "Cool");
          setSpeed(sensorData.ac_remote_fan_speed || "Auto");
        }
      } catch (error) {
        console.error("Error fetching AC data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcData();
  }, [storeId, acId]);

  const handleTemperatureChange = (type) => {
    setTemperature((prev) => {
      if (type === "increase") return Math.min(prev + 1, 30);
      if (type === "decrease") return Math.max(prev - 1, 16);
      return prev;
    });
  };

  const handleModeChange = () => {
    const modes = ["Cool", "Hot", "Fan", "Auto"];
    const nextMode = modes[(modes.indexOf(mode) + 1) % modes.length];
    setMode(nextMode);
  };

  const handleSpeedChange = () => {
    const speeds = ["High", "Low", "Mid", "Auto"];
    const nextSpeed = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(nextSpeed);
  };

  const handleApplyClick = async () => {
    try {
      // Prepare the request payload
      const payload = {
        sensor_id: parseInt(acId),
        off_on: power.toLowerCase(),
        temperature: `${temperature}`,
        ac_mode: mode.toLowerCase(),
        fan_speed: speed.toLowerCase(),
      };

      // Call the API using the function from acApi.js
      const response = await controlAcSettings(payload);

      if (response.success) {
        setPopupMessage("AC Command Sent Successfully!");
      } else {
        setPopupMessage("Failed to Send Command.");
      }
    } catch (error) {
      console.error("Error applying AC settings:", error);
      setPopupMessage("Error occurred while applying settings.");
    }

    setShowPopup(true);

    // Hide the popup after 2 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  const handleApplyAllClick = () => {
    // Show the confirmation popup when "Apply for all" is clicked
    setShowConfirmationPopup(true);
  };

  const handleConfirmationResponse = (response) => {
    if (response === "Save changes") {
      // Handle the "Save changes" response (apply the settings to all ACs)
      setShowConfirmationPopup(false);
      setPopupMessage("Settings applied!");
      setShowPopup(true);

      // Hide the popup after 1 second
      setTimeout(() => {
        setShowPopup(false);
      }, 2500); // 1 second delay
    } else {
      // Handle the "Cancel" response (do nothing and close the confirmation popup)
      setShowConfirmationPopup(false);
    }
  };

  const getModeEmoji = () => {
    switch (mode) {
      case "Cool":
        return "❄️";
      case "Hot":
        return "🔥";
      case "Fan":
        return "💨";
      case "Auto":
        return "🔄";
      default:
        return "❄️";
    }
  };

  const getSpeedEmoji = () => {
    switch (speed) {
      case "High":
        return "⚡";
      case "Low":
        return "💨";
      case "Mid":
        return "🌬️";
      case "Auto":
        return "🔄";
      default:
        return "⚡";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen" style={{ backgroundColor: "#141336" }}>
        <div className="ti-spinner text-white" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Popup for "Apply for this" button */}
      {showPopup && (
        <div className="popup">
          {popupMessage}
        </div>
      )}

      {/* Confirmation Popup for "Apply for all" button */}
      {showConfirmationPopup && (
        <div className="confirmation-popup">
          <p>Are you sure you want to apply this setting for all AC's?</p>
          <div className="confirmation-buttons">
            <button
              className="confirmation-btn yes"
              onClick={() => handleConfirmationResponse("Save changes")}
            >
              Save changes
            </button>
            <button
              className="confirmation-btn no"
              onClick={() => handleConfirmationResponse("Cancel")}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={`ac-control ${power === "ON" ? "on" : "off"}`}>
        <div className="ac-display">
          <div className="ac-icon"></div>
        </div>

        <div className="temp-control">
          <button
            className="temp-btn"
            onClick={() => handleTemperatureChange("decrease")}
          >
            -
          </button>
          <span className="temperature">{temperature}°C</span>
          <button
            className="temp-btn"
            onClick={() => handleTemperatureChange("increase")}
          >
            +
          </button>
        </div>
        <p className="set-temp-label">Set Temperature</p>

        <div className="info-row">
          <div className="info">
            <button className="mode-btn" onClick={handleModeChange}>
              {getModeEmoji()} {mode}
            </button>
          </div>
          <div className="info">
            <button className="speed-btn" onClick={handleSpeedChange}>
              {getSpeedEmoji()} {speed}
            </button>
          </div>
        </div>

        <div className="power-control">
          <label className={power === "ON" ? "green" : ""}>
            <input
              type="radio"
              name="power"
              value="ON"
              checked={power === "ON"}
              onChange={(e) => setPower(e.target.value)}
            />
            ON
          </label>
          <label className={power === "OFF" ? "red" : ""}>
            <input
              type="radio"
              name="power"
              value="OFF"
              checked={power === "OFF"}
              onChange={(e) => setPower(e.target.value)}
            />
            OFF
          </label>
        </div>

        <div className="button-row">
          <div className="apply-btn-container">
            <button
              className="apply-btn"
              style={{ backgroundColor: buttonColor }}
              onClick={handleApplyClick}
            >
              {buttonText}
            </button>
          </div>

          <div className="apply-all-btn-container">
            <button
              className="apply-btn"
              style={{ backgroundColor: applyAllColor }}
              onClick={handleApplyAllClick}
            >
              {applyAllText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcControl;
