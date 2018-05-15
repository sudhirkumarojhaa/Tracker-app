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
import PubNubReact from "pubnub-react";
import haversine from "haversine";
import pick from "lodash/pick";

const screen = Dimensions.get("window");

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 29.95539;
const LONGITUDE = 78.07513;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Sender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 29.95539,
      longitude: 78.07513,
      routeCoordinates: [],
      distanceTravelled: 0,
      polyCoords: [],
      prevLatLng: {},
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE
      })
    };

    // Pubnub
    this.pubnub = new PubNubReact({
      publishKey: "x",
      subscribeKey: "x"
    });
    this.pubnub.init(this);
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      position => {},
      error => alert(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );
  }

  componentDidUpdate() {
    this.pubnub.publish({
      message: {
        latitude: this.state.latitude,
        longitude: this.state.longitude
      },
      channel: "Personal"
    });
  }

  componentDidMount() {
    console.disableYellowBox = true;
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        const {
          coordinate,
          polyCoords,
          routeCoordinates,
          distanceTravelled
        } = this.state;
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude
        };

        const positionLatLngs = pick(position.coords, [
          "latitude",
          "longitude"
        ]);

        if (Platform.OS === "android") {
          if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(
              newCoordinate,
              500
            );
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }

        this.setState({
          latitude,
          longitude,
          polyCoords: polyCoords.concat([newCoordinate]),
          routeCoordinates: routeCoordinates.concat([positionLatLngs]),
          distanceTravelled:
            distanceTravelled + this.calcDistance(newCoordinate),
          prevLatLng: newCoordinate
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);

    // Unsubscribe pubnub channel
    this.pubnub.unsubscribe({
      channels: ["Personal"]
    });
  }

  PostLink = () => {
    this.props.navigation.navigate("Receiver")
  };

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  getMapRegion() {
    return {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: 0.009,
      longitudeDelta: 0.009
    };
  }

  static navigationOptions = {title: "Sender"};

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
          <Polyline coordinates={this.state.polyCoords} strokeWidth={5} />
          <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
          />
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.bubble, styles.button]}>
            <Text style={styles.bottomBarContent}>
              {parseFloat(this.state.distanceTravelled).toFixed(2)} km
            </Text>
          </TouchableOpacity>
        </View>
       <TouchableOpacity onPress={this.PostLink.bind(this)}>
         <Text style={styles.next}>Next</Text>
       </TouchableOpacity>
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
  },
  next:{
    marginVertical: 20,
    backgroundColor: "#000",
    width: "100%",
    color: "#fff",
    paddingHorizontal: 30,
    paddingVertical:5
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent"
  }
});

export default Sender;
