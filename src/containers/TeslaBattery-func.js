import React, { useEffect, useState } from "react";
import TeslaCar from "../components/TeslaCar/TeslaCar";
import TeslaNotice from "../components/TeslaNotice/TeslaNotice";
import TeslaStats from "../components/TeslaStats/TeslaStats";
import TeslaCounter from "../components/TeslaCounter/TeslaCounter";
import TeslaClimate from "../components/TeslaClimate/TeslaClimate";
import TeslaWheels from "../components/TeslaWheels/TeslaWheels";
import "./TeslaBattery.css";
import { getModelData } from "../services/BatteryService";
const TeslaBattery = (props) => {
  const [carstats, setCarstats] = useState([]);
  const [config, setConfig] = useState({
    speed: 55,
    temperature: 20,
    climate: true,
    wheels: 19,
  });
  const calculateStats = (models, value) => {
    const dataModels = getModelData();
    return models.map((model) => {
      // ES6 Object destructuring Syntax,    // takes out required values and create references to them
      const { speed, temperature, climate, wheels } = value;
      const miles =
        dataModels[model][wheels][climate ? "on" : "off"].speed[speed][
          temperature
        ];
      return { model, miles };
    });
  };
  const statsUpdate = () => {
    const carModels = ["60", "60D", "75", "75D", "90D", "P100D"]; // Fetch model info from BatteryService and calculate then update state
    setCarstats(calculateStats(carModels, config));
  };
  const updateCounterState = (title, newValue) => {
    const config_ = { ...config }; // update config state with new value
    title === "Speed"
      ? (config_["speed"] = newValue)
      : (config_["temperature"] = newValue); // update our state
    setConfig(config_);
  };
  const increment = (e, title) => {
    e.preventDefault();
    let currentValue, maxValue, step;
    const { speed, temperature } = props.counterDefaultVal;
    if (title === "Speed") {
      currentValue = config.speed;
      maxValue = speed.max;
      step = speed.step;
    } else {
      currentValue = config.temperature;
      maxValue = temperature.max;
      step = temperature.step;
    }
    if (currentValue < maxValue) {
      const newValue = currentValue + step;
      updateCounterState(title, newValue);
    }
  };
  const decrement = (e, title) => {
    e.preventDefault();
    let currentValue, minValue, step;
    const { speed, temperature } = props.counterDefaultVal;
    if (title === "Speed") {
      currentValue = config.speed;
      minValue = speed.min;
      step = speed.step;
    } else {
      currentValue = config.temperature;
      minValue = temperature.min;
      step = temperature.step;
    }
    if (currentValue > minValue) {
      const newValue = currentValue - step;
      updateCounterState(title, newValue);
    }
  };
  // handle aircon & heating click event handler
  const handleChangeClimate = () => {
    const config_ = { ...config };
    config_["climate"] = !config.climate;
    setConfig(config_);
  };
  const handleChangeWheels = (size) => {
    const config_ = { ...config };
    config_["wheels"] = size;
    setConfig(config_);
  };

  useEffect(() => {
    statsUpdate();
  }, [config]);
  return (
    <form className="tesla-battery">
      <h1>Range Per Charge</h1> <TeslaCar wheelsize={config.wheels} />
      <TeslaStats carstats={carstats} />
      <div className="tesla-controls cf">
        <TeslaCounter
          currentValue={config.speed}
          initValues={props.counterDefaultVal.speed}
          increment={increment}
          decrement={decrement}
        />
        <div className="tesla-climate-container cf">
          <TeslaCounter
            currentValue={config.temperature}
            initValues={props.counterDefaultVal.temperature}
            increment={increment}
            decrement={decrement}
          />
          <TeslaClimate
            value={config.climate}
            limit={config.temperature > 10}
            handleChangeClimate={handleChangeClimate}
          />
        </div>
        <TeslaWheels
          value={config.wheels}
          handleChangeWheels={handleChangeWheels}
        />
      </div>
      <TeslaNotice />
    </form>
  );
};

export default TeslaBattery;
