import React, { useState } from "react";
import "./AcControl.css";

function AcControl() {
  const [temperature, setTemperature] = useState(23);
  const [power, setPower] = useState("OFF");
  const [mode, setMode] = useState("Cool");
  const [speed, setSpeed] = useState("Auto");
  const [buttonText, setButtonText] = useState("Apply ");
  const [buttonColor, setButtonColor] = useState("#007bff");
  const [applyAllText, setApplyAllText] = useState("Apply for all");
  const [applyAllColor, setApplyAllColor] = useState("#007bff");

  const [popupMessage, setPopupMessage] = useState(""); // State for the popup message
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false); // State for confirmation popup visibility
  const [confirmationResponse, setConfirmationResponse] = useState(null); // State for user's confirmation response

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

  const handleApplyClick = () => {
    // Show the popup message
    setPopupMessage("Done!");
    setShowPopup(true);

    // Hide the popup after 1 second
    setTimeout(() => {
      setShowPopup(false);
    }, 2000); // 1 second delay
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
