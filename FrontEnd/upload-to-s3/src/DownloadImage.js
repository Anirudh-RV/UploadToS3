import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { FormGroup, FormControl } from "react-bootstrap";
import keys from "./constants";

class DownloadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadFileName: "",
    };
  }

  downloadComponent = (url) => {
    axios({
      url: url, //your url
      method: "GET",
      responseType: "blob", // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", this.downloadFileName.value); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  };

  downloadFile = () => {
    this.downloadComponent(
      `https://${keys.S3_BUCKET}.s3.amazonaws.com/${keys.UPLOAD_DIRECTORY}/${this.downloadFileName.value}`
    );
  };

  render() {
    return (
      <div>
        <h2>Download from S3</h2>
        <div>
          <div>
            <FormGroup controlId="name" bsSize="large">
              <FormControl
                autoFocus
                placeholder="Download File Name"
                ref={(c) => (this.downloadFileName = c)}
              />
            </FormGroup>
          </div>
          <div>
            <Button onClick={this.downloadFile} type="button">
              Download
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default DownloadImage;
