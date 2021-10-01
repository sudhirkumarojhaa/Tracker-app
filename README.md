# Tracker-app
This app is built with the help of React native and PUBNUB framework.
### Sender
![alt tag](./assets/sender.png)
### Reciever 
![alt tag](./assets/receiver.png)


###
An app build using React native for dynamic location tracking. You can install this app in your device and can track location of anyone who is connected to your channel.

Clone the repository and use the Profile you want to use i.e Sender/Receiver

### PUBNUB keys

for the channel keys , Create an account in PUBNUB and obtain the key which is to be added in publish and subscribe section within the code to connect and create channel in the database.

## Clone this repository and follow these steps;

### Requirement 
1. XCode 
2. VS code

```
npm install
```
 ```
 cd ios
 pod install 
 ```
```
react-native run-ios (for iOS)
```

```
react-native run-android (for android)
```

## Troubleshooting Steps
#### App is giving error
* If this repo is not working for you, I would suggest that you create your own [react-native](https://facebook.github.io/react-native/docs/getting-started.html) project
* Install [react-native-maps](https://github.com/react-community/react-native-maps/) using their [installation guide](https://github.com/react-community/react-native-maps/blob/master/docs/installation.md)
* Replace its App.js with this project's App.js
