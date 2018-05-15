import React, { Component } from "react";
import { StackNavigator } from 'react-navigation';
import Sender from "./Sender";
import Receiver from "./Receiver";

export default Project = StackNavigator({
  Sender: {
    screen: Sender,
  },
  Receiver: {
    screen: Receiver
  }
});


