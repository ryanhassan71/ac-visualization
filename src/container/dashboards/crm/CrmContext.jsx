import React, { createContext, useContext, useState } from "react";

const CrmContext = createContext();

export const CrmProvider = ({ children }) => {
  const [acSensors, setAcSensors] = useState([]);
  const [energyData, setEnergyData] = useState(null);

  return (
    <CrmContext.Provider value={{ acSensors, setAcSensors, energyData, setEnergyData }}>
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => useContext(CrmContext);
