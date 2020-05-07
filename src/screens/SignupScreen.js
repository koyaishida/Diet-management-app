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
              {name: "PersonalData"}
            ],
          })
      props.navigation.dispatch(resetAction)
    })
      
    .catch((error)=>{
      console.log(error)
      const errorMessage = ()=>{
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