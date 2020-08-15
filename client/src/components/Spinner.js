import React from "react";
import spinner from "../img/spinner.gif";

export const Spinner = () => {
  return (
    <img
      alt="...loading"
      src={spinner}
      style={{ margin: "auto", width: "200px", display: "block" }}
    />
  );
};
