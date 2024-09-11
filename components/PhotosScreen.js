
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Text,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//importaciones
const PhotosScreen = () => {
  const [photos, setPhotos] = useState([]); // Estado para almacenar las fotos guardadas

  useEffect(() => {
    loadPhotos(); // Carga las fotos al iniciar el componente
  }, []);

  const loadPhotos = async () => {
    try {
      const existingPhotos = await AsyncStorage.getItem('photos'); // Obtiene fotos existentes
      if (existingPhotos) {
        setPhotos(JSON.parse(existingPhotos).reverse()); // Convierte a array y actualiza el estado
        
      }
    } catch (error) {
      console.error('Error loading photos: ', error);
    }
  };
  const deletePhoto = async (uri) => {
    try {
      const existingPhotos = await AsyncStorage.getItem('photos'); // Obtiene fotos existentes
      const photosArray = existingPhotos ? JSON.parse(existingPhotos) : []; // Convierte a array
      const updatedPhotos = photosArray.filter(photo => photo.uri !== uri); // Filtra la foto a eliminar
      await AsyncStorage.setItem('photos', JSON.stringify(updatedPhotos)); // Guarda el array actualizado
      setPhotos(updatedPhotos); // Actualiza el estado
      console.log('Photo deleted successfully!');
    } catch (error) {
      console.error('Error deleting photo: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Photos</Text>
      <TouchableOpacity onPress={loadPhotos} style={styles.reload}><Text>Reload</Text></TouchableOpacity>
      <ScrollView style={styles.scrollContainer} >
        {photos.map((photo, index) => (
          <View key={index} style={styles.post}>
          <Image key={index} source={{ uri: photo.uri }} style={styles.savedPhoto} />
            <Text style={styles.annotation}>{photo.annotation}</Text>
            <Text style={styles.location}>
              Latitude: {photo.location.coords.latitude}, Longitude: {photo.location.coords.longitude}
            </Text> 
            <TouchableOpacity style={styles.delete}  onPress={() => deletePhoto(photo.uri)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
            </View>          
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollContainer: {
    flexDirection: 'column',
    marginHorizontal: 10,
  },
  savedPhoto: {
    width: 300, 
    height: 200, 
    marginBottom: 10, 
  },
  post: {
    borderRadius: 7,
    backgroundColor: '#e6c39a',
    marginBottom: 10,
  },
  reload:{
    backgroundColor: '#fcc100',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  delete: {
    backgroundColor: '#ff0000',
    marginBottom: 10,
    width: 100,
    marginRight: 10,
    marginLeft: 100,
    borderRadius: 5,
    
  },
  deleteText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  annotation: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 5,
    backgroundColor: '#eadac8',
    textAlign: 'center',
  },
  location: {
    fontSize: 14,
    margin: 5,
    textAlign: 'center',
    backgroundColor: '#f6ff7f',
  },
});

export default PhotosScreen;