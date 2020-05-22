import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from "firebase"
import ENV from "./env.json"
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import WeightManagementScreen from './src/screens/WeightManagementScreen';
import WeightAddScreen from './src/screens/WeightAddScreen';
import FoodManagementScreen from './src/screens/FoodManagementScreen';
import FoodAddScreen from './src/screens/FoodAddScreen';
import FoodDetailScreen from './src/screens/FoodDetailScreen';
import TrainingManagementScreen from './src/screens/TrainingManagementScreen';
import TrainingMenuScreen from './src/screens/TrainingMenuScreen';
import TrainingMemoScreen from './src/screens/TrainingMemoScreen';
import TrainingAddScreen from './src/screens/TrainingAddScreen';
import PersonalDataScreen from './src/screens/PersonalDataScreen';

require("firebase/firestore")

  // Initialize Firebase

  const firebaseConfig = {
  apiKey:             ENV.FIREBASE_API_KEY,
  authDomain:         ENV.FIREBASE_AUTH_DOMAIN,
  databaseURL:        ENV.FIREBASE_DATABASE_URL,
  projectId:          ENV.FIREBASE_PROJECT_ID,
  storageBucket:      ENV.FIREBASE,
  messagingSenderId:  ENV.FIREBASE_STORAGE_BUCKET,
  appId:              ENV.FIREBASE_MESSAGING_SENDER_ID,
  measurementId:      ENV.FIREBASE_MEASUREMENT_ID
};
firebase.initializeApp(firebaseConfig);
    
  

  

  const Stack = createStackNavigator();

  
 const App = ()=>{
   return(
     <NavigationContainer>
       <Stack.Navigator screenOptions={{
        headerStyle: {
          shadowColor: "#000",
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.3,
            shadowRadius:2,
            backgroundColor:"#00b2b2",
        },
        headerTitleStyle:{
         color:"#fff"
        },
        headerBackTitle:"BACK",
        headerBackTitleStyle:{
          color:"#fff"
        }}}>  
         <Stack.Screen name="Login" component={LoginScreen}
          options={{ title: "ログイン"}} /> 
        <Stack.Screen name="Home" component={HomeScreen} 
          options={{ title: "HOME"}}/> 
         
         <Stack.Screen name="Signup" component={SignupScreen} 
          options={{ title: "新規登録" }}/>

         <Stack.Screen name="PersonalData" component={PersonalDataScreen}
          options={{ title: "設定" }} /> 
         
         <Stack.Screen name="WeightManagement" component={WeightManagementScreen} 
         options={{ title: "体重管理" }}/>
         <Stack.Screen name="WeightAdd" component={WeightAddScreen} 
          options={{ title: "体重の追加" }}/>   
         <Stack.Screen name="FoodManagement" component={FoodManagementScreen} 
          options={{ title: "食事管理" }}/>   
         <Stack.Screen name="FoodAdd" component={FoodAddScreen} 
          options={{ title: "食事の追加" }}/>   
         <Stack.Screen name="FoodDetail" component={FoodDetailScreen} 
          options={{ title: "食事詳細" }}/>   
         <Stack.Screen name="TrainingManagement" component={TrainingManagementScreen} 
          options={{ title: 'トレーニング管理' }}
         />   
         <Stack.Screen name="TrainingMenu" component={TrainingMenuScreen} 
          options={{ title: "トレーニングメニュー" }}/>   
         <Stack.Screen name="TrainingMemo" component={TrainingMemoScreen} 
          options={({ route }) => ({ title: route.params.trainingMenu })}
         />   
         <Stack.Screen name="TrainingAdd" component={TrainingAddScreen} 
          options={{ title: "トレーニングメニューの追加" }}/>   
       </Stack.Navigator>
     </NavigationContainer>
   )
 }


export default App