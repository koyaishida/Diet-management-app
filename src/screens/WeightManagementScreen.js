import React ,{useState}from 'react';
import { StyleSheet, View, TextInput,Text,  } from 'react-native';
import CircleButton from "../elements/CircleButton"
import firebase from "firebase"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF6",
    width: "100%"
  },
  label : {
    fontSize: 32,
    padding : 20,
  },
  wightManagementLabel: {
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    fontSize: 24,
    margin: 10,
    backgroundColor: "#fff",
    textAlign: "center",
    width: "80%"
  },
  inputLocation :{
    flexDirection : "row",
  },
  unit : {
    fontSize : 30,
    marginTop :40,
  },
});


const WeightManagementScreen = (props) => {
  const [weight,setWeight] =useState("")
  const [bodyFatPercentage,setBodyFatPercentage] =useState("")

  //体重の値が０の時エラーにある為、後日修正
  const handleSubmit = () => {
    console.log("press")
     const db = firebase.firestore();
     const {currentUser} = firebase.auth();
      db.collection(`users/${currentUser.uid}/trainingMenu`).add({
           weight : weight,
           bodyFatPercentage : bodyFatPercentage,
           date: new Date()
      })
     .then(()=> {
       props.navigation.navigate("Home")
       console.log("then")
     })
     .catch((error)=>{
       console.error("Error adding document: ", error);
     });
  }
  
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>体重（kg）</Text>
        <View style={styles.inputLocation}>
          <TextInput multiline style={styles.wightManagementLabel} value={weight}
          onChangeText={text => setWeight(text)} placeholder="ここに入力" keyboardType={"numeric"}/>
          <Text style={styles.unit}>kg</Text>
        </View>
      </View>

      <View>
        <Text style={styles.label}>体脂肪率（％）</Text>
        <View  style={styles.inputLocation}>
          <TextInput multiline style={styles.wightManagementLabel} value={bodyFatPercentage}
          onChangeText={text => setBodyFatPercentage(text)} placeholder="ここに入力" keyboardType={"numeric"}/>
          <Text style={styles.unit}>%</Text>
        </View>
      </View>
      
      <CircleButton name={"check"} onPress={handleSubmit} placeholder="body"/>
    </View>
  );
}

export default WeightManagementScreen