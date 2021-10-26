import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import UploadToS3 from "./UploadToS3";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <UploadToS3 />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
