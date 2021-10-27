import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import UploadToS3 from "./UploadToS3";
import UploadImage from "./UploadImage";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <UploadImage />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
