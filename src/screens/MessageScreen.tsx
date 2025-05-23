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

// --- COMPONENTES INTERNOS ---
const HeaderTitle = ({ avatar, user }: { avatar: string; user: string }) => (
  <View style={styles.headerTitleContainer}>
    <Image source={{ uri: avatar }} style={styles.headerAvatar} />
    <Text style={styles.headerUsername}>{user}</Text>
  </View>
);

const MessageBubble = ({ message, sender }: { message: string; sender: 'me' | 'other' }) => (
  <View
    style={[
      styles.messageBubble,
      sender === 'me' ? styles.myMessage : styles.otherMessage,
    ]}
  >
    <Text style={styles.messageText}>{message}</Text>
  </View>
);

const MessageInput = ({
  value,
  onChangeText,
  onSend,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder="Escribe un mensaje..."
      placeholderTextColor="#888"
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSend}
      returnKeyType="send"
    />
    <TouchableOpacity onPress={onSend} style={styles.sendButton}>
      <Text style={styles.sendButtonText}>Enviar</Text>
    </TouchableOpacity>
  </View>
);

// --- COMPONENTE PRINCIPAL ---
const MessageScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(dummyData);
  const flatListRef = useRef<FlatList>(null);
  const { user, avatar } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle avatar={avatar} user={user} />,
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
    <MessageBubble message={item.message} sender={item.sender} />
  );

return (
  <SafeAreaView style={{ flex: 1,  backgroundColor: '#f4f6fa' }} edges={['bottom', 'left', 'right']}>
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

          <MessageInput
            value={message}
            onChangeText={setMessage}
            onSend={sendMessage}
          />
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
    backgroundColor: '#f4f6fa',
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
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginVertical: 6,
    borderRadius: 18,
    maxWidth: '75%',
    shadowColor: '#007AFF',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  myMessage: {
    backgroundColor: '#e3eaff',
    alignSelf: 'flex-end',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 22,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  otherMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 22,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderWidth: 1,
    borderColor: '#e3eaff',
  },
  messageText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderTopWidth: 0,
    backgroundColor: '#f4f6fa',
    paddingBottom: Platform.OS === 'ios' ? 8 : 4,
    shadowColor: '#007AFF',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderColor: '#e3eaff',
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    color: '#222',
    marginRight: 10,
    shadowColor: '#007AFF',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    minWidth: 70,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    paddingHorizontal: 16,
    shadowColor: '#007AFF',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16, // Cambiado de 22 a 16 para mejor proporción
    letterSpacing: 0.2,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    shadowColor: '#007AFF',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#e3eaff',
  },
  headerUsername: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 0.2,
  },
});