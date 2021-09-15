import { Pie } from "react-chartjs-2";
import React from "react";
const PieData = (props) => {
  return (
    <Pie
      data={props.data}
      options={props.options}
      width={props.width}
      height={props.height}
    />
  );
};

export default React.memo(PieData);
