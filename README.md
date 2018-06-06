# Hackattic Basic Face Detection
This project solves the basic face detection problem from Hackattic website: https://hackattic.com/challenges/basic_face_detection.

## Installation instructions:
- Fork or clone the project
- Inside the project folder, execute: `npm install`
- Than execute `npm run dev`

## Configuration instructions:

Set your credentials in :
- src/common/settings/**hackattic.credentials.ts** 
- src/common/settings/**aws.credentials.ts**

## API Reference

> /basic-face-detection/solve

This endpoint will call the hackattic URL to solve the problem. Maybe if you are executing the project in localhost you can get a timeout error. If everything is fine you will receive: `{"result":"passed (playground mode)"}`. To remove the playground mode you need to pass false as the second parameter in HackatticService.

> /basic-face-detection/faces

This endpoint will show all the faces in the image provided by Hackattic.

![Example](https://s3.us-east-2.amazonaws.com/ls-image-recognition/faces_example.jpg)
