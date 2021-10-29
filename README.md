# Web Application To Upload / Download Objects to AWS S3

Web application to Upload to AWS S3 and to Download from AWS S3.

# Feature List

1. Upload images/videos to AWS S3.
2. Download images/videos from AWS S3.

# Tech Stack Used

1. FrontEnd: ReactJS.
2. Backend: NodeJS.
3. Storage: AWS S3.
4. AWS SDK for connection.

# How It Works

1. The UI built with React will have option for selecting multiple objects for upload or for downloading an object.
2. The Upload will go through the following process:
   React UI -> NodeJS Backend -> Storage in local storage -> Use AWS-SDK to push to S3 Storage.
3. The download option will help in downloading the object who's name is specified in the input box directly from S3.

# DEMO

https://drive.google.com/drive/folders/1YotwCul-cCetOYgT4fUMH0tpF0POXDbe?usp=sharing
