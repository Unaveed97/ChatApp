import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
console.disableYellowBox = true;


const styles = StyleSheet.create({
  container: {
    height: hp('100%'),
    width: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    marginBottom: 10,
    borderRadius: 10,
  },
  inputMessage: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '85%',
    marginBottom: 10,
    borderRadius: 20,
  },
  BtnText: {
    color: 'darkblue',
    fontSize: 20
  },
  bottomBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    height: 60,
  },
  sendBtn: {
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 10,
    height: 40,
    width: 40,
    paddingTop: 10,
    paddingLeft: 5,
    backgroundColor: '#2196F3',
    borderRadius: 20
  },
})

export default styles