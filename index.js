/**
 * BuzzBus React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, ScrollView
} from 'react-native';
import { StackNavigator, NavigationActions} from 'react-navigation';
import MainScreen from './src/screens/MainScreen/index';
import PreviewScreen from './src/screens/PreviewScreen/index';
import ConfirmScreen from './src/screens/ConfirmScreen/index';


// global.__DEV__=false;
const Routes = StackNavigator({
    MainScreen: {screen:MainScreen, navigationOptions:{header:true}},
    PreviewScreen: {screen:PreviewScreen, navigationOptions:{header:true}},
    ConfirmScreen:{screen:ConfirmScreen,navigationOptions:{header:true}}
})
//TrackPlayer.registerEventHandler(require('./src/components/RemoteControlHandler.js'));
AppRegistry.registerComponent('myApp', () =>  Routes);
