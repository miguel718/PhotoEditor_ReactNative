import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity,TouchableHighlight,Image,ScrollView} from 'react-native';

import CommonStyles from '../../common/CommonStyle';

import Permissions from 'react-native-permissions'

import ImagePicker from 'react-native-image-picker';

const { Styles } = CommonStyles;

var self= null;
export default class MainScreen extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      
    }
    self = this;    
  }
  componentDidMount() {
    Permissions.checkMultiple(['camera','photo']).then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ photoPermission: response })
    })
  }  
  _requestPermission = () => {
    Permissions.request('camera').then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ photoPermission: response })
    })
    Permissions.request('photo').then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ photoPermission: response })
    })
  }
  goCamera()
  {
    this.props.navigation.navigate('PreviewScreen');
  }
  render() {    
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity onPress={this.goCamera.bind(this)}>
                <Text style={{color:'#808080'}}>Open Camera</Text>        
            </TouchableOpacity>            
      </View>
    );
  }
}