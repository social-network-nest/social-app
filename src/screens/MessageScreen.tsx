import React, { useRef, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  message: string;
  sender: 'me' | 'other';
}

const dummyData: Message[] = [
  { id: '1', message: '¡Hola!', sender: 'other' },
  { id: '2', message: '¡Hola! ¿Cómo estás?', sender: 'me' },
  { id: '3', message: 'Estoy bien, gracias. ¿Y tú?', sender: 'other' },
  { id: '4', message: 'Muy bien, gracias por preguntar.', sender: 'me' },
];

const MessageScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(dummyData);
  const flatListRef = useRef<FlatList>(null);
  const { user, avatar } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Image source={{ uri: avatar }} style={styles.headerAvatar} />
          <Text style={styles.headerUsername}>{user}</Text>
        </View>
      ),
    });
  }, [navigation, user, avatar]);

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      message: trimmed,
      sender: 'me',
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.messageList}
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escribe un mensaje..."
                placeholderTextColor="#888"
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messageList: {
    padding: 16,
    paddingBottom: 10,
  },
  messageBubble: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 20,
    maxWidth: '75%',
  },
  myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#EAEAEA',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  headerUsername: {
    fontSize: 17,
    fontWeight: '600',
  },
});
