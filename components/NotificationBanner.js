import React from 'react';
import { useWindowDimensions } from "react-native";
import { View, TouchableOpacity, Platform, Dimensions } from 'react-native';
import styles from '../styles/NotificationBannerStyles'; 

import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';


const NotificationBanner = ({ 
  notification, 
  onPress, 
  onClose, 
  isVisible = true 
}) => {
  if (!isVisible || !notification) return null;
const { width: screenWidth } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';
  const bannerWidth = isWeb ? Math.min(screenWidth * 0.4, 350) : screenWidth * 0.9;

  return (
    <View style={[styles.container, { width: bannerWidth }]}>
      <TouchableOpacity 
        style={styles.notificationContent}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="notifications" size={24} color="#2196F3" />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={onPress}
        >
          <Text style={styles.viewButtonText}>VER</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={onClose}
      >
        <Ionicons name="close" size={20} color="#757575" />
      </TouchableOpacity>
    </View>
  );
};


export default NotificationBanner;