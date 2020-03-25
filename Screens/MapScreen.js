import React, { Component } from 'react';
import { View, Dimensions, PermissionsAndroid, Platform, Alert, StyleSheet, Text, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler'
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions'
import Carousel from 'react-native-snap-carousel'

import Styles from '../Constants/Styles'
import { messaging } from 'firebase';
console.disableYellowBox = true;

const { width, height } = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATTITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATTITUDE_DELTA * ASPECT_RATIO

export default class MapScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            initialPosition: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0
            },
            markerPosition: {
                latitude: 0,
                longitude: 0,
            },
            coordinates: [
                { name: 'F - 6', latitude: 33.729532, longitude: 73.076471, image: require('../Images/F-6.jpg') },
                { name: 'F - 7', latitude: 33.720979, longitude: 73.057083, image: require('../Images/F-7.jpg') },
                { name: 'F - 8', latitude: 33.710776, longitude: 73.040515, image: require('../Images/F-8.jpg') },
                { name: 'F - 10', latitude: 33.696581, longitude: 73.011788, image: require('../Images/F-10.jpg') },
                { name: 'E-9', latitude: 33.720689, longitude: 73.015297, image: require('../Images/E-9.jpg') },
            ],
            markers: []
        }
    }

    componentDidMount() {
        this.requestLoctaionPermission()
    }

    requestLoctaionPermission = async () => {
        if (Platform.OS === 'ios') {
            var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
            if (response === 'granted') {
                console.log('IOS granted')
                this.locateCurrentPosition()
            }
        } else {
            var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            if (response === 'granted') {
                console.log('android granted')
                this.locateCurrentPosition()
            }
        }
    }

    locateCurrentPosition = () => {
        Geolocation.getCurrentPosition(position => {
            var lat = parseFloat(position.coords.latitude)
            var long = parseFloat(position.coords.longitude)

            var initialRegion = {
                latitude: lat,
                longitude: long,
                latitudeDelta: LATTITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }
            this.setState({ initialPosition: initialRegion })
            this.setState({ markerPosition: initialRegion })
            console.log('my location', this.state.initialPosition)
        }, error => Alert.alert(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 })
    }

    _renderItem = ({ item }) => {
        return (
            <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', height: 200, width: 300, padding: 24, borderRadius: 25 }}>
                <Text style={{ color: 'white', fontSize: 22, alignSelf: 'center' }}>{item.name}</Text>
                <Image source={item.image} style={{ height: 120, width: 300, bottom: 0, position: 'absolute', borderBottomLeftRadius: 25, borderBottomRightRadius: 25 }} />
            </View>
        )
    }

    onItemChange = (index) => {
        let location = this.state.coordinates[index]
        this._map.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.095,
            longitudeDelta: 0.035
        })
        //this.state.markers[index].showCallout()
    }

    onMarkerPress = (location , index) => {
        this._map.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.095,
            longitudeDelta: 0.035
        })

        this._carousel.snapToItem(index)
    }

    render() {
        return (
            <View style={{ ...StyleSheet.absoluteFillObject }}>
                <MapView
                    style={{ ...StyleSheet.absoluteFillObject }}
                    provider={PROVIDER_GOOGLE}
                    ref={map => this._map = map}
                    showsUserLocation={true}
                    initialRegion={this.state.initialPosition}
                >
                    <Marker
                        draggable
                        coordinate={this.state.markerPosition}
                    >

                    </Marker>

                    {
                        this.state.coordinates.map((marker,index) => {
                            <Marker
                                key={marker.name}
                                ref={ref => this.state.markers[index] = ref}
                                onPress={() => this.onMarkerPress(marker,index)}
                                coordinate={{ latitude: marker.longitude, latitudeDelta: marker.latitudeDelta, longitude: marker.longitude, longitudeDelta: marker.longitudeDelta }}
                            >
                                <Callout>
                                    <Text>{marker.name}</Text>
                                </Callout>

                            </Marker>
                        })
                    }
                </MapView>
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.coordinates}
                    containerCustomStyle={{ position: 'absolute', bottom: 0, marginBottom: 48 }}
                    renderItem={this._renderItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={300}
                    removeClippedSubviews={false}
                    onSnapToItem={(index) => this.onItemChange(index)}
                />
            </View>
        )
    }
}
