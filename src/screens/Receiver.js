import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform
} from "react-native";
import MapView, { Marker, AnimatedRegion, Polyline } from "react-native-maps";

const screen = Dimensions.get("window");
import PubNubReact from "pubnub-react";

class Receiver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 29.95539,
      longitude: 78.07513,
      routeCoordinates: []
    };

    // Pubnub publication code
    this.pubnub = new PubNubReact({
      publishKey: "x",
      subscribeKey: "x"
    });
    this.pubnub.init(this);
  }


  static navigationOptions = {title: "Receiver"};

  //code to receive messages sent in a channel
  componentDidMount() {
    this.pubnub.subscribe({
      channels: ["Personal"],
      withPresence: true
    });
    this.pubnub.getMessage('Personal', (msg) => {
      const { coordinate, routeCoordinates } = this.state;
      const { latitude, longitude } = msg.message;
      const newCoordinate = { latitude, longitude };
      const positionLatLngs = pick(msg.message, ["latitude", "longitude"]);
      if (Platform.OS === "android") {
        if (this.marker) {
          this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
        }
      } else {
        coordinate.timing(newCoordinate).start();
      }
      this.setState({
        routeCoordinates: routeCoordinates.concat([positionLatLngs]),
        latitude: msg.message.latitude,
        longitude: msg.message.longitude
      });
    });
  }


  getMapRegion() {
    return {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: 0.009,
      longitudeDelta: 0.009
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          showUserLocation
          followUserLocation
          loadingEnabled
          region={this.getMapRegion()}
        >
          <Polyline coordinates={this.state.routeCoordinates} strokeWidth={4} />
          <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  latlng: {
    width: 200,
    alignItems: "stretch"
  }
});

export default Receiver;
