import React from "react";
import { Fragment } from "react";

const SelectComponent = (props) =>{
    
    return (
        <Fragment>
            <select
        onChange={props.handleInputTypeChange}
        className="dropdown-menu"
        value={props.inputType}
        >
        <option value="city">Enter City</option>
        <option value="coordinates">Enter Latitude and Longitude</option>
      </select>
      </Fragment>);
}

export default SelectComponent