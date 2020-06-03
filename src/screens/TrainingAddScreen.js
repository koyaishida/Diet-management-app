import React ,{useState,}from 'react';
import { StyleSheet, View, TouchableWithoutFeedback,Keyboard,KeyboardAvoidingView} from 'react-native';
import CircleButton from "../elements/CircleButton"
import { Input,} from 'react-native-elements'
import firebase from "firebase"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF6",
    width: "100%",
    padding:20
  },
  label : {
    fontSize: 32,
    padding : 20,
  },
  weightManagementLabel: {
    padding: 30,
    fontSize: 24,
    margin: 10,
    backgroundColor: "#fff",
    textAlign: "center",
    width: "95%",
    textAlign: "center"
  },
});


const TrainingAddScreen = (props) => {
  const [addMenu, setAddMenu] = useState("")
  const {part,id} = props.route.params

  const handleSubmit = () => {
     const db = firebase.firestore();
     const {currentUser} = firebase.auth();
      db.collection(`users/${currentUser.uid}/trainingMenu`).doc(id).update({
        [part] : firebase.firestore.FieldValue.arrayUnion(addMenu)
      })
     .then(()=> {
       props.navigation.navigate("TrainingMenu")
     })
     .catch((error)=>{
       console.error("Error adding document: ", error);
     });
  }
  
  return (
    <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
      <View style={styles.container}>
        <Input
          label={`追加するメニュー名 （${part}）`}
          placeholder="ここに入力して下さい"
          value={addMenu}
          inputStyle={{padding:10}}
          labelStyle={{paddingTop:5,color:"black",fontSize:20,fontWeight:"100"}}
          onChangeText={text => setAddMenu(text)}
        />

        <CircleButton name={"check"} onPress={handleSubmit} placeholder="body"/>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default TrainingAddScreen