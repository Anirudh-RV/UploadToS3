import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import UploadImage from "./UploadImage";
import DownloadImage from "./DownloadImage";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <UploadImage />
    <DownloadImage />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
