import { Camera, CameraType } from 'expo-camera/legacy';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView , TextInput} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
//importaciones
export default function CamaraScreen({handleOpenCamara}) {
  const [type, setType] = useState(CameraType.back); // Estado para el tipo de cámara
  const [permission, requestPermission] = Camera.useCameraPermissions(); // Permisos de cámara
  const [photo, setPhoto] = useState(null); // Estado para almacenar la foto
  const [photos, setPhotos] = useState([]); // Estado para almacenar las fotos guardadas
  const cameraRef = useRef(null); // Referencia a la cámara
  const [annotation, setAnnotation] = useState(''); // Estado para la anotación
  const [location, setLocation] = useState(null); // Estado para la ubicación

  useEffect(() => {
    loadPhotos(); // Carga las fotos al iniciar el componente
    requestLocationPermission(); // Solicita permisos de ubicación
  }, []);

  const requestLocationPermission = async () => {
    try {// Solicita permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error requesting location permission: ', error);
    }
  };
  const loadPhotos = async () => {
    try {
      const existingPhotos = await AsyncStorage.getItem('photos'); // Obtiene las fotos existentes
      if (existingPhotos) {
        setPhotos(JSON.parse(existingPhotos)); // Convierte a array y actualiza el estado
      }
    } catch (error) {
      console.error('Error loading photos: ', error);
    }
  };

  if (!permission) {
    // Los permisos de la cámara aún se están cargando
    return <View />;
  }

  if (!permission.granted) {
    // Los permisos de la cámara no están concedidos
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>necesita los permisos para activar la camara</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraType() {
    // Cambia entre la cámara delantera y trasera
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function takePhoto() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync(); // Toma la foto
      const location = await Location.getCurrentPositionAsync({});//obtniene la ubicacion
      
      setLocation(location); //almacena la ubicacion en el estado
      setPhoto(photo); // Almacena la foto en el estado
    }
  }

  const savePhoto = async (uri) => {
    try {
      const existingPhotos = await AsyncStorage.getItem('photos'); // Obtiene fotos existentes
      const photosArray = existingPhotos ? JSON.parse(existingPhotos) : []; // Convierte a array
      const photoData = { uri: photo.uri, annotation,location }; // Crea un objeto con la foto  la anotación y la ubicación
      photosArray.push(photoData); // Agrega la nueva foto
      await AsyncStorage.setItem('photos', JSON.stringify(photosArray)); // Guarda el array actualizado
      setPhotos(photosArray); // Actualiza el estado de fotos
      setPhoto(null); // Elimina la vista previa de la foto
      setAnnotation(''); // Limpia la anotación
      console.log('Photo saved successfully!');
    } catch (error) {
      console.error('Error saving photo: ', error);
    }
  };

  const discardPhoto = () => {
    setPhoto(null); // Elimina la vista previa de la foto
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
        <TouchableOpacity  onPress={handleOpenCamara}>
            <Text style={styles.text}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Icon name="camera" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
      {photo && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo.uri }} style={styles.preview} />
          <TextInput
            style={styles.annotationInput}
            placeholder="Add annotation"
            value={annotation}
            onChangeText={setAnnotation}
          />
          <Text>Location: {location ? `${location.coords.latitude}, ${location.coords.longitude}` : 'sin ubicacion'}</Text>
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => savePhoto(photo.uri)}>
              <Text style={styles.saved}>Save Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={discardPhoto}>
              <Text style={styles.discard}>Discard</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  previewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    
  },
  preview: {
    justifyContent: 'center',
    textAlign: 'center',
    width: 300,
    height: 400,
    marginBottom: 5,
    marginTop: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  discard: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,

  },
  saved: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  actionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  scrollContainer: {
    flex: 1,
    marginVertical: 20,
  },
  savedPhoto: {
    width: '100%',
    height: 200, // Ajusta la altura según sea necesario
    marginBottom: 10,
  },annotationInput: {
    marginTop: 5,
    fontSize: 16,
    width: 300,
    textAlign: 'center',
    backgroundColor: '#ffc74f',
    color: 'black',
  },
});