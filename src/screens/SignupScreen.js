import React , {useState} from 'react';
import { StyleSheet, View,Text, TextInput, TouchableHighlight } from 'react-native';
import firebase from "firebase"
import { CommonActions } from '@react-navigation/native'



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF6",
    width: "100%",
    padding: 24,
  },
  input: {
    height: 48,
    marginBottom:24,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 8,
    lineHeight: 24,
    fontSize: 18,
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    alignSelf: "center"
  },
  button: {
    backgroundColor: "#E31676",
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    alignSelf: "center"
  },
  buttonTitle: {
    fontSize:20,
    color: "#fff",
  }
  
});


const SignupScreen = (props) => {

  const [email,setEmail] =useState("")
  const [password,setPassword] =useState("")

  // signup function
  const handleSignup = () => {
    

    firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(()=>{
      console.log("success")
      const db = firebase.firestore();
     const {currentUser} = firebase.auth();
      db.collection(`users/${currentUser.uid}/trainingMenu`).add({
        "胸" : [
          "ベンチプレス","チェストプレス","ダンベルフライ"
        ],
        "背中": [
          "懸垂","デッドリフト","ラットプルダウン"
        ],
        "脚": [
          "スクワット","レッグプレス","レッグエクステンション"
        ],
        "肩":[
          "サイドレイズ","ショルダープレス","フロントレイズ",
        ],
        "腕": [
          "アームカール"
        ],
        "その他": [
          "ランニング","ウォーキング",
        ]
          
      })
      const resetAction = 
          CommonActions.reset({
            index:0,
            routes: [
              {name: "Home"}
            ],
          })
      props.navigation.dispatch(resetAction)
    })
      
    .catch((error)=>{
      console.log(error)
    })
  }

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        新規登録
      </Text>
      <TextInput style={styles.input} value={email} placeholder="Email" 
      onChangeText={text => setEmail(text)} autoCapitalize="none" autoCorrect={false}/>

      {/* onChangeではなくonChangeText */}
      <TextInput style={styles.input} value={password} placeholder="Password" onChangeText={text => setPassword(text)} autoCapitalize="none" autoCorrect={false} secureTextEntry={true}/>
      
      <TouchableHighlight style={styles.button} underlayColor="#C70F66" onPress={handleSignup}>
        <Text style={styles.buttonTitle}>送信する</Text>
      </TouchableHighlight>

    </View>
  );
}

export default SignupScreen