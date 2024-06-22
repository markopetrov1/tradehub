import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../themes/colors';


export const MessageItem = ({ message, currentUser }) => {
    const isCurrentUser = currentUser?.id == message?.userId;
  
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUser : styles.otherUser,
        ]}
      >
        <View
          style={[
            styles.messageWrapper,
            isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
          ]}
        >
          <Text style={styles.messageText}>{message?.text}</Text>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    messageContainer: {
      flexDirection: 'row',
      marginVertical: 10,
    },
    currentUser: {
      justifyContent: 'flex-end',
    },
    otherUser: {
      justifyContent: 'flex-start',
    },
    messageWrapper: {
      maxWidth: '80%',
      borderRadius: 15,
      padding: 10,
    },
    currentUserMessage: {
      backgroundColor: colors.bg.secondary,
    },
    otherUserMessage: {
      backgroundColor: 'gray', 
      opacity: 0.3,
    },
    messageText: {
      color: '#fff',
    },
  });