import React, {useState, useEffect}from 'react';
import { StyleSheet, View,Text, TextInput, TouchableHighlight,TouchableWithoutFeedback,Keyboard } from 'react-native';
import firebase from "firebase"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CommonActions } from '@react-navigation/native';
import Modal from "react-native-modal";
import * as SecureStore from 'expo-secure-store'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf8f8",
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
  },
  modal:{
    height:"50%",
    justifyContent:'center',
    alignItems: 'center', 
    backgroundColor: "#fff",
    borderRadius:8
  },
  modalTitle:{
    fontSize:20
  },
  modalInput:{
    margin:10,
    width:"90%",
    backgroundColor:"#eee",
    padding:20,
    fontSize:20,
    borderRadius:14,
  },
  modalButton:{
    backgroundColor:"#00b2b2",
    margin:30,
    padding:10,
    width:200,
    borderRadius:14,
  },
  modalButtonText:{
    color:"#fff",
    fontSize:20,
    textAlign:"center"
  }
  
});


const LoginScreen = (props) => {

   const [email,setEmail] =useState("")
   const [password,setPassword] =useState("")
   const [isModalVisible,setIsModalVisible]=useState(false)
   const toggleModal = ()=>{
     setIsModalVisible(!isModalVisible)
   }
   //前回ログイン時のemail・passの取得
   useEffect(()=>{
      SecureStore.getItemAsync("email")
      .then((email)=>{
        setEmail(email)
      })
      SecureStore.getItemAsync("password")
      .then((password)=>{
        setPassword(password)
      })
   },[])
   
  //ログイン処理
  const handleLogin = () =>{
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(()=>{
      console.log("success")
      SecureStore.setItemAsync("email",email)
      SecureStore.setItemAsync("password",password)
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
  //パスワードリセット
  const resetPassword =()=>{
    const auth = firebase.auth();

    auth.sendPasswordResetEmail(email).then(function() {
      alert(`${email}にメールを送信しました。`)
    }).catch(function(error) {
      const errorMessage =()=>{
        switch (error.code) {
          case 'auth/cancelled-popup-request':
          case 'auth/popup-closed-by-user':
              return null;
          case 'auth/invalid-email':
            return 'メールアドレスの形式が正しくありません';
          case 'auth/user-disabled':
            return 'サービスの利用が停止されています';
          case 'auth/user-not-found':
            return '登録されていないか、メールアドレスが違います';
          case 'auth/user-mismatch':
            if (method === 'signin/popup') {
              return '認証されているユーザーと異なるアカウントが選択されました';
            } else {
              return 'メールアドレスまたはパスワードが違います';
            }
          case 'auth/popup-blocked':
            return '認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください';
          case 'auth/operation-not-supported-in-this-environment':
          case 'auth/auth-domain-config-required':
          case 'auth/operation-not-allowed':
          case 'auth/unauthorized-domain':
            return '現在この認証方法はご利用頂けません';
          default:
            if (method.indexOf('signin') !== -1) {
              return '認証に失敗しました。しばらく時間をおいて再度お試しください';
            } else {
              return 'エラーが発生しました。しばらく時間をおいてお試しください';
            }
        }
      }
      alert(errorMessage())
    });
  }
  
  //新規登録へ移動
  const switchToSignup = ()=>[
    props.navigation.navigate("Signup")
  ]

  return (
    <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
      <View style={styles.container}>

        <TextInput style={styles.input} value={email} placeholder="Email" 
          onChangeText={text => setEmail(text)} autoCapitalize="none" autoCorrect={false}/>
        <TextInput style={styles.input} value={password} placeholder="Password" 
        onChangeText={text=>setPassword(text)} autoCapitalize="none" autoCorrect={false}
        secureTextEntry={true}/>

        <TouchableOpacity  style={styles.toSignup} onPress={toggleModal}>
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

        <Modal isVisible={isModalVisible}>
          <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>パスワードの再設定用のURLを送付するメールアドレスを入力して下さい。</Text>
            <TextInput style={styles.modalInput} value={email} placeholder="Email" 
            onChangeText={text => setEmail(text)} autoCapitalize="none" autoCorrect={false}/>
              <TouchableOpacity style={styles.modalButton}onPress={resetPassword}>
                <Text style={styles.modalButtonText}>送信する</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleModal}>
                <Text>閉じる</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>  
        </Modal>

      </View>
    </TouchableWithoutFeedback>
  );
}

export default LoginScreen