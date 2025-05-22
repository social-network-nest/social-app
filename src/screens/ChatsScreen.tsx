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
  Pressable,
} from 'react-native';
import { ScrollView, Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
interface Chat {
  id: string;
  user: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unreadCount?: number;
  status: string;
}

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

const ChatScreen = ({ navigation }: { navigation: any }) => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchContacto, setSearchContacto] = useState<string>('');

  const contactosFiltrados = CHATS.filter((contact: Chat) =>
    contact.user.toLowerCase().includes(searchContacto.toLowerCase())
  );

  const openContactsModal = () => setModalVisible(true);
  const closeContactsModal = () => setModalVisible(false);

  const insets = useSafeAreaInsets();

  const [chats, setChats] = useState(
    CHATS.map(chat => ({
      ...chat,
      unreadCount: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
    }))
  );

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

  const renderRightActions = (id: string, user: string) => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => confirmDelete(id, user)}
      >
        <Text style={styles.actionText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: Chat }) => {
    return (
      <Swipeable
        ref={ref => {
          if (ref) swipeableRefs.current.set(item.id, ref);
        }}
        renderRightActions={() => renderRightActions(item.id, item.user)}
      >
        <TouchableOpacity
          style={styles.chatCard}
          onPress={() => navigation.navigate('Message', { user: item.user, avatar: item.avatar })}
        >
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={styles.username}>{item.user}</Text>
              <View style={styles.rightHeader}>
                {item.unreadCount! > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unreadCount}</Text>
                  </View>
                )}
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            </View>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const filteredChats = useMemo(
    () =>
      chats.filter(
        chat =>
          chat.user.toLowerCase().includes(searchText.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(searchText.toLowerCase())
      ),
    [searchText, chats]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar chats..."
          value={searchText}
          onChangeText={setSearchText}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity style={styles.iconButton} onPress={openContactsModal}>
          <Icon name="people-outline" size={22} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="handled"
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={closeContactsModal}
      >
        <View
          style={[
            styles.fullModalContainer,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          {/* Header sin línea */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Contactos</Text>
            <TouchableOpacity onPress={closeContactsModal}>
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          {/* 🔍 Input de búsqueda */}
          <View style={styles.modalSearchContainer}>
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Buscar contacto..."
              value={searchContacto}
              onChangeText={setSearchContacto}
            />
          </View>

          {/* Lista filtrada */}
          <ScrollView contentContainerStyle={styles.contactList}>
            {contactosFiltrados.map((contact: Chat) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactItem}
                onPress={() => {
                  closeContactsModal();
                  navigation.navigate('Message', {
                    user: contact.user,
                    avatar: contact.avatar,
                  });
                }}
              >
                <Image source={{ uri: contact.avatar }} style={styles.contactAvatar} />
                <View>
                  <Text style={styles.contactName}>{contact.user}</Text>
                  {contact.status && (
                    <Text style={styles.contactStatus}>{contact.status}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    // Padding adicional para asegurar espacio sobre el notch (barra de estado)
    paddingTop: 20, // Ajusta el valor si es necesario
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 14,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    maxWidth: '60%',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
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
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contactsButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  contactsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fullModalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    // borderBottomWidth eliminado
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  contactList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 14,
  },
  contactName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    marginLeft: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
    color: '#fff',
  },
  iconEmoji: {
    fontSize: 20,
    color: '#007AFF',
  },
  modalSearchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  modalSearchInput: {
    height: 42,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  contactStatus: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
});
