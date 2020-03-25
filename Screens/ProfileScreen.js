import React, { Component } from 'react';
import {
    Text,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Alert,
    AsyncStorage,
    Image,
    View,
    ActivityIndicator
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import firebase from 'firebase'
import styles from '../Constants/Styles'
import User from '../User'

console.disableYellowBox = true;

export default class ProfileScreen extends Component {
    static navigationOptions = {
        title: 'Profile',
    }

    state = {
        name: User.name,
        imageSource: User.image ? { uri: User.image } : require('../Images/user.png'),
        upload: false
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    _LogOut = async () => {
        await AsyncStorage.clear()
        this.props.navigation.navigate('Auth')
    }

    ChangeName = async () => {
        if (this.state.name.length < 6 || this.state.name == ' ') {
            Alert.alert('Error', 'Plz Enter the Correct Name')
        } else if (User.name !== this.state.name) {
            User.name = this.state.name
            this.updateUser()
        }
    }

    changeImage = () => {
        const options = {
            quality: 0.7, allowsEditing: true, mediaType: 'photo', noData: true
            ,storageOptions: {
                skipBackup: true, waitUntilSaved: true, path: 'images', cameraRoll: true
            }
        }
        ImagePicker.showImagePicker(options, response => {
            if (response.error) {
                console.log(error)
            } else if (!response.didCancel) {
                this.setState({
                    upload: true,
                    imageSource: { uri: response.uri }
                }, this.uploadFile)
            }
        })
    }

    updateUser = () => {
        firebase.database().ref('user').child(User.phone).set({ User })
        Alert.alert('Success', 'Successfully Saved..')
    }

    updateUserImage = (imageUrl) => {
        User.image = imageUrl
        this.updateUser()
        this.setState({ upload: false, imageSource: { uri: imageUrl } })
    }

    uploadFile = async () => {
        const file = await this.uriToBlob(this.state.imageSource.uri)
        firebase.storage().ref(`profile_pictures/${User.phone}.png`)
            .put(file)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => this.updateUserImage(url))
            .catch(error => {
                this.setState({
                    upload: false,
                    imageSource: require('../Images/user.png')
                });
                Alert.alert('Error', 'Error on Upload image')
            })
    }

    uriToBlob = (uri) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.onload = function () {
                resolve(xhr.response)
            }
            xhr.onerror = function () {
                reject(new Error('Error on upload image'))
            }
            xhr.responseType = 'blob'
            xhr.open('GET', uri, true)
            xhr.send(null)
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress={this.changeImage}>
                    {
                        this.state.upload ? <ActivityIndicator size='large' /> :
                            <Image style={{ borderRadius: 100, width: 120, height: 120, resizeMode: 'cover', marginBottom: 10 }} source={this.state.imageSource} />
                    }
                </TouchableOpacity>
                <Text style={{ fontSize: 20 }}>
                    {User.phone}
                </Text>
                <TextInput
                    style={styles.input}
                    value={this.state.name}
                    onChangeText={this.handleChange('name')}
                />
                <TouchableOpacity onPress={this.ChangeName}>
                    <Text style={styles.BtnText}>Change Name</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._LogOut}>
                    <Text style={styles.BtnText}>LogOut</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}
