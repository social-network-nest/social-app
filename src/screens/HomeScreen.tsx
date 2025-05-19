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

const currentUser = {
  name: 'Marcelo Jara',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const initialPosts: Post[] = [
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
  const [posts, setPosts] = useState<Post[]>(initialPosts);
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Post | null>(null);

  const [newPostDescription, setNewPostDescription] = useState<string>('');
  const [newPostImage, setNewPostImage] = useState<string>('');

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

  const handleCreatePost = () => {
    if (!newPostDescription.trim() || !newPostImage.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      user: currentUser.name,
      description: newPostDescription.trim(),
      image: newPostImage.trim(),
      icon: currentUser.avatar,
    };
    setPosts((prev) => [newPost, ...prev]);
    setNewPostDescription('');
    setNewPostImage('');
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
          <Text style={styles.actionText}>Me gusta</Text>
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
        <View style={styles.createPostContainer}>
          <TextInput
            placeholder="¿Qué estás pensando?"
            value={newPostDescription}
            onChangeText={setNewPostDescription}
            style={styles.createPostInput}
            multiline
          />
          <TouchableOpacity style={styles.createPostButton} onPress={handleCreatePost}>
            <Text style={styles.createPostButtonText}>Publicar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={posts}
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
    marginBottom: 6,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userDark: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111',
  },
  time: {
    color: '#666',
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
    color: '#222',
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 4,
    fontWeight: '600',
  },
  commentSection: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  commentAuthor: {
    fontWeight: '700',
    fontSize: 13,
  },
  commentText: {
    fontSize: 13,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 10,
  },
  userName: {
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
  },
  userLocation: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  userBio: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
  },
  contactLabel: {
    fontWeight: '700',
    marginRight: 5,
  },
  contactValue: {
    color: '#444',
  },
  profileButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileBtnText: {
    color: '#007bff',
    marginLeft: 6,
    fontWeight: '600',
  },
  profileBtnReport: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileBtnReportText: {
    color: '#dc3545',
    marginLeft: 6,
    fontWeight: '600',
  },
  createPostContainer: {
    margin: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
  },
  createPostInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  createPostButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  createPostButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default HomeScreen;