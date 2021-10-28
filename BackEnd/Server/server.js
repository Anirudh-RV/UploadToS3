const AWS = require("aws-sdk");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const KEYS = require("./constants").AWS_KEYS;
const fs = require("fs");
const app = express();
const port = 4000;

// Enable CORS
app.use(cors());

// Serve static content for the app from the "public" directory in the application directory from local storage.
app.use(express.static(__dirname + "/public"));
app.use("/static", express.static(__dirname + "/public"));

const s3Instance = new AWS.S3({
  accessKeyId: KEYS.AWS_ACCESS_KEY_ID,
  secretAccessKey: KEYS.AWS_SECRET_ACCESS_KEY,
});

// Using Multer to store in local storage before pushing it to S3
const localStorage = multer.diskStorage({
  destination: (req, _, cb) => {
    dir = `public/uploaded/${req.headers["username"]}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    dir = `public/uploaded/${req.headers["username"]}/uploads`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

// Uploading to LocalStorage
const uploadFilesToLocalStorage = multer({ storage: localStorage }).array(
  "file"
);

// Uploading to S3
const uploadFileToS3 = (fileName) => {
  const fileContent = fs.readFileSync(fileName);

  const params = {
    Bucket: KEYS.S3_BUCKET,
    Key: fileName,
    Body: fileContent,
  };

  s3Instance.upload(params, (err, data) => {
    if (err) {
      console.log(`Error: ${err}`);
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

// Sending mulitple files for upload to S3.
const processFilesForS3 = (fileNameArray, userName) => {
  const fileNames = fileNameArray.split(",");
  for (let i = 0; i != fileNames.length; ++i) {
    uploadFileToS3(`public/uploaded/${userName}/uploads/${fileNames[i]}`);
  }
};

app.get("/", (req, res) => {
  return res.send(`Node Server running on port: ${port}`);
});

// Handles POST calls for upload of objects {Local Storage -> S3 Storage}.
app.post("/upload", (req, res) => {
  uploadFilesToLocalStorage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).json(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json(err);
    }

    // Upload to S3 after writing to local storage.
    processFilesForS3(req.headers["filenames"], req.headers["username"]);

    // Return 200 status on success.
    return res.status(200).send(req.file);
  });
});

app.listen(port, () => console.log(`running on port:${port}`));
