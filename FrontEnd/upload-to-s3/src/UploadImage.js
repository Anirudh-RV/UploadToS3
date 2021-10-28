import React, { Component } from "react";
import axios from "axios";
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

  // Validate type of object being uploaded.
  checkMimeType = (event) => {
    let files = event.target.files;
    let err = [];
    // list allow mime type
    const types = ["image/png", "image/jpeg", "image/gif"];
    for (var x = 0; x < files.length; x++) {
      if (types.every((type) => files[x].type !== type)) {
        err[x] = `${files[x].type} is not a supported format\n`;
      }
    }
    for (var z = 0; z < err.length; z++) {
      // if message not same old that mean has error
      // discard selected file
      event.target.value = null;
    }
    return true;
  };

  // To cap the number of files that can be uploaded at once to 10.
  maxSelectFile = (event) => {
    let files = event.target.files;
    if (files.length <= 10) {
      return true;
    }
    const msg = "Only 10 images can be uploaded at a time";
    event.target.value = null;
    return false;
  };

  // To cap the file size of the uploads.
  checkFileSize = (event) => {
    let files = event.target.files;
    let size = 2000000;
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = `${files[x].name} is too large, please pick a smaller file\n`;
      }
    }
    for (var z = 0; z < err.length; z++) {
      // if message not same old that mean has error
      // discard selected file
      event.target.value = null;
    }
    return true;
  };

  // && this.checkMimeType(event) taken out for uploading any file.
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

  // Upon Upload click, process the files from the input and send it to the backend.
  onClickHandler = () => {
    const data = new FormData();
    var fileNames = [];
    // filling FormData with {"file": selectedFiles(Array of objects)}
    for (var x = 0; x < this.state.selectedFile.length; x++) {
      data.append("file", this.state.selectedFile[x]);
      fileNames.push(this.state.selectedFile[x].name);
    }

    // header carries information of userName,Type,File Names to backend with data
    axios
      .post(this.nodeServerUrl + "/upload", data, {
        headers: {
          userName: "teal",
          type: "Image",
          fileNames: fileNames,
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
        <h2>Upload to S3</h2>
        <div>
          <div>
            <label>Upload Your File </label>
            <input type="file" multiple onChange={this.onChangeHandler} />
          </div>
          <div class="form-group">
            <Progress max="100" value={this.state.loaded}>
              {Math.round(this.state.loaded, 2)}%
            </Progress>
          </div>

          <Button onClick={this.onClickHandler} type="button">
            Upload
          </Button>
        </div>
      </div>
    );
  }
}

export default UploadImage;
