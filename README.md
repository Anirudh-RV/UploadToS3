# UploadToS3

Backend to upload data to S3 directly

# Process being followed.

1. Cut out the middle man for uploading images using anotherb backend environment
2. Upload images directly from ReactJS

Alternative approaches:

1. Use NodeJS to upload the images to the backend from react.
2. Process the Image on the backend in NodeJS and upload to S3 as required.
3. Retrieval will also be done using NodeJS.
4. Will need to setup an API for ease of communicating between the front-end and back-end.

Longer process even though this might be more suitable in the real world due to a huge dependence on AWS in the front-end code.
