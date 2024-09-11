"use client";
import * as React from 'react';
import { useState } from 'react';
import { Text, View, Button,TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CamaraScreen from './components/CamaraScreen';
import PhotosScreen from './components/PhotosScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

function CamaraHome() {
  [openCamaras, setOpenCamaras] = useState(false);

  const handleOpenCamara = () => {
    setOpenCamaras(!openCamaras);
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',padding:0,margin:0 ,backgroundColor:"#03ffcd"}}>
        
       
      {openCamaras?(<View style={{flex:1,width:400}}><CamaraScreen handleOpenCamara={handleOpenCamara} /></View>):( <>
        <Text>Camara!</Text>
        <Text style={{ textAlign: 'center' }}>Conceder permisos antes de abrir la camara</Text>
        <TouchableOpacity onPress={handleOpenCamara}>
        <Icon name="camera" size={20} color="white" />
        </TouchableOpacity>
        <Button onPress={handleOpenCamara} title="abrir camara" />
        </>
      )}
      
    </View>
  );
}

function Galeria() {
 
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:"#2bff00" }}>
      
      <PhotosScreen />
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="CamaraHome" component={CamaraHome} options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="camera" color={color} size={size} />
            ),
          }} />
      <Tab.Screen name="Galeria" component={Galeria} options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="photo" color={color} size={size} />
            ),
          }}/>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}