import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import { Progress } from "reactstrap";
import Button from "react-bootstrap/Button";
import keys from "./constants";

class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: 0,
    };
    this.nodeServerUrl = keys.NODE_SERVER_URL;
  }

  checkMimeType = (event) => {
    //getting file object
    let files = event.target.files;
    //define message container
    let err = [];
    // list allow mime type
    const types = ["image/png", "image/jpeg", "image/gif"];
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every((type) => files[x].type !== type)) {
        // create error message and assign to container
        err[x] = files[x].type + " is not a supported format\n";
      }
    }
    for (var z = 0; z < err.length; z++) {
      // if message not same old that mean has error
      // discard selected file
      event.target.value = null;
    }
    return true;
  };

  maxSelectFile = (event) => {
    let files = event.target.files;
    if (files.length <= 10) {
      return true;
    }
    const msg = "Only 10 images can be uploaded at a time";
    event.target.value = null;
    return false;
  };

  checkFileSize = (event) => {
    let files = event.target.files;
    let size = 2000000;
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + "is too large, please pick a smaller file\n";
      }
    }
    for (var z = 0; z < err.length; z++) {
      // if message not same old that mean has error
      // discard selected file
      event.target.value = null;
    }
    return true;
  };
  ///&& this.checkMimeType(event) taken out for uploading any file.
  // && this.checkFileSize(event) taken out for removing file size restriction.
  onChangeHandler = (event) => {
    var files = event.target.files;
    if (this.maxSelectFile(event)) {
      // if return true allow to setState
      this.setState({
        selectedFile: files,
        loaded: 0,
      });
    }
  };

  onClickHandler = () => {
    const data = new FormData();
    // getting userName from input
    var userName = this.props.userName;
    // filling FormData with selectedFiles(Array of objects)
    for (var x = 0; x < this.state.selectedFile.length; x++) {
      data.append("file", this.state.selectedFile[x]);
    }
    // header carries information of userName to backend with data
    axios
      .post(this.nodeServerUrl + "/upload", data, {
        headers: {
          userName: "teal",
          type: "imageUpload",
        },
        onUploadProgress: (ProgressEvent) => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
          });
        },
      })
      .then((res) => {
        // then print response status
      })
      .catch((err) => {
        // then print response status
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <h2 className="appName" ref={(c) => (this.heading = c)}></h2>
        <div className="uploadImages">
          <div class="form-group files">
            <label>Upload Your File </label>
            <input
              id="inputUploadID"
              type="file"
              class="form-control"
              multiple
              onChange={this.onChangeHandler}
            />
          </div>
          <div class="form-group">
            <Progress
              id="progressBar"
              max="100"
              color="success"
              value={this.state.loaded}
            >
              {Math.round(this.state.loaded, 2)}%
            </Progress>
          </div>

          <Button
            className="StartButton"
            block
            bsSize="large"
            onClick={this.onClickHandler}
            type="button"
          >
            Upload
          </Button>
        </div>
      </div>
    );
  }
}

export default UploadImage;
