import React, { Component } from 'react';
import {
  View,
  StatusBar,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import firebase from 'firebase'
import User from '../User'

console.disableYellowBox = true;

export default class AuthLodingScreen extends Component{
    constructor (props) {
        super(props)
        this._bootstrapAsync()
    }

    componentWillMount() {
        var firebaseConfig = {
            apiKey: "AIzaSyBHjsJjWTkJmFa0RLWqyQzXKslW5i_Ke14",
            authDomain: "chatbox-792e7.firebaseapp.com",
            databaseURL: "https://chatbox-792e7.firebaseio.com",
            projectId: "chatbox-792e7",
            storageBucket: "chatbox-792e7.appspot.com",
            messagingSenderId: "446137579041",
            appId: "1:446137579041:web:30e7658563def846d99560",
            measurementId: "G-PED864G27B"
          };
          firebase.initializeApp(firebaseConfig);
    }

    _bootstrapAsync = async() => {
        User.phone = await AsyncStorage.getItem('UserPhone')
        this.props.navigation.navigate(User.phone ? 'App' : 'Auth')
    }

    render() {
        return(
            <View>
                <ActivityIndicator />
                <StatusBar barStyle= 'default' />
            </View>
        )
    }
}