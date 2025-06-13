# BYTES TOUCH LOG: A WEB - BASE FINGERPRINT BIOMETRIC APPLICATION AS ATTENDANCE RECORDER SYSTEM IN EVENTS FOR THE CICS BYTES OFFICE

![Project Banner](./bytes/public/logo.png)

## Capstone 2 Thesis for BSIT (Bachelor of Science in Information Technology) (Major in Database)
### Authors: Aiman C. Pumbaya & Al-Shiolla Harron

---

## Project Overview

**Title:** Bytes Touch Log: A Web-based Fingerprint Biometric Application as an Attendance Recorder System in Events for the CICS Bytes Office

**Front End:** Vue.js via JavaScript  
**Back End:** Express.js via Javascript  
**Sub-Back End Service:** Fingerprint Service via gRPC by Dahir Muhammad Dahur (Ethic41)  
**Database:** Sequelize/MySql
---

## Description (in terms of thesis)

A fingerprint-based attendance system is a sophisticated biometric technology that utilizes the distinctive patterns and ridges present in an individual's fingerprints to uniquely identify and record their presence or absence at a specific location or event (Muhammad Sarfaz, 2021).

This project is a desktop application with a web-based interface that uses a biometric device to record student attendance in a database. It serves as a digital signature for attendance during events, aiming to improve the attendance recording process by eliminating the manual system. This application will be used in the Bytes Office by the Bytes officers, enhancing the performance and efficiency of the attendance system.

---
---
## 🧠 Further Discussion of Absolute Yapp

Here’s how this project is set up:

You have the **frontend** (in the `bytes` folder) and the **backend** (in the `server` folder). These two make up the main web app — the part users interact with and the part that handles logic and API stuff.

Now, if you want to make **fingerprint scanning** work, that’s where things get a bit more interesting.

This project uses the awesome work of [Ethic41](https://github.com/Ethic41/FingerPrint), who built a gRPC service that connects the actual fingerprint hardware (**DigitalPersona** scanner) to your backend using protocol buffers.  

> ⚠️ **Make sure you're using a DigitalPersona fingerprint scanner.**  
> This setup only works with that hardware. If you're using something else, this isn’t the right project for your needs.

### 🔁 So how does it all connect?

It works like this:

```
Frontend --> Backend ==> gRPC Fingerprint Service (runs in Docker)
```

The fingerprint service **isn't a middleware** — it doesn't sit between the frontend and backend.

Instead, think of it as a **sub-backend**:  
The backend will **call it only when needed**, like when a user enrolls or identifies a fingerprint. It has its **own environment**
 
---

## Features

- **Biometric Authentication:** Utilizes fingerprint recognition for secure and accurate attendance recording.
- **Real-time Attendance Tracking:** Provides instant updates and logs for student attendance.
- **Event Management:** Supports attendance tracking for multiple events and sessions.
- **User-friendly Interface:** Intuitive design for easy navigation and usage.

---
## 🚀 Installation Guide

Follow the steps below to set up the project on your machine. This includes the frontend, backend, and fingerprint gRPC services, along with SDK installation and Docker configuration.

---

### 1. 📦 Clone the Repository

```bash
git clone https://github.com/yourusername/bytes-touch-log.git
```

---

### 2. 🔧 Project Setup

Navigate through these directories

```bash

cd bytes            # the frontend
cd server           # the backend

```
and install their dependencies

```bash

npm install         # Install 

```

---

### 3. 🧬 🧰 DigitalPersona SDK Installation

#### a. Install Requirements

Make sure the following are installed:

- Node.js (v20 or higher)

> ⚠️ *Links for the SDK and patch will be provided.*

#### a. Download and Install the DigitalPersona Web SDK

- 📥 [Download DigitalPersona Web SDKv3](https://drive.google.com/open?id=1Hg3HAqwLuqmi9F4eUAgb5WaeLyJvPQq5)  
- Just install this in your specific bit (32-bit or 64 bit) System then follow it with the patch. You will restart your PC after installing the installer

#### b. Apply the SDK Patch

- 📦 [Download SDK Patch](https://drive.google.com/file/d/1yB0oW3NtBfCBKFHSe0Blc7B7grMD854W/view?usp=sharing))
- This is the Patcher that will update the SDK for the right reasons, Your laptop will need to be restarted again after updating your sdk with this patch.

---

### 4. 🐳 Docker

- 📦 [Download Docker](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe)
- Youc can install the Docker in their website as well in [here](https://docs.docker.com/engine/install/)

### ✅ You're All Set!

---

## Usage

-Currently There Are 3 Batch File that is there for a quick Click and Start 
1. run serve.bat 
2. start.bat
3. FingerPrint Services (Make sure the docker is running before clicking this)

(I know the usage of Bat Files Are quite Dangerous SO PLEASE LOOK BEFORE YOU EXECUTE)

And I assure you this BAT files does not contain any malicious files and are only there for a faster process of startup

---

## Project Structure

```
├── bytes
│   ├── .gitignore
│   ├── jest.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── public
│   │   ├── index.html
│   │   ├── Logo.ico
│   │   ├── logo.png
│   │   ├── modules
│   │   │   └── WebSdk
│   │   │       ├── es6-shim.js
│   │   │       ├── fingerprint.sdk.min.js
│   │   │       ├── index.d.ts
│   │   │       ├── index.js
│   │   │       └── websdk.client.bundle.min.js
│   │   └── sdk
│   ├── src
│   │   ├── App.vue
│   │   ├── main.js
│   │   ├── vue.config.js
│   │   ├── assets
│   │   │   ├── logo.png
│   │   │   └── vue3-dropzone.css
│   │   ├── components
│   │   │   ├── AreaChart.vue
│   │   │   ├── BarChart.vue
│   │   │   ├── CustomHeader2.vue
│   │   │   ├── CustomHeaderNav.vue
│   │   │   ├── DonutChart.vue
│   │   │   ├── HeaderNav.vue
│   │   │   ├── HelloWorld.vue
│   │   │   └── PieChart.vue
│   │   ├── router
│   │   │   └── index.js
│   │   ├── services
│   │   │   ├── Api.js
│   │   │   └── AuthServices.js
│   │   ├── store
│   │   │   └── index.js
│   │   └── views
│   │       ├── AboutView.vue
│   │       ├── AccountList.vue
│   │       ├── AccountManagement.vue
│   │       ├── AccSetting.vue
│   │       ├── AdminDashboard.vue
│   │       ├── AttendanceFingerprint.vue
│   │       ├── AttendanceHistory.vue
│   │       ├── CaptureFingerPrint.vue
│   │       ├── DevDashboard.vue
│   │       ├── EventPage.vue
│   │       ├── HistoryLog.vue
│   │       ├── LoginPage.vue
│   │       ├── ManageEvent.vue
│   │       ├── ManageStudent.vue
│   │       ├── RegisterPage.vue
│   │       ├── StudentDashboard.vue
│   │       ├── StudentData.vue
│   │       ├── StudentFine.vue
│   │       ├── StudentsManagement.vue
│   │       ├── UploadData.vue
│   │       └── UserPage.vue
│   └── tests
│       └── unit
│           └── example.spec.js
├── fingerprint_service
│   ├── .dockerignore
│   ├── .gitignore
│   ├── composer.json
│   ├── docker-compose-fingerprint.service
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── index.php
│   ├── README.md
│   ├── coreComponents
│   │   ├── basicRequirements.php
│   │   ├── enroll.php
│   │   ├── fingerprint.php
│   │   ├── is_duplicate.php
│   │   ├── UrlEncode.php
│   │   └── verify.php
│   ├── thirdparty
│   │   ├── grpc-fingerprint-engine
│   │   │   ├── .dockerignore
│   │   │   ├── .gitignore
│   │   │   ├── Dockerfile
│   │   │   ├── README.md
│   │   │   ├── src
│   │   │   │   ├── cpp
│   │   │   │   │   ├── base64.cc
│   │   │   │   │   ├── base64.h
│   │   │   │   │   ├── CMakeLists.txt
│   │   │   │   │   ├── dpfj.h
│   │   │   │   │   ├── fingerprint_client.cc
│   │   │   │   │   ├── fingerprint_server.cc
│   │   │   │   │   ├── fingerprint.grpc.pb.cc
│   │   │   │   │   ├── fingerprint.grpc.pb.h
│   │   │   │   │   ├── fingerprint.pb.cc
│   │   │   │   │   ├── fingerprint.pb.h
│   │   │   │   │   ├── helper.cpp
│   │   │   │   │   ├── helper.h
│   │   │   │   │   ├── Makefile
│   │   │   │   │   └── cmake
│   │   │   │   │       └── common.cmake
│   │   │   │   ├── php
│   │   │   │   │   ├── composer.json
│   │   │   │   │   ├── composer.lock
│   │   │   │   │   ├── fingerprint_client.php
│   │   │   │   │   └── Fingerprint
│   │   │   │   │       ├── CheckDuplicateResponse.php
│   │   │   │   │       ├── EnrolledFMD.php
│   │   │   │   │       ├── EnrollmentRequest.php
│   │   │   │   │       ├── FingerPrintClient.php
│   │   │   │   │       ├── PreEnrolledFMD.php
│   │   │   │   │       ├── VerificationRequest.php
│   │   │   │   │       └── VerificationResponse.php
│   │   │   │   ├── GPBMetadata
│   │   │   │   │   └── Fingerprint.php
│   │   │   │   └── protos
│   │   │   │       └── fingerprint.proto
│   │   │   └── other
│   │   │       └── rough.dmd
├── Notes
│   ├── cmd stuff.txt
│   └── folder_structure.txt
└── server
├── .eslintignore
├── .eslintrc.json
├── eslint.config.mjs
├── jest.config.js
├── Midware.bat
├── package-lock.json
├── package.json
├── migrations
│   └── 20250519192528-add-isEnabled-default.js
├── src
│   ├── app.js
│   ├── bytestouchlog.sqlite
│   ├── routes.js
│   ├── config
│   │   └── config.js
│   ├── controllers
│   │   ├── AuthController.js
│   │   ├── AuthUpload.js
│   │   ├── EventController.js
│   │   └── FingerprintController.js
│   ├── gRPC
│   │   ├── fingerprint.proto
│   │   └── grpcClient.js
│   ├── middlewares
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   └── grpcService.js
│   ├── models
│   │   ├── Event.js
│   │   ├── Fingerprint.js
│   │   ├── index.js
│   │   ├── Student.js
│   │   └── User.js
│   ├── policies
│   │   └── AuthPolicy.js
│   ├── test
│   │   └── testhash.js
│   └── utils
│       └── idGenerator.js
```

---

## Technologies Used

- **Front End:** Vue.js, HTML5, CSS3, JavaScript
- **Back End:** Nodemon.js, Express.js 
- **Database:** Sequelize (for SQL databases)
- **Fingerprint Service:** gRPC, Docker, proto-build

---

## Contributors

- **Aiman C. Pumbaya** - [GitHub](https://github.com/Wet-Codes)
- **Al-Shiolla Harron** - [GitHub](https://github.com/Acclaaaah)

## Big Help To This Project

- **Dahir Muhammad Dahir** - [GitHub](https://github.com/Ethic41)

---

## Acknowledgements

We would like to thank our mentors and the CICS Bytes Office for their support and guidance throughout this project.
and Me PERSONALLY I would thank my Best Friend Amjad Rashid for Being there when I need him and My family for giving me the opportunity to approach my Dream Job and support me.

AND BIG BIG THANKS to Dahir Muhammad Dahir AKA Ethic 41, Who was able to make this happen with the fingerprint if it wasnt for him I'd Be stuck figuring out, How to make this attendance thing work in the first place. 

---

## License

This project is licensed under ..... What? all you need to know this Project is under The Universities OF Mindanao State University

---

## Contact

For any inquiries, please contact:
- **Aiman C. Pumbaya** - [pumbaya.aiman@s.msumain.edu.ph](pumbaya.aiman@s.msumain.edu.ph)
- **Al-Shiolla Harron** - [halshiolla@gmail.com](halshiolla@gmail.com)

---

![Footer Image](./bytes//public//240605213_961930994411748_4041633279056430609_n.png)

---

Feel free to contribute to this project by submitting issues or pull requests. We welcome any suggestions or improvements. Thank you for checking out our project!

---

*This README was generated with ❤️ by Aiman C. Pumbaya*
