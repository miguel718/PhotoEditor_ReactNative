import React, {Component} from 'react';
import {Platform, findNodeHandle,StyleSheet, Text, View,TouchableOpacity,TouchableHighlight,Image,ScrollView} from 'react-native';
import {RNCamera} from 'react-native-camera';

import CommonStyles from '../../common/CommonStyle';

import resolveAssetSource from "react-native/Libraries/Image/resolveAssetSource";
import { RNPhotoEditor } from 'react-native-photo-editor'

import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'




const { Styles } = CommonStyles;

//const apiUrl = "http://192.168.1.154:88";
const apiUrl = "http://skypos.si1.skylab.si";

var self= null;
export default class ConfirmScreen extends Component {
  constructor(props) {
    super(props);
    const {state} = props.navigation;    
    this.state = {
      imageUri:state.params.image,
    }    
    self = this;    
  }
  componentDidMount() {    
    
  }  
  render() {
    return (
      <View style={Styles.cameraContainer}>
        <Image         
        source={{uri:"data:image/png;base64," + this.state.imageUri}} style={{flex:1}}/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});