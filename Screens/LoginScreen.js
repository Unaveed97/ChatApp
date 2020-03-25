import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    AsyncStorage
} from 'react-native';
import firebase from 'firebase'

import User from '../User'
import styles from '../Constants/Styles'

console.disableYellowBox = true;

export default class LoginScreen extends Component {

    static navigationOptions = {
        header: null,
    }

    state = {
        phone: '',
        Name: '',
    }

    handelChange = key => val => {
        this.setState({ [key]: val })
    }


    SubmitForm = async () => {
        if (this.state.phone.length < 10 || this.state.phone == ' ') {
            Alert.alert('Error', 'Wrong Phone Number')
        }
        else if (this.state.Name.length < 10 || this.state.Name == ' ') {
            Alert.alert('Error', 'Plz Enter the Correct Name')
        }
        else {
            //Save Data
            await AsyncStorage.setItem('UserPhone', this.state.phone)
            User.phone = this.state.phone
            firebase.database().ref('user/' + User.phone).set({ name: this.state.Name })
            this.props.navigation.navigate('App')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    placeholder='Phone Number'
                    keyboardType='number-pad'
                    style={styles.input}
                    value={this.state.phone}
                    onChangeText={this.handelChange('phone')}
                />
                <TextInput
                    placeholder='Name'
                    style={styles.input}
                    value={this.state.Name}
                    onChangeText={this.handelChange('Name')}
                />
                <TouchableOpacity onPress={this.SubmitForm}>
                    <Text style={styles.BtnText}> Enter </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

