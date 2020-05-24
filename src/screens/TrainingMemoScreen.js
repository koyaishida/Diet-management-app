import React ,{useState}from 'react';
import { StyleSheet, View,TouchableWithoutFeedback,Keyboard } from 'react-native';
import CircleButton from "../elements/CircleButton"
import { Input,} from 'react-native-elements'
import firebase from "firebase"


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF6",
    width: "100%",
    padding:30,
  },
});

const TrainingMemoScreen = (props) => {

  const {trainingMenu,part,date} = props.route.params
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
        date : date ? new Date(date):new Date(),
       })
      .then(()=>{
        props.navigation.navigate("TrainingMenu")
      })
      .catch((error)=>{
        console.log("Error adding document: ", error);
      });
  }
  
  return (
    <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
      <View  style={styles.container}>
        <Input
          label="重さ (kg)"
          placeholder="半角数字で入力して下さい"
          value={kg}
          inputStyle={{padding:10}}
          labelStyle={{paddingTop:5,color:"black",fontSize:20,fontWeight:"100"}}
          onChangeText={text => setKg(text)}
          keyboardType={"numeric"}
        />
         <Input
          label="Reps (回数)"
          placeholder="半角数字で入力して下さい"
          value={reps}
          inputStyle={{padding:10}}
          labelStyle={{paddingTop:5,color:"black",fontSize:20,fontWeight:"100"}}
          onChangeText={text => setReps(text)}
          keyboardType={"numeric"}
        />
         <Input
          label="セット数"
          placeholder="半角数字で入力して下さい"
          value={setCount}
          inputStyle={{padding:10}}
          labelStyle={{paddingTop:5,color:"black",fontSize:20,fontWeight:"100"}}
          onChangeText={text => setSetCount(text)}
          keyboardType={"numeric"}
        />

        <CircleButton name={"check"} onPress={handleSubmit}/>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default TrainingMemoScreen