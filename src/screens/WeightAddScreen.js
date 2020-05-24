import React ,{useState}from 'react';
import { StyleSheet, View,TouchableWithoutFeedback,Keyboard,} from 'react-native';
import CircleButton from "../elements/CircleButton"
import { Input,} from 'react-native-elements'
import firebase from "firebase"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF6",
    width: "100%",
    padding:20,
  },
  calendar:{
    borderColor: 'gray',
    height: 350,
    width:"100%",
    marginTop:100,
  }
});


const WeightAddScreen = (props) => {
  const [weight,setWeight] =useState()
  const [bodyFatPercentage,setBodyFatPercentage] =useState()
  const {date} = props.route.params
  
  const disabled =()=>{
    if(isNaN(parseFloat(weight)) || weight === undefined){
      return true
    }else{
      return false
    }
  }


  //体重の値が０の時エラーにある為、後日修正
   const handleSubmit = () => {
     console.log("press")
      const db = firebase.firestore();
      const {currentUser} = firebase.auth();
       db.collection(`users/${currentUser.uid}/weight`).add({
            weight : weight,
            bodyFatPercentage : bodyFatPercentage,
            date: date ? new Date(date) : new Date()
       })
      .then(()=> {
        props.navigation.navigate("WeightManagement")
        console.log("then")
      })
      .catch((error)=>{
        console.error("Error adding document: ", error);
      });
  }
  
  
  return (
    <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
      <View style={styles.container}>
        <Input
          label="体重 (kg)"
          placeholder="半角数字で入力して下さい"
          value={weight}
          inputStyle={{padding:10}}
          labelStyle={{paddingTop:5,color:"black",fontSize:17,fontWeight:"100"}}
          onChangeText={text => setWeight(text)}
          keyboardType={"numeric"}
        />
        <Input
          label="体脂肪率 (%)"
          placeholder="半角数字で入力して下さい"
          value={bodyFatPercentage}
          inputStyle={{padding:10}}
          labelStyle={{paddingTop:5,color:"black",fontSize:17,fontWeight:"100"}}
          onChangeText={text => setBodyFatPercentage(text)}
          keyboardType={"numeric"}
        />
        
        <CircleButton name={"check"} onPress={handleSubmit} placeholder="body" 
        // style={{position: "absolute",top: 180,right: 32,}}
        disabled={disabled()}/>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default WeightAddScreen