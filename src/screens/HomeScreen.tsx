import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Image, StyleSheet, ScrollView } from 'react-native';
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

  // Crear nuevo post
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

  // Dar like/unlike a un post
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

  // Añadir comentario a un post
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

  // Render de cada comentario
  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentBubble}>
        <Text style={styles.commentName}>{item.user.name}</Text>
        <Text>{item.text}</Text>
      </View>
    </View>
  );

  // Render de cada post (en feed y en perfil)
  const renderPost = ({ item }: { item: Post }) => (
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

      {/* Likes y botón like */}
      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.likeButton}>
          <Ionicons
            name={item.likedByUser ? 'heart' : 'heart-outline'}
            size={24}
            color={item.likedByUser ? '#e0245e' : '#555'}
          />
          <Text style={styles.likeCount}>{item.likes}</Text>
        </TouchableOpacity>
      </View>

      {/* Comentarios */}
      <FlatList
        data={item.comments}
        keyExtractor={(comment) => comment.id.toString()}
        renderItem={renderComment}
        scrollEnabled={false}
        style={styles.commentsList}
      />

      {/* Agregar comentario */}
      {commentingPostId === item.id ? (
        <View style={styles.addCommentContainer}>
          <TextInput
            placeholder="Escribe un comentario..."
            value={newCommentText}
            onChangeText={setNewCommentText}
            style={styles.commentInput}
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

  // Posts del usuario seleccionado para mostrar en el modal perfil
  const userPosts = selectedUser
    ? posts.filter(post => post.user.name === selectedUser.name)
    : [];

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.postsContainer}
      />

      {/* Botón flotante */}
      <TouchableOpacity onPress={() => setShowCreatePostModal(true)} style={styles.fab}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal de perfil con publicaciones del usuario */}
      <Modal visible={!!selectedUser} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.modalBack}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          {selectedUser && (
            <ScrollView>
              <View style={styles.profileInfo}>
                <Image source={{ uri: selectedUser.avatar }} style={styles.profileAvatar} />
                <Text style={styles.profileName}>{selectedUser.name}</Text>
                {selectedUser.bio && <Text style={styles.profileBio}>{selectedUser.bio}</Text>}

                {/* Botones Agregar, Seguir y Reportar */}
                <View style={styles.profileButtonsContainer}>
                  <TouchableOpacity style={styles.profileButton}>
                    <Text style={styles.profileButtonText}>Agregar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.profileButton}>
                    <Text style={styles.profileButtonText}>Seguir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.profileButtonReport}>
                    <Text style={styles.profileButtonReportText}>Reportar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.modalTitle, { marginTop: 20, marginBottom: 10 }]}>Publicaciones</Text>
              {userPosts.length === 0 ? (
                <Text style={{ textAlign: 'center', color: '#666' }}>Este usuario no tiene publicaciones.</Text>
              ) : (
                <FlatList
                  data={userPosts}
                  keyExtractor={(post) => post.id.toString()}
                  renderItem={renderPost}
                  scrollEnabled={false}
                />
              )}
            </ScrollView>
          )}
        </View>
      </Modal>


      {/* Modal para crear post */}
      <Modal visible={showCreatePostModal} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setShowCreatePostModal(false)} style={styles.modalBack}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Crear nuevo post</Text>
          <TextInput
            placeholder="¿Qué estás pensando?"
            multiline
            value={newPostContent}
            onChangeText={setNewPostContent}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={handleCreatePost} style={styles.publishButton}>
            <Text style={styles.publishText}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingTop: 20 },
  postsContainer: { paddingVertical: 20 },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center' },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  postUsername: { fontWeight: 'bold', fontSize: 16 },
  postContent: { marginTop: 12, fontSize: 15, lineHeight: 20 },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginTop: 12,
    backgroundColor: '#eaeaea',
  },
  commentsList: { marginTop: 12 },
  commentContainer: {
    flexDirection: 'row',
    marginTop: 8,
    paddingHorizontal: 12,
  },
  commentAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 10 },
  commentBubble: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 12,
    flex: 1,
  },
  commentName: { fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  modalBack: { marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  textInput: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
  },
  publishButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  publishText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  profileInfo: { alignItems: 'center' },
  profileAvatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  profileName: { fontSize: 24, fontWeight: 'bold' },
  profileBio: { marginTop: 8, color: '#555', fontSize: 16 },
  likeContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 6,
    fontSize: 16,
    color: '#555',
  },
  addCommentButton: {
    marginTop: 12,
  },
  addCommentContainer: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    height: 36,
  },
  sendCommentButton: {
    padding: 6,
  },

  profileButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
  },
  profileButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 90,
    alignItems: 'center',
  },
  profileButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileButtonReport: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 90,
    alignItems: 'center',
  },
  profileButtonReportText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

});
