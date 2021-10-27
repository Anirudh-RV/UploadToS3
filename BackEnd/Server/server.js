const AWS = require("aws-sdk");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const KEYS = require("./constants").AWS_KEYS;
const path = require("path");
const fs = require("fs");
const app = express();
const port = 4000;

app.use(cors());

//Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));
app.use("/static", express.static(__dirname + "/public"));
app.use("/img", express.static(path.join(__dirname, "public/uploaded")));
app.use("/file", express.static(path.join(__dirname, "public/file")));

const s3 = new AWS.S3({
  accessKeyId: KEYS.AWS_ACCESS_KEY_ID,
  secretAccessKey: KEYS.AWS_SECRET_ACCESS_KEY,
});

// 'public/Uploaded is destination'
// for scaling it to multiple users, send user_id to the backend and save under a new folder with the user_id name.
const storage = multer.diskStorage({
  destination: (req, _, cb) => {
    const fs = require("fs");
    dir = "public/uploaded/" + req.headers["username"];
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    dir = "public/uploaded/" + req.headers["username"] + "/uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadFileToS3 = (fileName) => {
  // adding to AWS S3 using aws-sdk

  const fileContent = fs.readFileSync(fileName);

  const params = {
    Bucket: KEYS.S3_BUCKET,
    Key: `${fileName}`,
    Body: fileContent,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.log(`Error: ${err}`);
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

const upload = multer({ storage: storage }).array("file");

app.get("/", (req, res) => {
  return res.send("Hello Server");
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
      // A Multer error occurred when uploading.
    } else if (err) {
      return res.status(500).json(err);
      // An unknown error occurred when uploading.
    }
    const fileNames = req.headers["filenames"].split(",");
    //console.log(`file names: ${fileNames[0]}`);
    for (let i = 0; i != fileNames.length; ++i) {
      uploadFileToS3(
        "public/uploaded/" +
          req.headers["username"] +
          "/uploads/" +
          fileNames[i]
      );
    }
    return res.status(200).send(req.file);
    // Everything went fine.
  });
});

app.listen(port, function () {
  console.log("running on port: " + port);
});
