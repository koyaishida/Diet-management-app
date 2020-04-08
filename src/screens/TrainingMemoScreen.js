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
  textInput: {
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    fontSize: 24,
    width: "80%",
    backgroundColor:"#fff",
  },
  inputLocation :{
    flexDirection : "row",
  },
  unit : {
    fontSize : 30,
    marginTop :40,
  },
});

const TrainingMemoScreen = (props) => {
  const {trainingMenu,part} = props.route.params
  const [kg,setKg] =useState("")
  const [reps,setReps] =useState("")
  const [setCount,setSetCount] =useState("")

  const handleSubmit = () => {
    
      const db = firebase.firestore();
      const {currentUser} = firebase.auth();
       db.collection(`users/${currentUser.uid}/trainingMemoList`).add({
        part : part,
        menuName : trainingMenu,
        kg : kg,
        reps : reps,
        setCount : setCount,
        date : new Date(),
       })
      .then(()=> {
        props.navigation.navigate("TrainingMenu")
      })
      .catch((error)=>{
        console.error("Error adding document: ", error);
      });
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.inputLocation}>
        <TextInput multiline style={styles.textInput} value={kg}
        onChangeText={text => setKg(text)} placeholder="weight 重さ" keyboardType={"numeric"}/>
        <Text style={styles.unit}>kg</Text>
      </View>
      <View style={styles.inputLocation}>
        <TextInput multiline style={styles.textInput} value={reps}
        onChangeText={text => setReps(text)} placeholder="Reps 回数" keyboardType={"numeric"}/>
        <Text style={styles.unit}>回</Text>
      </View>
      
      <View style={styles.inputLocation}>
        <TextInput multiline style={styles.textInput} value={setCount}
        onChangeText={text => setSetCount(text)}  placeholder="set セット数" keyboardType={"numeric"}/>
        <Text style={styles.unit}>セット</Text>
      </View>
      <CircleButton name={"check"} onPress={handleSubmit}/>
    </View>
  );
}

export default TrainingMemoScreen