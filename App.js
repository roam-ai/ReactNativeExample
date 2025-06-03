import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import Roam from 'roam-reactnative';

const App = () => {
  const [locationData, setLocationData] = useState(null);


  const requestAndroidPermissions = async () => {
    try {
      const fineLocationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs location access to track your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED) {
        const backgroundLocationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: 'Background Location Permission',
            message: 'This app needs background location access to track your location even when closed.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (backgroundLocationGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('All Location Permissions Granted');
        } else {
          Alert.alert('Permission Required', 'Background location permission is necessary.');
        }
      } else {
        console.log('Fine Location Permission Denied');
      }

      Roam.requestLocationPermission();
    } catch (error) {
      console.error('Permission request error', error);
    }
  };

  const setupForegroundNotification = (enabled) => {
    if (Platform.OS === 'android') {
      Roam.setForegroundNotification(
        enabled,
        'RoamSetup',
        'Tap to open',
        'mipmap/ic_launcher',
        'com.roamsetup.MainActivity',
        'com.roamsetup.LocationService'
      );
    }
  };

  const requestPermission = () => {
    Roam.requestLocationPermission();
  };

const requestTracking = () => { 

  if (Platform.OS === 'android') {
    setupForegroundNotification(true);
    Roam.disableBatteryOptimization();
    Roam.allowMockLocation(true);
  }
    Roam.startTracking('ACTIVE');
    Roam.startListener('location', async (location) => {
      console.log('Location received:', location);
      setLocationData(location[0]);
    })
  };

const requestStopTracking = () => {
    Roam.stopTracking();
    Roam.stopListener('location');
    setLocationData(null);

  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={Platform.OS === 'ios' ?requestPermission : requestAndroidPermissions} style={styles.button}>
        <Text style={styles.buttonText}>Request Permission</Text>
      </TouchableOpacity>
      <View style={styles.buttoncontainer} >
      <TouchableOpacity onPress={requestTracking} style={styles.button}>
        <Text style={styles.buttonText}>Start Tracking</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={requestStopTracking} style={styles.button}>
        <Text style={styles.buttonText}>Stop Tracking</Text>
      </TouchableOpacity>
   
      </View>
      <View style={styles.locationBox}>
  <Text style={styles.locationTitle}>Location Data:</Text>
  {locationData && locationData.location ? (
    <>
      <Text style={styles.locationText}>Latitude: {locationData.location.latitude}</Text>
      <Text style={styles.locationText}>Longitude: {locationData.location.longitude}</Text>
      <Text style={styles.locationText}>Accuracy: {locationData.location.accuracy}</Text>
      <Text style={styles.locationText}>Activity: {locationData.activity}</Text>
      <Text style={styles.locationText}>AAID: {locationData.aaid}</Text>
    </>
  ) : (
    <Text style={styles.locationText}>{ locationData  ? locationData : "null"}</Text>
  )}
</View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
  },
  status: {
    fontSize: 16,
    marginBottom: 24,
    color: '#333',
  },
  button: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },buttoncontainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    width: '100%',
  },
  locationBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
  },
});
