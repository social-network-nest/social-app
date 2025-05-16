import React, { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Post = {
  id: string;
  user: string;
  description: string;
  image: string;
  icon: string;
};

type Comment = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar: string;
  };
};

// Usuario autenticado simulado
const currentUser = {
  name: 'Marcelo Jara',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const DATA: Post[] = [
  {
    id: '1',
    user: 'Marcelo Jara',
    description: 'Este es el comentario del post !!',
    image:
      'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2940&auto=format&fit=crop',
    icon: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    user: 'Jamie Murcia',
    description: 'Otro comentario interesante.',
    image:
      'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2940&auto=format&fit=crop',
    icon: 'https://randomuser.me/api/portraits/women/21.jpg',
  },
];

const ProfileModal = ({
  visible,
  onClose,
  user,
  onFollow,
  onAddFriend,
  onReport,
}: {
  visible: boolean;
  onClose: () => void;
  user: {
    name: string;
    avatar: string;
    location: string;
    bio: string;
    email: string;
    phone: string;
  };
  onFollow: () => void;
  onAddFriend: () => void;
  onReport: () => void;
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>

          <Image source={{ uri: user.avatar }} style={styles.avatar} />

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userLocation}>{user.location}</Text>

          <Text style={styles.userBio}>{user.bio}</Text>

          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Email:</Text>
            <Text style={styles.contactValue}>{user.email}</Text>
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Teléfono:</Text>
            <Text style={styles.contactValue}>{user.phone}</Text>
          </View>

          <View style={styles.profileButtons}>
            <TouchableOpacity style={styles.profileBtn} onPress={onFollow}>
              <Ionicons name="person-add-outline" size={20} color="#007bff" />
              <Text style={styles.profileBtnText}>Seguir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileBtn} onPress={onAddFriend}>
              <Ionicons name="people-outline" size={20} color="#007bff" />
              <Text style={styles.profileBtnText}>Añadir amigo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileBtnReport} onPress={onReport}>
              <Ionicons name="flag-outline" size={20} color="#dc3545" />
              <Text style={styles.profileBtnReportText}>Reportar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const HomeScreen: React.FC = () => {
  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({
    '1': [
      {
        id: 'init-1',
        text: '¡Buen post, Marcelo!',
        user: {
          name: 'Jamie Murcia',
          avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
        },
      },
    ],
  });
  const [newComment, setNewComment] = useState<string>('');

  const [likesCount, setLikesCount] = useState<Record<string, number>>({
    '1': 3,
    '2': 1,
  });

  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});

  // Modal para perfil
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Post | null>(null);

  const toggleComments = (postId: string) => {
    setOpenPostId(openPostId === postId ? null : postId);
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;
    const newEntry: Comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      user: {
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
    };

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newEntry],
    }));
    setNewComment('');
  };

  const handleToggleLike = (postId: string) => {
    setUserLikes((prev) => {
      const isLiked = prev[postId];
      setLikesCount((counts) => ({
        ...counts,
        [postId]: isLiked ? (counts[postId] || 1) - 1 : (counts[postId] || 0) + 1,
      }));
      return {
        ...prev,
        [postId]: !isLiked,
      };
    });
  };

  const openProfile = (user: Post) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeProfile = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: item.icon }} style={styles.icon} />
        <View>
          <TouchableOpacity onPress={() => openProfile(item)}>
            <Text style={styles.userDark}>{item.user}</Text>
          </TouchableOpacity>
          <Text style={styles.time}>{'Just now'}</Text>
        </View>
      </View>

      <Text style={styles.description}>{item.description}</Text>
      <Image source={{ uri: item.image }} style={styles.postImage} />

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleToggleLike(item.id)}
        >
          <Ionicons
            name={userLikes[item.id] ? 'heart' : 'heart-outline'}
            size={20}
            color={userLikes[item.id] ? 'red' : 'black'}
          />
          <Text style={styles.actionText}>
            Me gusta {likesCount[item.id] ? `(${likesCount[item.id]})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => toggleComments(item.id)}>
          <Ionicons name="chatbubble-outline" size={20} color="black" />
          <Text style={styles.actionText}>Comentar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="share-social-outline" size={20} color="black" />
          <Text style={styles.actionText}>Compartir</Text>
        </TouchableOpacity>
      </View>

      {openPostId === item.id && (
        <View style={styles.commentSection}>
          {(comments[item.id] || []).map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
              <View>
                <Text style={styles.commentAuthor}>{comment.user.name}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            </View>
          ))}
          <View style={styles.commentInputContainer}>
            <TextInput
              placeholder="Escribe un comentario..."
              value={newComment}
              onChangeText={setNewComment}
              style={styles.commentInput}
              multiline
            />
            <TouchableOpacity onPress={() => handleAddComment(item.id)}>
              <Ionicons name="send" size={24} color="blue" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal */}
      {selectedUser && (
        <ProfileModal
          visible={modalVisible}
          onClose={closeProfile}
          user={{
            name: selectedUser.user,
            avatar: selectedUser.icon,
            location: 'Ciudad de México, México',
            bio: 'Apasionado por la tecnología, el deporte y la fotografía.',
            email: 'usuario@example.com',
            phone: '+52 55 1234 5678',
          }}
          onFollow={() => alert('Seguir usuario')}
          onAddFriend={() => alert('Añadir amigo')}
          onReport={() => alert('Reportar usuario')}
        />
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 12,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  user: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 12,
  },
  commentSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentAuthor: {
    fontWeight: '600',
    fontSize: 13,
  },
  commentText: {
    fontSize: 13,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
  },
  commentInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    fontSize: 14,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 350,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  userBio: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    color: '#444',
  },
  contactInfo: {
    flexDirection: 'row',
    marginBottom: 8,
    width: '100%',
    justifyContent: 'center',
  },
  contactLabel: {
    fontWeight: '600',
    marginRight: 6,
    color: '#555',
  },
  contactValue: {
    color: '#333',
  },
  profileButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',       // Permite que los botones pasen a otra fila si no caben
    width: '100%',
    marginTop: 16,
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7f0ff',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,              // Cambié marginHorizontal por margin para mejor separación
    minWidth: 100,          // Ancho mínimo para que los botones no queden muy chicos
    justifyContent: 'center',
  },
  profileBtnText: {
    color: '#007bff',
    marginLeft: 6,
    fontWeight: '600',
  },
  profileBtnReport: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdecea',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
    minWidth: 100,
    justifyContent: 'center',
  },
  profileBtnReportText: {
    color: '#dc3545',
    marginLeft: 6,
    fontWeight: '600',
  },
  userDark: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',  // texto oscuro
  },
});

export default HomeScreen;

