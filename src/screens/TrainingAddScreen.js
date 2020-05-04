import React ,{useState,}from 'react';
import { StyleSheet, View, TextInput, TouchableWithoutFeedback,Keyboard} from 'react-native';
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
  const part = props.route.params.trainingMenu
  const id = props.route.params.id
  
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
          <View  style={styles.inputLocation}>
            <TextInput multiline style={styles.weightManagementLabel} value={addMenu}
            onChangeText={text => setAddMenu(text)} placeholder="追加するメニュー名" />
          </View>
        <CircleButton name={"check"} onPress={handleSubmit} placeholder="body"/>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default TrainingAddScreen