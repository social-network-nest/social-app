import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Post {
  id: number;
  user: {
    name: string;
    avatar: string;
    bio?: string;
  };
  content: string;
  image?: string;
  comments: Comment[];
  likes: number;
  likedByUser?: boolean;
}

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
}

const samplePosts: Post[] = [
  {
    id: 1,
    user: {
      name: 'Juan Pérez',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      bio: 'Amante del café ☕ | Viajero 🌍',
    },
    content: '¡Hola a todos! Este es mi primer post aquí.',
    image: 'https://picsum.photos/id/1015/600/400',
    comments: [
      {
        id: 1,
        user: {
          name: 'Ana Gómez',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
        text: '¡Bienvenido Juan!',
      },
    ],
    likes: 5,
    likedByUser: false,
  },
  {
    id: 2,
    user: {
      name: 'Lucía Fernández',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      bio: 'Diseñadora UX 🎨',
    },
    content: '¡Miren esta vista desde mi ventana! 🌄',
    image: 'https://picsum.photos/id/1043/600/400',
    comments: [
      {
        id: 1,
        user: {
          name: 'Carlos Méndez',
          avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        },
        text: 'Wow, qué lugar tan hermoso!',
      },
    ],
    likes: 10,
    likedByUser: false,
  },
  {
    id: 3,
    user: {
      name: 'Pedro Ruiz',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      bio: 'Tech lover 💻📱',
    },
    content: 'Probando mi nueva cámara 📷',
    image: 'https://picsum.photos/id/237/600/400',
    comments: [],
    likes: 2,
    likedByUser: false,
  },
  {
    id: 4,
    user: {
      name: 'Sofía Martínez',
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
      bio: 'Fotógrafa y viajera ✈️',
    },
    content: 'Una de mis fotos favoritas en París ❤️',
    image: 'https://picsum.photos/id/1025/600/400',
    comments: [
      {
        id: 1,
        user: {
          name: 'Laura Díaz',
          avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
        },
        text: '¡Qué bella foto!',
      },
      {
        id: 2,
        user: {
          name: 'Mario Gómez',
          avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
        },
        text: 'París es mágico 😍',
      },
    ],
    likes: 8,
    likedByUser: false,
  },
];

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [selectedUser, setSelectedUser] = useState<Post['user'] | null>(null);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentingPostId, setCommentingPostId] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const [sidebarAnim] = useState(new Animated.Value(screenWidth));

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    const newPost: Post = {
      id: posts.length + 1,
      user: {
        name: 'Tú',
        avatar: 'https://i.pravatar.cc/150?img=10',
        bio: 'Mi perfil',
      },
      content: newPostContent,
      comments: [],
      likes: 0,
      likedByUser: false,
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowCreatePostModal(false);
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

  const handleAddComment = () => {
    if (!newCommentText.trim() || commentingPostId === null) return;

    setPosts(posts.map(post => {
      if (post.id === commentingPostId) {
        const newComment: Comment = {
          id: post.comments.length + 1,
          user: {
            name: 'Tú',
            avatar: 'https://i.pravatar.cc/150?img=10',
          },
          text: newCommentText,
        };
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    }));

    setNewCommentText('');
    setCommentingPostId(null);
  };

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const openSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: 0, // Desliza hacia posición 0 (completo en pantalla)
      duration: 300,
      useNativeDriver: false,
    }).start();
    setShowSidebar(true);
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: screenWidth, // Vuelve a salir hacia la derecha
      duration: 300,
      useNativeDriver: false,
    }).start(() => setShowSidebar(false));
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <TouchableOpacity onPress={() => setSelectedUser(item.user)}>
        <Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSelectedUser(item.user)} style={styles.commentBubble}>
        <Text style={styles.commentName}>{item.user.name}</Text>
        <Text>{item.text}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPost = ({ item }: { item: Post }, isProfileView = false) => (
    <View style={styles.postCard}>
      <TouchableOpacity onPress={() => setSelectedUser(item.user)} style={styles.postHeader}>
        <Image source={{ uri: item.user.avatar }} style={styles.postAvatar} />
        <Text style={styles.postUsername}>{item.user.name}</Text>
      </TouchableOpacity>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.likeButton}>
          <Ionicons
            name={item.likedByUser ? 'heart' : 'heart-outline'}
            size={24}
            color={item.likedByUser ? '#e0245e' : '#555'}
          />
          <Text style={styles.likeCount}>{item.likes}</Text>
        </TouchableOpacity>
        {isProfileView && (
          <TouchableOpacity
            onPress={() => handleDeletePost(item.id)}
            style={styles.deleteButton}
          >
            <Text style={{ color: 'red', marginLeft: 15 }}>Eliminar</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={item.comments}
        keyExtractor={(comment) => comment.id.toString()}
        renderItem={renderComment}
        scrollEnabled={false}
        style={styles.commentsList}
      />
      {commentingPostId === item.id ? (
        <View style={styles.addCommentContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=10' }}
            style={styles.commentAvatar}
          />
          <TextInput
            placeholder="Escribe un comentario..."
            value={newCommentText}
            onChangeText={setNewCommentText}
            style={[styles.commentInput, { marginLeft: 8 }]}
          />
          <TouchableOpacity onPress={handleAddComment} style={styles.sendCommentButton}>
            <Ionicons name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setCommentingPostId(item.id)} style={styles.addCommentButton}>
          <Text style={{ color: '#007AFF' }}>Agregar comentario</Text>
        </TouchableOpacity>
      )}
    </View>
  );


  const userPosts = selectedUser
    ? posts.filter(post => post.user.name === selectedUser.name)
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 10 }}>
        <TouchableOpacity onPress={openSidebar}>
          <Ionicons name="menu" size={30} color="#333" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.postsContainer}
      />

      <TouchableOpacity onPress={() => setShowCreatePostModal(true)} style={styles.fab}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal visible={!!selectedUser} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.modalBack}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          {selectedUser && (
            <ScrollView>
              <View style={styles.profileInfo}>
                <Image source={{ uri: selectedUser.avatar }} style={styles.profileAvatar} />
                <Text style={styles.profileName}>{selectedUser.name}</Text>
                {selectedUser.bio && <Text style={styles.profileBio}>{selectedUser.bio}</Text>}
                <View style={styles.profileButtonsContainer}>
                  <TouchableOpacity style={styles.profileButton}>
                    <Text style={styles.profileButtonText}>Agregar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.profileButton}>
                    <Text style={styles.profileButtonText}>Seguir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.profileButton}>
                    <Text style={styles.profileButtonText}>Reportar</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <FlatList
                data={userPosts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderPost({ item }, true)} // <-- Aquí debe ir true
              />
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      <Modal visible={showCreatePostModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.createPostModalContent}>
            <Text style={styles.createPostTitle}>Crear nuevo post</Text>
            <TextInput
              multiline
              placeholder="¿Qué quieres compartir?"
              value={newPostContent}
              onChangeText={setNewPostContent}
              style={styles.createPostInput}
            />
            <View style={styles.createPostButtons}>
              <TouchableOpacity onPress={() => setShowCreatePostModal(false)} style={[styles.modalButton, { backgroundColor: '#ccc' }]}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreatePost} style={[styles.modalButton, { backgroundColor: '#007AFF' }]}>
                <Text style={{ color: 'white' }}>Publicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      {showSidebar && (
        <SafeAreaView style={StyleSheet.absoluteFill}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeSidebar}
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
          >
            <Animated.View
              style={[
                styles.sidebarRight,
                {
                  right: 0,
                  transform: [{ translateX: sidebarAnim }],
                },
              ]}
            >
              <Text style={styles.sidebarTitle}>Menú</Text>
              <TouchableOpacity onPress={() => {}} style={styles.sidebarItem}>
                <Text>Inicio</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} style={styles.sidebarItem}>
                <Text>Mi Perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} style={styles.sidebarItem}>
                <Text>Configuración</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </SafeAreaView>
      )}


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postsContainer: {
    padding: 10,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUsername: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postContent: {
    fontSize: 14,
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 6,
    fontSize: 14,
  },
  commentsList: {
    marginBottom: 8,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  commentBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth: '85%',
  },
  commentName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  addCommentButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  commentInput: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    fontSize: 14,
    maxHeight: 80,
  },
  sendCommentButton: {
    padding: 6,
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalBack: {
    padding: 15,
  },
  profileInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileBio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  profileButtonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  profileButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 6,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  createPostModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  createPostModalContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  createPostTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  createPostInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 20,
  },
  createPostButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteButton: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  commentInputAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },

  commentInputWithAvatar: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
  },
  sidebar: {
    width: 250,
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    position: 'absolute',
    left: 0,
    top: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sidebarItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sidebarRight: {
    position: 'absolute',
    top: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 100,
  },



});
