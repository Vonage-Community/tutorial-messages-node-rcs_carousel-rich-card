# How to Send RCS Rich Card Carousels With Node.js
A node application that allows you to send ich Communications Services(RCS) Rich Card Carousels.

> You can find full step-by-step instructions on the [Vonage Developer Blog](#). (Not published yet)



## Prerequisites
1. [Node.js installed on your machine.](https://nodejs.org/en/download)
2. [ngrok installed for exposing your local server to the internet.](https://ngrok.com/downloads/mac-os)
3. [Vonage Developer Account](https://developer.vonage.com/sign-up)
4. A registered RCS Business Messaging (RBM) Agent.
5. A phone with RCS capabilities for testing.



## Instructions
1. Clone this repo
2. Initialize your Node application and install dependencies:
```
npm init -y
npm install express dotenv @vonage/server-sdk
```
4. Rename the `.env.example` file to `.env`, and add your `VONAGE_APPLICATION_ID` and `RCS_SENDER_ID` values.
5. Add your `private.key` file in the root of the project directory.
6. Start your Node server:
```
node index.js
```
7. Create a tunnel using ngrok:
```
ngrok http 3000
```
8. Test your app by sending an RCS suggested reply from the command line:
```
curl -X POST https://YOUR_NGROK_URL/send-rcs-carousel \
  -H "Content-Type: application/json" \
  -d '{"to": "YOUR_RCS_TEST_NUMBER"}'
```
