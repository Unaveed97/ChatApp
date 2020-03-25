import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    AsyncStorage,
    FlatList,
    SafeAreaView,
    Image,
    Dimensions
} from 'react-native';
import firebase from 'firebase'

import styles from '../Constants/Styles'
import User from '../User'

console.disableYellowBox = true;

export default class HomeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    state = {
        users: [],
        dbRef: firebase.database().ref('user')
    }

    componentDidMount() {
        this.state.dbRef.on('child_added', (val) => {
            let person = val.val()
            person.phone = val.key
            if (person.phone === User.phone) {
                User.name = person.name
                User.image = person.image ? person.image : null
            }
            else {
                this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }
        })
    }

    renderRow = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Chat', item)}
                style={{ flexDirection: 'row', alignItems:'center',padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                <Image
                    source={item.image ? { uri: item.image } : require('../Images/user.png')}
                    style={{ width: 40, height: 40, resizeMode: 'cover', borderRadius: 32,marginRight:10 }}
                />
                <Text style={{ fontSize: 20 }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const { height } = Dimensions.get('window')
        return (
            <SafeAreaView>
                <FlatList
                    style={{ height }}
                    data={this.state.users}
                    renderItem={this.renderRow}
                    keyExtractor={(item) => item.phone}
                    ListHeaderComponent={() => <Text style={{ fontSize: 30, marginVertical: 10, marginLeft: 10, fontWeight: 'bold' }}>Chats</Text>}
                />
            </SafeAreaView>
        )
    }
}
