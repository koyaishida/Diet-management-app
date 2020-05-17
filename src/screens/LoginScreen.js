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
    paddingTop: 72,
    paddingRight: 24,
    paddingLeft: 24,
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
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#E31676",
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    marginTop: 18,
  },
  buttonTitle: {
    fontSize:20,
    color: "#fff",
  },
  toSignup :{
    marginTop: 18,
    alignSelf: "center",
    borderBottomWidth:1,
  },
  signupText:{
    fontSize:20,
  }
  
});


const LoginScreen = (props) => {

  //  const [email,setEmail] =useState("test1@gmail.com")
  //  const [password,setPassword] =useState("password")
   const [email,setEmail] =useState("k.157.2aic@gmail.com")
   const [password,setPassword] =useState("k-a.157.2")

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
      const errorMessage =()=>{
        switch (error.code) {
          case 'auth/cancelled-popup-request':
          case 'auth/popup-closed-by-user':
              return null;
          case 'auth/email-already-in-use':
            if (method.indexOf('signup') !== -1) {
              return 'このメールアドレスは使用されています';
            } else {
              return 'メールアドレスまたはパスワードが違います';
            }
          case 'auth/invalid-email':
            return 'メールアドレスの形式が正しくありません';
          case 'auth/user-disabled':
            return 'サービスの利用が停止されています';
          case 'auth/user-not-found':
            return 'メールアドレスまたはパスワードが違います';
          case 'auth/user-mismatch':
            if (method === 'signin/popup') {
              return '認証されているユーザーと異なるアカウントが選択されました';
            } else {
              return 'メールアドレスまたはパスワードが違います';
            }
          case 'auth/weak-password':
            return 'パスワードは6文字以上にしてください';
          case 'auth/wrong-password':
            return 'メールアドレスまたはパスワードが違います';
          case 'auth/popup-blocked':
            return '認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください';
          case 'auth/operation-not-supported-in-this-environment':
          case 'auth/auth-domain-config-required':
          case 'auth/operation-not-allowed':
          case 'auth/unauthorized-domain':
            return '現在この認証方法はご利用頂けません';
          case 'auth/requires-recent-login':
            return '認証の有効期限が切れています';
          default:
            if (method.indexOf('signin') !== -1) {
              return '認証に失敗しました。しばらく時間をおいて再度お試しください';
            } else {
              return 'エラーが発生しました。しばらく時間をおいてお試しください';
            }
        }
      }
      alert(errorMessage())
    })   
  }
  
  const resetPassword =()=>{
    const auth = firebase.auth();
    // const emailAddress = "user@example.com";

    auth.sendPasswordResetEmail(email).then(function() {
      // Email sent.
      alert(`${email}にメールを送信しました。`)
    }).catch(function(e) {
      // An error happened.
      console.log(error)
      
    });
  }
  
  const switchToSignup = ()=>[
    props.navigation.navigate("Signup")
  ]

  return (
    <View style={styles.container}>

      <TextInput style={styles.input} value={email} placeholder="Email" 
        onChangeText={text => setEmail(text)} autoCapitalize="none" autoCorrect={false}/>
      <TextInput style={styles.input} value={password} placeholder="Password" 
       onChangeText={text=>setPassword(text)} autoCapitalize="none" autoCorrect={false}
       secureTextEntry={true}/>

      <TouchableOpacity  style={styles.toSignup} onPress={resetPassword}>
        <Text style={styles.signupText}>
          パスワードを忘れた方はこちら
        </Text>
      </TouchableOpacity>

      <TouchableHighlight style={styles.button} underlayColor="#C70F66"
        onPress={handleLogin}>
        <Text style={styles.buttonTitle}>ログイン</Text>
      </TouchableHighlight>
      <TouchableOpacity  style={styles.toSignup} onPress={switchToSignup}>
        <Text style={styles.signupText}>
          新規登録はこちら
        </Text>
      </TouchableOpacity>
      

    </View>
  );
}

export default LoginScreen