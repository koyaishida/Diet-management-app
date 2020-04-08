import React, {useState}from 'react';
import { StyleSheet, View,Text, TextInput, TouchableHighlight } from 'react-native';
import firebase from "firebase"
import { TouchableOpacity } from 'react-native-gesture-handler';
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
  },
  toSignup :{
    marginTop: 10,
    alignSelf: "center"
  }
  
});


const LoginScreen = (props) => {

  const [email,setEmail] =useState("k.157.2@gmail.com")
  const [password,setPassword] =useState("koya1572")

  const handleLogin = () =>{
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(()=>{
        console.log("success")
        
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
        console.log("error")
      })
    
  }
  const switchToSignup = ()=>[
    props.navigation.navigate("Signup")
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ログイン
      </Text>

      <TextInput style={styles.input} value={email} placeholder="Email" 
      onChangeText={text => setEmail(text)} autoCapitalize="none" autoCorrect={false}/>

      {/* onChangeではなくonChangeText */}
      <TextInput style={styles.input} value={password} placeholder="Password" onChangeText={text => setPassword(text)} autoCapitalize="none" autoCorrect={false} secureTextEntry={true}/>

      <TouchableHighlight style={styles.button} underlayColor="#C70F66"
        onPress={handleLogin}>
        <Text style={styles.buttonTitle}>ログインする</Text>
      </TouchableHighlight>
      <TouchableOpacity  style={styles.toSignup} onPress={switchToSignup}>
        <Text>
          メンバー登録する
        </Text>
      </TouchableOpacity>

    </View>
  );
}

export default LoginScreen