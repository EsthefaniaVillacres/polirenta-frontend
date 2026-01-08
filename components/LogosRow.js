import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function LogosRow({ isWeb }) {
  const logoSize = isWeb ? 150 : width * 0.25; 

  return (
    <View style={[{ marginBottom: 20 }, styles.row]}>
      <Image source={require('../assets/logo1.png')} style={[styles.logo, { width: logoSize, height: logoSize }]} resizeMode="contain" />
      <Image source={require('../assets/logo2.png')} style={[styles.logo, { width: logoSize, height: logoSize }]} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  logo: {
    
  },
});
