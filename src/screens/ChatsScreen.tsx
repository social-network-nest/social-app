import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

// --- Tipos e Interfaces ---
interface Chat {
  id: string;
  user: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unreadCount?: number;
  status: string;
}

// --- Data Dummy ---
const CHATS: Chat[] = [
  {
    id: '1',
    user: 'Camila Torres',
    lastMessage: '¿A qué hora quedamos mañana? ⏰',
    timestamp: 'Hoy, 10:23 AM',
    avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
    status: 'Disponible',
  },
  {
    id: '2',
    user: 'Sebastián Vargas',
    lastMessage: 'Listo, te mandé los archivos 📎',
    timestamp: 'Hoy, 9:15 AM',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'Disponible',
  },
  {
    id: '3',
    user: 'Valentina Ríos',
    lastMessage: '😂 jajaja no puedo creerlo',
    timestamp: 'Ayer, 8:47 PM',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    status: 'Disponible',
  },
  {
    id: '4',
    user: 'Julián Castro',
    lastMessage: '¿Puedes revisar esto porfa? 🙏',
    timestamp: 'Ayer, 6:10 PM',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    status: 'Disponible',
  },
  {
    id: '5',
    user: 'Diana López',
    lastMessage: 'Nos vemos en 5 minutos 🚶‍♀️',
    timestamp: 'Ayer, 5:05 PM',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    status: 'Disponible',
  },
];

type Message = {
  id: string;
  message: string;
  sender: 'me' | 'other';
};

const dummyMessages: Message[] = [
  { id: '1', message: '¡Hola!', sender: 'other' },
  { id: '2', message: '¡Hola! ¿Cómo estás?', sender: 'me' },
  { id: '3', message: 'Estoy bien, gracias. ¿Y tú?', sender: 'other' },
  { id: '4', message: 'Muy bien, gracias por preguntar.', sender: 'me' },
];

// --- COMPONENTES INTERNOS ---

// Tarjeta de chat en la lista principal
const ChatCard = ({
  chat,
  onPress,
  onDelete,
  swipeableRef,
}: {
  chat: Chat;
  onPress: () => void;
  onDelete: () => void;
  swipeableRef: React.RefObject<Swipeable> | ((ref: Swipeable | null) => void);
}) => {
  const renderRightActions = () => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
        <Text style={styles.actionText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions}>
      <TouchableOpacity style={styles.chatCard} onPress={onPress}>
        <Image source={{ uri: chat.avatar }} style={styles.avatar} />
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.username}>{chat.user}</Text>
            <View style={styles.rightHeader}>
              {chat.unreadCount! > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                </View>
              )}
              <Text style={styles.timestamp}>{chat.timestamp}</Text>
            </View>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {chat.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

// Tarjeta de contacto en el modal
const ContactItem = ({
  contact,
  onPress,
}: {
  contact: Chat;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.contactItem} onPress={onPress}>
    <Image source={{ uri: contact.avatar }} style={styles.contactAvatar} />
    <View>
      <Text style={styles.contactName}>{contact.user}</Text>
      {contact.status && <Text style={styles.contactStatus}>{contact.status}</Text>}
    </View>
  </TouchableOpacity>
);

// Barra de búsqueda con botón para abrir modal de contactos
const SearchBar = ({
  searchText,
  setSearchText,
  onContactsPress,
}: {
  searchText: string;
  setSearchText: (text: string) => void;
  onContactsPress: () => void;
}) => (
  <View style={styles.searchBarContainer}>
    <TextInput
      style={styles.searchInput}
      placeholder="Buscar chats..."
      value={searchText}
      onChangeText={setSearchText}
      clearButtonMode="while-editing"
    />
    <TouchableOpacity style={styles.iconButton} onPress={onContactsPress}>
      <Icon name="people-outline" size={22} color="#007AFF" />
    </TouchableOpacity>
  </View>
);

// Modal para mostrar lista de contactos con búsqueda
const ContactsModal = ({
  visible,
  onClose,
  contacts,
  searchContacto,
  setSearchContacto,
  onContactPress,
  insets,
}: {
  visible: boolean;
  onClose: () => void;
  contacts: Chat[];
  searchContacto: string;
  setSearchContacto: (text: string) => void;
  onContactPress: (contact: Chat) => void;
  insets: { top: number; bottom: number };
}) => (
  <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
    <View
      style={[
        styles.fullModalContainer,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Contactos</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.modalCloseText}>Cerrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.modalSearchContainer}>
        <TextInput
          style={styles.modalSearchInput}
          placeholder="Buscar contacto..."
          placeholderTextColor="#9ba4b5"
          value={searchContacto}
          onChangeText={setSearchContacto}
        />
      </View>

      <ScrollView contentContainerStyle={styles.contactList}>
        {contacts.map(contact => (
          <ContactItem
            key={contact.id}
            contact={contact}
            onPress={() => onContactPress(contact)}
          />
        ))}
      </ScrollView>
    </View>
  </Modal>
);

 // ...existing code...
// ...otros imports...

const MessageModal = ({
  visible,
  onClose,
  chat,
  messages,
}: {
  visible: boolean;
  onClose: () => void;
  chat: Chat | null;
  messages: { id: string; message: string; sender: 'me' | 'other' }[];
}) => {
  const [input, setInput] = React.useState('');
  const insets = useSafeAreaInsets();

  if (!chat) return null;

  // Estilos exclusivos para el modal de mensajes
  const modalStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4f6fa',
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    arrowButton: {
      backgroundColor: '#f4f6fb',
      borderRadius: 20,
      padding: 7,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginRight: 12,
      borderWidth: 1.2,
      borderColor: '#e3eaff',
    },
    username: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#222',
      maxWidth: '60%',
    },
    messageBubble: {
      paddingVertical: 12,
      paddingHorizontal: 18,
      marginVertical: 6,
      borderRadius: 18,
      maxWidth: '75%',
      alignSelf: 'flex-start',
    },
    myMessage: {
      backgroundColor: '#e3eaff',
      alignSelf: 'flex-end',
    },
    otherMessage: {
      backgroundColor: '#fff',
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
      padding: 12,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#e3eaff',
    },
    input: {
      flex: 1,
      height: 42,
      borderRadius: 20,
      borderColor: '#e3eaff',
      borderWidth: 1.5,
      paddingHorizontal: 16,
      fontSize: 16,
      backgroundColor: '#f4f6fa',
      color: '#222',
    },
    sendButton: {
      marginLeft: 8,
      backgroundColor: '#007AFF',
      borderRadius: 20,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={modalStyles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={insets.top}
        >
          {/* Header */}
          <View style={modalStyles.header}>
            <TouchableOpacity onPress={onClose} style={modalStyles.arrowButton}>
              <Ionicons name="arrow-back" size={26} color="#007AFF" />
            </TouchableOpacity>
            <Image source={{ uri: chat.avatar }} style={modalStyles.avatar} />
            <Text style={modalStyles.username} numberOfLines={1} ellipsizeMode="tail">
              {chat.user}
            </Text>
          </View>
          {/* Mensajes */}
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  modalStyles.messageBubble,
                  item.sender === 'me' ? modalStyles.myMessage : modalStyles.otherMessage,
                ]}
              >
                <Text style={modalStyles.messageText}>{item.message}</Text>
              </View>
            )}
            contentContainerStyle={{ padding: 16, paddingBottom: 10 }}
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
          />
          {/* Input para enviar mensaje */}
          <View style={modalStyles.inputContainer}>
            <TextInput
              style={modalStyles.input}
              placeholder="Escribe un mensaje..."
              value={input}
              onChangeText={setInput}
              returnKeyType="send"
              onSubmitEditing={() => setInput('')}
            />
            <TouchableOpacity
              style={modalStyles.sendButton}
              onPress={() => setInput('')}
              disabled={!input.trim()}
            >
              <Ionicons name="send" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

// ...resto del código...

// --- COMPONENTE PRINCIPAL ---
const ChatScreen = ({ navigation }: { navigation: any }) => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchContacto, setSearchContacto] = useState<string>('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isMessageModalVisible, setMessageModalVisible] = useState(false);

  const insets = useSafeAreaInsets();

  // Inicializamos los chats con un número random de unreadCount
  const [chats, setChats] = useState(
    CHATS.map(chat => ({
      ...chat,
      unreadCount: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
    }))
  );

  // Para manejar referencias a los Swipeables y poder cerrarlos programáticamente
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

  const closeSwipe = (id: string) => {
    const swipeRef = swipeableRefs.current.get(id);
    swipeRef?.close();
  };

  const confirmDelete = (id: string, user: string) => {
    Alert.alert(
      'Eliminar chat',
      `¿Seguro que quieres eliminar el chat con ${user}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => closeSwipe(id),
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setChats(prev => prev.filter(chat => chat.id !== id));
            swipeableRefs.current.delete(id);
          },
        },
      ]
    );
  };

  // Filtrar chats según texto de búsqueda
  const filteredChats = useMemo(
    () =>
      chats.filter(
        chat =>
          chat.user.toLowerCase().includes(searchText.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(searchText.toLowerCase())
      ),
    [searchText, chats]
  );

  // Filtrar contactos para modal
  const contactosFiltrados = CHATS.filter(contact =>
    contact.user.toLowerCase().includes(searchContacto.toLowerCase())
  );

  // --- Render principal ---
  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        onContactsPress={() => setModalVisible(true)}
      />
      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatCard
            chat={item}
            swipeableRef={ref => {
              if (ref) swipeableRefs.current.set(item.id, ref);
            }}
            onPress={() => {
              setSelectedChat(item);
              setMessageModalVisible(true);
            }}
            onDelete={() => confirmDelete(item.id, item.user)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="handled"
      />
      <MessageModal
        visible={isMessageModalVisible}
        onClose={() => setMessageModalVisible(false)}
        chat={selectedChat}
        messages={dummyMessages}
      />
      <ContactsModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        contacts={contactosFiltrados}
        searchContacto={searchContacto}
        setSearchContacto={setSearchContacto}
        onContactPress={contact => {
          setModalVisible(false);
          navigation.navigate('Message', { user: contact.user, avatar: contact.avatar });
        }}
        insets={insets}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

// ...código y componentes previos...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa', // Fondo suave como HomeScreen
    paddingHorizontal: 10,
    paddingTop: 18,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: 'transparent', // Quita el fondo entre input y botón
    borderRadius: 16,
    paddingHorizontal: 0, // Sin padding horizontal extra
    marginTop: 4,
  },
  searchInput: {
    flex: 1,
    height: 40, // Más compacto y moderno
    backgroundColor: '#fff',
    borderColor: '#e3eaff',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#222',
    marginRight: 8, // Espacio entre input y botón
    shadowColor: '#007AFF',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    marginLeft: 8,
    backgroundColor: '#e3eaff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#b3c6ff',
    borderWidth: 1,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#e3eaff',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    maxWidth: '60%',
  },
  timestamp: {
    fontSize: 12,
    color: '#8a8a8a',
    marginLeft: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    opacity: 0.85,
  },
  separator: {
    height: 0,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    minWidth: 22,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  rightActionContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  actionButton: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Modal estilos
  fullModalContainer: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    paddingHorizontal: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#e3eaff',
  },
  modalSearchContainer: {
    paddingHorizontal: 18,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e3eaff',
  },
  modalSearchInput: {
    height: 42,
    borderRadius: 12,
    borderColor: '#e3eaff',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#f4f6fa',
    color: '#222',
    marginTop: 4,
  },
  contactList: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: '#007AFF',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e3eaff',
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 14,
    borderWidth: 1.2,
    borderColor: '#e3eaff',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  contactStatus: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 0,
    shadowColor: 'transparent',
  },
  arrowButton: {
    backgroundColor: '#f4f6fb',
    borderRadius: 20,
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginVertical: 6,
    borderRadius: 18,
    maxWidth: '75%',
    alignSelf: 'flex-start',
  },
  myMessage: {
    backgroundColor: '#e3eaff',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e3eaff',
  },
  messageText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messageModalContainer: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    marginTop: 40,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginTop: 0,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
});