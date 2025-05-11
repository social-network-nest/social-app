import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    user: 'Marcelo Jara',
    description: 'Este es el comentario del post !!',
    image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    icon: 'https://s3.amazonaws.com/org.kellenberg.www-media/wp-content/uploads/2019/10/04112751/facebook-user-icon-19.jpghttps://s3.amazonaws.com/org.kellenberg.www-media/wp-content/uploads/2019/10/04112751/facebook-user-icon-19.jpg'
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    user: 'Jamie Murcia',
    description: 'Este es el comentario del post !!',
    image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    icon: 'https://s3.amazonaws.com/org.kellenberg.www-media/wp-content/uploads/2019/10/04112751/facebook-user-icon-19.jpghttps://s3.amazonaws.com/org.kellenberg.www-media/wp-content/uploads/2019/10/04112751/facebook-user-icon-19.jpg'
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    user: 'Marcelo Jara',
    description: 'Este es el comentario del post !!',
    image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    icon: 'https://s3.amazonaws.com/org.kellenberg.www-media/wp-content/uploads/2019/10/04112751/facebook-user-icon-19.jpghttps://s3.amazonaws.com/org.kellenberg.www-media/wp-content/uploads/2019/10/04112751/facebook-user-icon-19.jpg'
  },
];

const HomeScreen = () => (
  <ScrollView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Image
                style={styles.icon}
                source={{
                  uri: item.image,
                }}
              />
              <Text style={styles.user}>{ item.user }</Text>
              <Text style={styles.time}>Just Now</Text>
            </View>
            <View>
              <Text style={styles.description}>{ item.description }</Text>
              <Image
                style={styles.image}
                source={{
                  uri: item.image,
                }}
              />
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="heart-outline" size={24} color="black" />
                <Text style={styles.actionText}>Me gusta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="chatbubble-outline" size={24} color="black" />
                <Text style={styles.actionText}>Comentar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="share-social-outline" size={24} color="black" />
                <Text style={styles.actionText}>Compartir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0
  },
  item: {
    backgroundColor: '#f9c2ff',
  },
  title: {
    fontSize: 32,
  },
  image: {
    width: '100%',
    height: 400,
    marginBottom: 4,
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 8,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 100,
    position: 'absolute',
    left: 8,
    top: 8,
  },
  user: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingLeft: 48,
    paddingTop: 12,
  },
  time: {
    fontSize: 10,
    color: 'blue',
    paddingLeft: 48,
  },
  description: {
    fontSize: 14,
    paddingLeft: 8,
    paddingTop: 12,
    paddingBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopWidth: 1,
    borderTopColor: 'gray'
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 10,
  },
});

export default HomeScreen;
