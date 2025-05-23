import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  SafeAreaView,
  Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

// --- COMPONENTES INTERNOS ---

// Comentario individual
const ProfileCommentItem = ({ comment }: { comment: any }) => (
  <View style={styles.commentContainer}>
    <Image
      source={{ uri: comment.user?.avatar || 'default-avatar-url.jpg' }}
      style={styles.commentAvatar}
    />
    <View style={styles.commentBubble}>
      <Text style={styles.commentName}>{comment.user?.name || 'Nombre no disponible'}</Text>
      <Text>{comment.text || 'Comentario vacío'}</Text>
    </View>
  </View>
);

// Post individual
const ProfilePostCard = ({
  item,
  onLike,
  onDelete,
}: {
  item: any;
  onLike: (postId: number) => void;
  onDelete: (postId: number) => void;
}) => (
  <View style={styles.postCard}>
    {/* Header */}
    <View style={styles.postHeader}>
      <Image source={{ uri: item.user.avatar }} style={styles.postAvatar} />
      <Text style={styles.postUsername}>{item.user.name}</Text>
    </View>

    {/* Content */}
    <Text style={styles.postContent}>{item.content}</Text>
    {item.image && (
      <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
    )}

    {/* Likes */}
    <View style={styles.likeContainer}>
      <TouchableOpacity onPress={() => onLike(item.id)} style={styles.likeButton}>
        <Ionicons
          name={item.likedByUser ? 'heart' : 'heart-outline'}
          size={24}
          color={item.likedByUser ? '#e0245e' : '#555'}
        />
        <Text style={styles.likeCount}>{item.likes}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
        <Text style={{ color: 'red', marginLeft: 15 }}>Eliminar</Text>
      </TouchableOpacity>
    </View>

    {/* Comments */}
    {item.comments && item.comments.length > 0 ? (
      item.comments.map((comment: any) => (
        <ProfileCommentItem key={comment.id} comment={comment} />
      ))
    ) : (
      <Text>No hay comentarios aún.</Text>
    )}
  </View>
);

// --- COMPONENTE PRINCIPAL ---
const ProfileScreen = () => {
  const [userName, setUserName] = useState('Camila Torres');
  const [userEmail, setUserEmail] = useState('camila@example.com');
  const [avatarUrl, setAvatarUrl] = useState('https://randomuser.me/api/portraits/women/21.jpg');
  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: { name: 'Camila Torres', avatar: avatarUrl },
      content: '¡Este es mi primer post en esta red social! 😊',
      image: 'https://picsum.photos/id/237/600/400',
      comments: [],
      likes: 3,
      likedByUser: false,
    },
    {
      id: 2,
      user: { name: 'Camila Torres', avatar: avatarUrl },
      content: 'Disfrutando de una hermosa caminata por el parque. 🌳🌞',
      image: 'https://picsum.photos/id/1041/600/400',
      comments: [],
      likes: 5,
      likedByUser: false,
    },
    {
      id: 3,
      user: { name: 'Camila Torres', avatar: avatarUrl },
      content: 'Nada mejor que un buen café por la mañana. ☕',
      image: 'https://picsum.photos/id/1015/600/400',
      comments: [
        {
          id: 1,
          user: { name: 'Juan Pérez', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
          text: '¡Qué emocionante! ¡Bienvenida!',
        },
      ],
      likes: 2,
      likedByUser: false,
    },
  ]);

  const handleSelectAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Se necesita permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const handleSaveChanges = () => {
    setPosts(prev =>
      prev.map(post => ({
        ...post,
        user: { ...post.user, avatar: avatarUrl },
      }))
    );
    setModalVisible(false);
    Alert.alert('Perfil actualizado', 'Tus cambios han sido guardados correctamente.');
  };

  const handleCancelChanges = () => {
    setModalVisible(false);
  };

  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const liked = !post.likedByUser;
        return {
          ...post,
          likedByUser: liked,
          likes: liked ? post.likes + 1 : post.likes - 1,
        };
      }
      return post;
    }));
  };

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
    Alert.alert('Post eliminado', 'El post ha sido eliminado correctamente.');
  };

  const renderPost = ({ item }: { item: typeof posts[0] }) => (
    <ProfilePostCard item={item} onLike={toggleLike} onDelete={handleDeletePost} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: 'center', padding: 20 }}>
        <TouchableOpacity onPress={handleSelectAvatar}>
          <Image source={{ uri: avatarUrl }} style={styles.profileAvatar} />
        </TouchableOpacity>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de edición de perfil */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.fullScreenModalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleSelectAvatar}>
              <Image source={{ uri: avatarUrl }} style={styles.modalAvatar} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="Nombre"
            />
            <TextInput
              style={styles.input}
              value={userEmail}
              onChangeText={setUserEmail}
              placeholder="Correo electrónico"
              keyboardType="email-address"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelChanges}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveChanges}
              >
                <Text style={styles.saveButtonText}>Guardar cambios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Lista de posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.postsContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ...tus estilos igual que antes...
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#007bff',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 6,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postsContainer: {
    padding: 10,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E1E4E8',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUsername: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  postContent: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  deleteButton: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  commentBubble: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 8,
    flex: 1,
  },
  commentName: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProfileScreen;