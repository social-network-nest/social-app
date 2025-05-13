import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

interface Chat {
  id: string;
  user: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
}

const CHATS: Chat[] = [
  {
    id: '1',
    user: 'Jamie Murcia',
    lastMessage: 'Muy bien, gracias 😊',
    timestamp: '12:45 PM',
    avatar: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '2',
    user: 'Carlos Ruiz',
    lastMessage: 'Gracias por tu ayuda.',
    timestamp: '11:20 AM',
    avatar: 'https://randomuser.me/api/portraits/men/0.jpg',
  },
  {
    id: '3',
    user: 'Lucía Fernández',
    lastMessage: '¡Hablamos luego!',
    timestamp: '9:00 AM',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '4',
    user: 'Ana López',
    lastMessage: '¿Nos vemos mañana?',
    timestamp: '8:30 AM',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '5',
    user: 'Pedro García',
    lastMessage: 'Estoy esperando tu respuesta.',
    timestamp: '7:55 AM',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '6',
    user: 'Miguel Sánchez',
    lastMessage: 'Ya te mandé la información.',
    timestamp: '6:40 AM',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: '7',
    user: 'Julia Martínez',
    lastMessage: '¡Buen trabajo! 👏',
    timestamp: '5:25 AM',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: '8',
    user: 'David Rodríguez',
    lastMessage: 'Vamos a vernos esta tarde.',
    timestamp: '4:10 AM',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    id: '9',
    user: 'Laura Pérez',
    lastMessage: '¡Te espero en el café!',
    timestamp: '3:00 AM',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    id: '10',
    user: 'José Gómez',
    lastMessage: 'Te llamo más tarde.',
    timestamp: '2:30 AM',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    id: '11',
    user: 'Raquel Fernández',
    lastMessage: '¿Cuándo es la reunión?',
    timestamp: '1:15 AM',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
  {
    id: '12',
    user: 'Victor Castillo',
    lastMessage: 'Estoy fuera de la oficina.',
    timestamp: '12:00 AM',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
  },
  {
    id: '13',
    user: 'Beatriz Ramos',
    lastMessage: 'Nos vemos el próximo mes.',
    timestamp: '11:30 PM',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
  },
  {
    id: '14',
    user: 'Andrés Ruiz',
    lastMessage: 'Lo resolví, gracias.',
    timestamp: '10:45 PM',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
  },
];

const ChatScreen = ({ navigation }: { navigation: any }) => {
  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={() => navigation.navigate('Message', { user: item.user })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.username}>{item.user}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={CHATS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 24,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  lastMessage: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});
