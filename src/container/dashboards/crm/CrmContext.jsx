import React, { createContext, useContext, useState } from "react";

const CrmContext = createContext();

export const CrmProvider = ({ children }) => {
  const [storeContexts, setStoreContexts] = useState({});

  const setStoreData = (storeId, key, value) => {
    setStoreContexts((prev) => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        [key]: value,
      },
    }));
  };

  const getStoreData = (storeId) => {
    return storeContexts[storeId] || {};
  };

  return (
    <CrmContext.Provider value={{ getStoreData, setStoreData }}>
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => useContext(CrmContext);

