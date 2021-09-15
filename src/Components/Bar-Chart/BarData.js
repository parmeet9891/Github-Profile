import { Bar } from "react-chartjs-2";
import React from "react";
const BarData = (props) => {
  return (
    <Bar
      data={props.data}
      options={props.options}
      width={props.width}
      height={props.height}
    />
  );
};

export default React.memo(BarData);
