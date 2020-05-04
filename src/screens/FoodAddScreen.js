import React ,{useState}from 'react';
import { StyleSheet, View, TextInput,Text } from 'react-native';
import CircleButton from "../elements/CircleButton"
import firebase from "firebase"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF6",
    width: "100%",
  },
  kcalInput: {
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    fontSize: 24,
    width: "80%"
  },
  foodMemo: {
    flex:1,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    fontSize: 18,
    color: "black",
    backgroundColor: "#FFF"
  },
  inputLocation :{
    flexDirection : "row",
  },
  unit : {
    fontSize : 30,
    marginTop :40,
  },
});



const FoodAddScreen = (props) => {
  const [kcal,setKcal] =useState()
  const [foodMemo,setFoodMemo] =useState()
  const {date} = props.route.params
  const handleSubmit = () => {
    const db = firebase.firestore();
    const {currentUser} = firebase.auth();
     db.collection(`users/${currentUser.uid}/food`).add({
       kcal: kcal,
       foodMemo: foodMemo,
       date: date ? date: new Date()
     })
    .then(()=> {
      props.navigation.navigate("FoodManagement")
    })
    .catch((error)=>{
      console.error("Error adding document: ", error);
    });
  } 
  const disabled =()=>{
    if(isNaN(parseFloat(kcal)) || kcal === undefined){
      return true
    }else{
      return false
    }
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.inputLocation}>
        <TextInput multiline style={styles.kcalInput} value={kcal}
        onChangeText={text => setKcal(text)} placeholder="総カロリー" keyboardType={"numeric"}/>
        <Text style={styles.unit}>kcal</Text>
      </View>
      

      <TextInput multiline style={styles.foodMemo} value={foodMemo}
       onChangeText={text => setFoodMemo(text)} keyboardType={"default"} placeholder="食事内容"/>
      <CircleButton name={"check"} onPress={handleSubmit} disabled={disabled()}/>
    </View>
  );
}

export default FoodAddScreen