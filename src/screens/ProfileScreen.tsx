import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// --- COMPONENTES INTERNOS ---

// Header del perfil
const HeaderSection = () => (
  <View style={styles.header}>
    <Image
      source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
      style={styles.avatar}
    />
    <View style={{ marginLeft: 16 }}>
      <Text style={styles.name}>Tomás Riquelme</Text>
      <View style={styles.statusContainer}>
        <Icon name="checkmark-circle" size={18} color="#4CAF50" />
        <Text style={styles.statusText}>Estudiante activo</Text>
      </View>
    </View>
  </View>
);

// Sección genérica con icono y título
const Section = ({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Icon name={icon} size={18} color="#007AFF" style={styles.sectionIcon} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

// Fila de información
const RowItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.rowItem}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

// Observaciones (puedes hacer un componente si necesitas lógica extra)
const Observaciones = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.noteText}>{children}</Text>
);

// --- COMPONENTE PRINCIPAL ---
const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderSection />
      <ScrollView contentContainerStyle={styles.content}>
        <Section icon="school" title="Información Académica">
          <RowItem label="Curso" value="2° Medio B" />
          <RowItem label="RUT" value="19.234.456-7" />
          <RowItem label="Promedio general" value="6.3" />
        </Section>
        <Section icon="book" title="Ramos Extracurriculares">
          <RowItem label="Teatro Escolar" value="Martes 15:00" />
          <RowItem label="Robótica" value="Jueves 16:30" />
        </Section>
        <Section icon="time" title="Horario Semanal">
          <RowItem label="Lunes" value="8:00 - 14:00" />
          <RowItem label="Martes" value="8:00 - 16:00" />
          <RowItem label="Miércoles" value="8:00 - 14:00" />
        </Section>
        <Section icon="chatbubble-ellipses" title="Observaciones">
          <Observaciones>
            Tomás ha demostrado un excelente compromiso académico este semestre. Participa activamente y tiene buena relación con sus compañeros.
          </Observaciones>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: {
    fontSize: 15,
    color: '#555',
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  noteText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
});