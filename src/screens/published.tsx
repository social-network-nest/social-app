import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');

  const handlePost = () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert('Faltan campos', 'Por favor completa el título y el contenido.');
      return;
    }

    // Aquí podrías guardar el aviso
    Alert.alert('Aviso publicado', 'Tu aviso ha sido compartido con la comunidad.');

    setTitle('');
    setMessage('');
    setCategory('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Nuevo Aviso</Text>

        <Text style={styles.label}>Título del aviso</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Suspensión de clases"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Contenido</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Escribe los detalles del aviso..."
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <Text style={styles.label}>Categoría (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Urgente, Informativo..."
          value={category}
          onChangeText={setCategory}
        />

        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Icon name="send" size={20} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.postButtonText}>Publicar Aviso</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  postButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
