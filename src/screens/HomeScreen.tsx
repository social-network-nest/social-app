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
  const [activeMenuOption, setActiveMenuOption] = useState<string | null>(null);
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
  const [isSubjectPostsModalVisible, setIsSubjectPostsModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

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

  const handleMenuOptionPress = (option: string) => {
    closeSidebar(); // Cierra el menú
    setActiveMenuOption(option); // Guarda la opción seleccionada
    setIsMenuModalVisible(true); // Muestra el modal
  };

  const openSubjectPostsModal = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setIsMenuModalVisible(false); // Cierra el modal de asignaturas

    // Abrir el modal de publicaciones con pequeño delay para evitar el "salto"
    setTimeout(() => {
      setIsSubjectPostsModalVisible(true);
    }, 300); // Ajusta el tiempo si es necesario
  };

  const closeSubjectPostsModal = () => {
    // Cerrar el modal de publicaciones
    setIsSubjectPostsModalVisible(false);

    // Usamos otro timeout para esperar a que el modal de publicaciones se cierre completamente
    setTimeout(() => {
      // Abrir el modal de asignaturas después de un pequeño retraso
      setIsMenuModalVisible(true); // Vuelve a abrir el modal de asignaturas
      setActiveMenuOption('Mis Asignaturas'); // Resetea la opción activa del menú
    }, 300); // Este tiempo debería ser lo suficientemente largo para que la animación de cierre se complete
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
                <TouchableOpacity onPress={() => handleMenuOptionPress('Mis Asignaturas')} style={styles.sidebarItem}>
                  <Ionicons name="book-outline" size={22} color="#333" style={styles.sidebarIcon} />
                  <Text style={styles.sidebarText}>Mis Asignaturas</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleMenuOptionPress('Notas')} style={styles.sidebarItem}>
                  <Ionicons name="document-text-outline" size={22} color="#333" style={styles.sidebarIcon} />
                  <Text style={styles.sidebarText}>Notas</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleMenuOptionPress('Asistencias')} style={styles.sidebarItem}>
                  <Ionicons name="checkmark-done-outline" size={22} color="#333" style={styles.sidebarIcon} />
                  <Text style={styles.sidebarText}>Asistencias</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleMenuOptionPress('Calendarios')} style={styles.sidebarItem}>
                  <Ionicons name="calendar-outline" size={22} color="#333" style={styles.sidebarIcon} />
                  <Text style={styles.sidebarText}>Calendarios</Text>
                </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </SafeAreaView>
      )}
      <Modal visible={isMenuModalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContent}>
          {/* Header del Modal */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsMenuModalVisible(false)} style={styles.backButton}>
              <View style={styles.arrowButtonContainer}>
                <Ionicons name="arrow-back" size={28} color="#007AFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{activeMenuOption}</Text>
          </View>

          {/* Contenido del Modal */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Mis Asignaturas */}
            {activeMenuOption === 'Mis Asignaturas' && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Asignaturas Inscritas:</Text>

                {/* Asignatura Matemáticas */}
                <View style={styles.noteContainer}>
                  <TouchableOpacity onPress={() => openSubjectPostsModal('Matemáticas')}>
                    <Text style={styles.noteItem}>📘 <Text style={styles.subject}>Matemáticas</Text></Text>
                  </TouchableOpacity>
                  <View style={styles.detailContainer}>
                    <Text style={styles.detail}>👨‍🏫 Profesor: Prof. Juan Pérez</Text>
                    <Text style={styles.detail}>📅 Horarios:</Text>
                    <Text style={styles.detail}>- Lunes: 8:00 AM a 10:00 AM</Text>
                    <Text style={styles.detail}>- Martes: 9:00 AM a 11:00 AM</Text>
                    <Text style={styles.detail}>- Miércoles: 8:00 AM a 10:00 AM</Text>
                  </View>
                </View>

                {/* Asignatura Historia */}
                <View style={styles.noteContainer}>
                  <TouchableOpacity onPress={() => openSubjectPostsModal('Historia')}>
                    <Text style={styles.noteItem}>📗 <Text style={styles.subject}>Historia</Text></Text>
                  </TouchableOpacity>
                  <View style={styles.detailContainer}>
                    <Text style={styles.detail}>👨‍🏫 Profesor: Prof. Laura Gómez</Text>
                    <Text style={styles.detail}>📅 Horarios:</Text>
                    <Text style={styles.detail}>- Lunes: 10:30 AM a 12:30 PM</Text>
                    <Text style={styles.detail}>- Jueves: 9:00 AM a 11:00 AM</Text>
                  </View>
                </View>

                {/* Asignatura Ciencias */}
                <View style={styles.noteContainer}>
                  <TouchableOpacity onPress={() => openSubjectPostsModal('Ciencias')}>
                    <Text style={styles.noteItem}>📙 <Text style={styles.subject}>Ciencias</Text></Text>
                  </TouchableOpacity>
                  <View style={styles.detailContainer}>
                    <Text style={styles.detail}>👨‍🏫 Profesor: Prof. Manuel Rodríguez</Text>
                    <Text style={styles.detail}>📅 Horarios:</Text>
                    <Text style={styles.detail}>- Martes: 2:00 PM a 4:00 PM</Text>
                    <Text style={styles.detail}>- Viernes: 3:00 PM a 5:00 PM</Text>
                  </View>
                </View>

                {/* Asignatura Lenguaje */}
                <View style={styles.noteContainer}>
                  <TouchableOpacity onPress={() => openSubjectPostsModal('Lenguaje')}>
                    <Text style={styles.noteItem}>📕 <Text style={styles.subject}>Lenguaje</Text></Text>
                  </TouchableOpacity>
                  <View style={styles.detailContainer}>
                    <Text style={styles.detail}>👨‍🏫 Profesor: Prof. Sandra Molina</Text>
                    <Text style={styles.detail}>📅 Horarios:</Text>
                    <Text style={styles.detail}>- Miércoles: 9:00 AM a 11:00 AM</Text>
                    <Text style={styles.detail}>- Viernes: 10:00 AM a 12:00 PM</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Notas con Detalles */}
            {activeMenuOption === 'Notas' && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Notas:</Text>

                {/* Notas de Matemáticas */}
                <View style={styles.noteContainer}>
                  <Text style={styles.noteItem}>📘 <Text style={styles.subject}>Matemáticas:</Text></Text>
                  <View style={styles.detailContainer}>
                    <Text style={styles.detail}>📝 Examen Final: 7.0</Text>
                    <Text style={styles.detail}>📚 Tareas: 6.5</Text>
                    <Text style={styles.detail}>👨‍🏫 Participación: 6.0</Text>
                    <Text style={styles.detail}>🔄 Recuperación: 6.8</Text>
                  </View>
                </View>

                {/* Notas de Historia */}
                <View style={styles.noteContainer}>
                  <Text style={styles.noteItem}>📗 <Text style={styles.subject}>Historia:</Text></Text>
                  <View style={styles.detailContainer}>
                    <Text style={styles.detail}>📝 Examen Final: 6.5</Text>
                    <Text style={styles.detail}>📚 Tareas: 7.0</Text>
                    <Text style={styles.detail}>👨‍🏫 Participación: 6.8</Text>
                    <Text style={styles.detail}>🔄 Recuperación: 7.0</Text>
                  </View>
                </View>

                {/* Notas de Ciencias */}
                <View style={styles.noteContainer}>
                  <Text style={styles.noteItem}>📙 <Text style={styles.subject}>Ciencias:</Text></Text>
                  <View style={styles.detailContainer}>
                    <Text style={styles.detail}>📝 Examen Final: 5.8</Text>
                    <Text style={styles.detail}>📚 Tareas: 5.5</Text>
                    <Text style={styles.detail}>👨‍🏫 Participación: 6.0</Text>
                    <Text style={styles.detail}>🔄 Recuperación: 6.0</Text>
                  </View>
                </View>

                {/* Notas de Lenguaje */}
                <View style={styles.noteContainer}>
                  <Text style={styles.noteItem}>📕 <Text style={styles.subject}>Lenguaje:</Text></Text>
                  <View style={styles.detailContainer}>
                    <Text style={styles.detail}>📝 Examen Final: 7.0</Text>
                    <Text style={styles.detail}>📚 Tareas: 6.5</Text>
                    <Text style={styles.detail}>👨‍🏫 Participación: 6.2</Text>
                    <Text style={styles.detail}>🔄 Recuperación: 6.8</Text>
                  </View>
                </View>

                {/* Promedio de todas las asignaturas */}
                <Text style={styles.average}>Promedio: 6.7</Text>
              </View>
            )}

            {/* Asistencias */}
            {activeMenuOption === 'Asistencias' && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Resumen de Asistencias:</Text>

                {/* Resumen General de Asistencias */}
                <View style={styles.attendanceContainer}>
                  <Text style={styles.attendanceDetail}>✅ Asistencias: <Text style={styles.attendanceValue}>42</Text></Text>
                  <Text style={styles.attendanceDetail}>❌ Ausencias: <Text style={styles.attendanceValue}>3</Text></Text>
                  <Text style={styles.attendanceDetail}>⏳ Atrasos: <Text style={styles.attendanceValue}>2</Text></Text>
                </View>

                {/* Resumen Semanal de Asistencias */}
                <Text style={styles.sectionTitle}>Asistencias por Semana:</Text>

                <View style={styles.weeklyAttendance}>
                  {/* Semana 1 */}
                  <View style={styles.weekContainer}>
                    <Text style={styles.weekTitle}>Semana 1 (1-7 Mayo)</Text>
                    <Text style={styles.weekDetail}>✅ Lunes: Asistió</Text>
                    <Text style={styles.weekDetail}>✅ Martes: Asistió</Text>
                    <Text style={styles.weekDetail}>❌ Miércoles: Ausente</Text>
                    <Text style={styles.weekDetail}>✅ Jueves: Asistió</Text>
                    <Text style={styles.weekDetail}>✅ Viernes: Asistió</Text>
                  </View>

                  {/* Semana 2 */}
                  <View style={styles.weekContainer}>
                    <Text style={styles.weekTitle}>Semana 2 (8-14 Mayo)</Text>
                    <Text style={styles.weekDetail}>✅ Lunes: Asistió</Text>
                    <Text style={styles.weekDetail}>✅ Martes: Asistió</Text>
                    <Text style={styles.weekDetail}>✅ Miércoles: Asistió</Text>
                    <Text style={styles.weekDetail}>✅ Jueves: Asistió</Text>
                    <Text style={styles.weekDetail}>❌ Viernes: Ausente</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Calendarios */}
            {activeMenuOption === 'Calendarios' && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Calendario Académico:</Text>

                {/* Eventos del Mes */}
                <View style={styles.eventContainer}>
                  <Text style={styles.subsectionTitle}>Eventos del Mes:</Text>

                  <View style={styles.eventDetail}>
                    <Text style={styles.eventIcon}>🗓️</Text>
                    <View style={styles.eventTextContainer}>
                      <Text style={styles.eventTitle}>Prueba de Matemáticas</Text>
                      <Text style={styles.eventDate}>10 Mayo - 9:00 AM</Text>
                      <Text style={styles.eventDescription}>Examen Final de Matemáticas. Prepararse con ejercicios de álgebra y geometría.</Text>
                    </View>
                  </View>

                  <View style={styles.eventDetail}>
                    <Text style={styles.eventIcon}>🗓️</Text>
                    <View style={styles.eventTextContainer}>
                      <Text style={styles.eventTitle}>Día del Estudiante</Text>
                      <Text style={styles.eventDate}>15 Mayo - Todo el día</Text>
                      <Text style={styles.eventDescription}>Actividades recreativas y conmemorativas. No se tendrá clases este día.</Text>
                    </View>
                  </View>

                  <View style={styles.eventDetail}>
                    <Text style={styles.eventIcon}>🗓️</Text>
                    <View style={styles.eventTextContainer}>
                      <Text style={styles.eventTitle}>Entrega de Trabajos</Text>
                      <Text style={styles.eventDate}>25 Mayo - 3:00 PM</Text>
                      <Text style={styles.eventDescription}>Entrega de trabajos de Ciencias y Lenguaje. Revisa las instrucciones en los documentos compartidos.</Text>
                    </View>
                  </View>
                </View>

                {/* Actividades Extracurriculares */}
                <View style={styles.eventContainer}>
                  <Text style={styles.subsectionTitle}>Actividades Extracurriculares:</Text>

                  <View style={styles.eventDetail}>
                    <Text style={styles.eventIcon}>🎨</Text>
                    <View style={styles.eventTextContainer}>
                      <Text style={styles.eventTitle}>Club de Arte</Text>
                      <Text style={styles.eventDate}>Miércoles - 4:00 PM</Text>
                      <Text style={styles.eventDescription}>Clase de pintura, cerámica y escultura. ¡Todos son bienvenidos!</Text>
                    </View>
                  </View>

                  <View style={styles.eventDetail}>
                    <Text style={styles.eventIcon}>⚽</Text>
                    <View style={styles.eventTextContainer}>
                      <Text style={styles.eventTitle}>Fútbol - Equipo Escolar</Text>
                      <Text style={styles.eventDate}>Lunes y Jueves - 5:00 PM</Text>
                      <Text style={styles.eventDescription}>Entrenamiento del equipo de fútbol. ¡Ven a entrenar para el torneo intercolegial!</Text>
                    </View>
                  </View>

                  <View style={styles.eventDetail}>
                    <Text style={styles.eventIcon}>🎶</Text>
                    <View style={styles.eventTextContainer}>
                      <Text style={styles.eventTitle}>Coral Escolar</Text>
                      <Text style={styles.eventDate}>Martes - 4:00 PM</Text>
                      <Text style={styles.eventDescription}>Prácticas para el concierto de fin de curso.</Text>
                    </View>
                  </View>
                </View>

                {/* Próximos Eventos de la Semana */}
                <View style={styles.eventContainer}>
                  <Text style={styles.subsectionTitle}>Próximos Eventos de la Semana:</Text>

                  <View style={styles.eventDetail}>
                    <Text style={styles.eventIcon}>🗓️</Text>
                    <View style={styles.eventTextContainer}>
                      <Text style={styles.eventTitle}>Entrega de Tareas - Lenguaje</Text>
                      <Text style={styles.eventDate}>Martes - 5:00 PM</Text>
                    </View>
                  </View>

                  <View style={styles.eventDetail}>
                    <Text style={styles.eventIcon}>🗓️</Text>
                    <View style={styles.eventTextContainer}>
                      <Text style={styles.eventTitle}>Prueba de Historia</Text>
                      <Text style={styles.eventDate}>Miércoles - 10:00 AM</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Modal de Publicaciones */}
      <Modal visible={isSubjectPostsModalVisible} animationType="slide" transparent={true}>
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeSubjectPostsModal} style={styles.backButton}>
              <View style={styles.arrowButtonContainer}>
                <Ionicons name="arrow-back" size={28} color="#007AFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedSubject}</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>📝 Últimas publicaciones</Text>

              <View style={styles.publicationItem}>
                <Text style={styles.publicationIcon}>📢</Text>
                <View style={styles.publicationTextContainer}>
                  <Text style={styles.publicationTitle}>Tarea para el viernes</Text>
                  <Text style={styles.publicationSubtitle}>No olvides entregar el ejercicio 4 antes del viernes a las 18:00 hrs.</Text>
                </View>
              </View>

              <View style={styles.publicationItem}>
                <Text style={styles.publicationIcon}>📚</Text>
                <View style={styles.publicationTextContainer}>
                  <Text style={styles.publicationTitle}>Material de estudio</Text>
                  <Text style={styles.publicationSubtitle}>Ya está disponible el nuevo PDF sobre geometría en la sección de recursos.</Text>
                </View>
              </View>

              <View style={styles.publicationItem}>
                <Text style={styles.publicationIcon}>🧪</Text>
                <View style={styles.publicationTextContainer}>
                  <Text style={styles.publicationTitle}>Revisión de pruebas</Text>
                  <Text style={styles.publicationSubtitle}>La revisión de la prueba será el miércoles durante la clase habitual.</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    backgroundColor: '#007AFF',
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
    flexDirection: 'row',
    alignItems: 'center',
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
  sidebarIcon: {
    marginRight: 10,
  },
  sidebarText: {
    fontSize: 16,
    color: '#333',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',  // Azul más oscuro
    paddingVertical: 15,  // Reducir el padding para que el header no sea tan ancho
    paddingHorizontal: 20,  // Ajustar el ancho del header
    borderTopLeftRadius: 30,  // Bordes redondeados hacia arriba
    borderTopRightRadius: 30,  // Bordes redondeados hacia arriba
    elevation: 5,
  },
  backButton: {
    marginLeft: 10,
  },
  arrowButtonContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,  // Fondo redondo para la flecha
    padding: 8,
    elevation: 3,  // Sombra para resaltar el botón
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',  // Fondo gris claro
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  noteContainer: {
    marginBottom: 10,
  },
  noteItem: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailContainer: {
    marginLeft: 20,
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  average: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 20,
  },
  subject: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#007AFF', // color azul
  },
  attendanceContainer: {
    backgroundColor: '#E8F6FF', // Fondo azul suave
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#A3D4FF', // Bordes azul claro
    elevation: 3,
  },

  attendanceDetail: {
    fontSize: 16,
    color: '#2C3E50', // Texto oscuro
    marginBottom: 10,
  },

  attendanceValue: {
    fontWeight: 'bold',
    color: '#007AFF', // Azul para resaltar los números
  },

  weeklyAttendance: {
    marginTop: 10,
  },

  weekContainer: {
    backgroundColor: '#F0F8FF', // Fondo más claro para las semanas
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },

  weekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },

  weekDetail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  eventContainer: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F1F8FF', // Fondo claro para cada evento
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,  // Sombra suave para darle profundidad
  },
  eventIcon: {
    fontSize: 24,
    color: '#007AFF',  // Iconos azules para eventos importantes
    marginRight: 10,
  },
  eventTextContainer: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#34495E',
  },
    publicationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 1,
  },
  publicationIcon: {
    fontSize: 22,
    marginRight: 12,
    marginTop: 4,
  },
  publicationTextContainer: {
    flex: 1,
  },
  publicationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  publicationSubtitle: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
