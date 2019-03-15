import React, {Component} from 'react';
import {Platform, Animated,StyleSheet,Easing, Text, View,TouchableWithoutFeedback,TouchableHighlight,Image,ScrollView} from 'react-native';
import {RNCamera} from 'react-native-camera';
import LinearGradient from 'react-native-linear-gradient';

import CommonStyles from '../../common/CommonStyle';

import resolveAssetSource from "react-native/Libraries/Image/resolveAssetSource";
import { RNPhotoEditor } from 'react-native-photo-editor'
import Permissions from 'react-native-permissions'

import ImagePicker from 'react-native-image-picker';

import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'


const { Styles } = CommonStyles;

const apiUrl = "http://skypos.si1.skylab.si";


var self= null;
export default class PreviewScreen extends Component {  
  constructor(props) {
    super(props);
    
  
    this.state = {
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
      },
      imageUri:'',
      buttonDisabled:false,
      stickers:[],
      colors:['#FFFFFF','#000000','#3797F0','#70C050','#FDCB5B','#FD8C32','#ED4855','#D00769','#BD10E0','#FF3636']
    }
    self = this;
    
    //this.setState({ viewRef: findNodeHandle(this.backgroundImage) });    
  }
  componentWillMount()
  {
    this.spinValue = new Animated.Value(0)    
  }
  componentDidMount() {
    Permissions.checkMultiple(['camera','photo']).then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ photoPermission: response })
    })    
    var result = this.getStickers();
    this.setState({stickers:result});    
  }
  getStickers()
  {
    const request = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      url: apiUrl + '/stickers/info.json',
      method: 'get'
      //body: JSON.stringify(device)
    }    
    fetch(request.url, request)
      .then(response => {
        if (response.ok) {
          response
            .json()
            .then(result => {              
              self.setState({stickers:result});              
            });
        } else {

        }
      })
      .catch(error => {        
        return false;
    });
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
  
  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    })
    return (
      <View style={Styles.cameraContainer}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={Styles.cameraPreview}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />
        <View style={Styles.vwControl}>
          <TouchableWithoutFeedback disabled={this.state.buttonDisabled} style={Styles.backButtonContainer} activeOpacity={1.0}
              onPress={()=>this.props.navigation.goBack()}>
              <Image style={Styles.imgBackButton} source={require('../../common/Images/ic_back_white.png')}/>
          </TouchableWithoutFeedback>
          <LinearGradient colors={['#00000000', '#000000']} style={Styles.barBack}>          
            <View style={Styles.vwBottomBar}>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <TouchableWithoutFeedback disabled={this.state.buttonDisabled} style={Styles.smallButtonContainer} activeOpacity={1.0}
                    onPress={this.openImagePicker}>
                      <Image style={{width:24,height:24}} source={require('../../common/Images/gallery.png')}/>
                </TouchableWithoutFeedback>
              </View>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <TouchableWithoutFeedback disabled={this.state.buttonDisabled} style={Styles.smallButtonContainer} activeOpacity={1.0} onPress={this.switchFlash}>
                      <Image style={{width:24,height:28}} source={this.flashIcon}/>
                </TouchableWithoutFeedback>
              </View>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <TouchableWithoutFeedback disabled={this.state.buttonDisabled} style={Styles.smallButtonContainer} activeOpacity={1.0} underlayColor={'rgba(255,255,255,0.1)'}
                        onPress={this.onTakePhoto.bind(this)}>
                      <Image style={Styles.imgLargeButton} source={require('../../common/Images/ic_capture.png')}/>
                </TouchableWithoutFeedback>
              </View>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <TouchableWithoutFeedback disabled={this.state.buttonDisabled} style={Styles.smallButtonContainer} activeOpacity={1.0} onPress={this.switchType}>
                      <Animated.Image style={{width:22,height:22,transform: [{rotate: spin}]}} source={require('../../common/Images/ic_rotate.png')}/>
                </TouchableWithoutFeedback>
              </View>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <TouchableWithoutFeedback disabled={this.state.buttonDisabled} style={Styles.smallButtonContainer} activeOpacity={1.0}>
                      <Image style={{width:24,height:21,display:'none'}} source={require('../../common/Images/ic_menu.png')}/>
                </TouchableWithoutFeedback>
              </View>
            </View>  
          </LinearGradient>
        </View>        
      </View>
    );
  }

  get flashIcon() {
    let icon;
    const { auto, on, off } = RNCamera.Constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      icon = require('../../common/Images/ic_flash_mode_auto.png');
    } else if (this.state.camera.flashMode === on) {
      icon = require('../../common/Images/ic_flash_mode_on.png');
    } else if (this.state.camera.flashMode === off) {
      icon = require('../../common/Images/ic_flash_mode_off.png');
    }

    return icon;
  }
  switchType = () => {
    this.spinValue = new Animated.Value(0)    
    Animated.timing(
        this.spinValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      }
    ).start()
    let newType;
    const { back, front } = RNCamera.Constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
      },
    });
  }

  switchFlash = () => {
    let newFlashMode;
    const { auto, on, off } = RNCamera.Constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  }

  openImagePicker = () => {
    const options = {
      title: 'Select Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (!response.didCancel || !response.error) {
        const url = Platform.OS === 'ios' ? response.origURL : `file://${response.path}`;
        if (url != "file://undefined")
        {          
          this.setState({ imageUri: url});        
          this.onEditPhoto();
        }
      }
    });
  }


  onEditPhoto = () =>{
    let filter;
    if (Platform.OS === 'ios') {
      filter = [];
    } else if (Platform.OS === 'android') {
      filter = ".*\\.*";
    }
    this.setState({buttonDisabled:false});
    RNPhotoEditor.Edit({
      baseUrl: apiUrl,
      path: this.state.imageUri,
      stickers: this.state.stickers,
      hiddenControls: [],
      colors: this.state.colors,
      onDone: (data) => {
        this.props.navigation.navigate('ConfirmScreen',{image:data});
      },
      onCancel: () => {
        
      }
    });
  }
  onTakePhoto = async function() {
    if (this.camera) {
      this.setState({buttonDisabled:true});
      const options = { quality: 0.5, base64: true,skipProcessing: true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      this.setState({ imageUri: data.uri});      
      this.onEditPhoto();
    }
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
  linearGradient: {        
    position:'absolute',
    height:100    
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});