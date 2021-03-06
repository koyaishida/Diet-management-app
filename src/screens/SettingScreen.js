import React ,{useState,useEffect}from 'react';
import { StyleSheet, View, Text,ScrollView,KeyboardAvoidingView} from 'react-native';
import firebase from "firebase"
import { CheckBox,Input,Button ,ButtonGroup} from 'react-native-elements'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF6",
    width: "100%",
    padding:10,
    justifyContent:"center",
  },
  checkBox :{
    flexDirection : "row",
  },
  label:{
    fontSize:16,
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:10,
  },
  table: {
    flexDirection : "row",
    justifyContent:"center"
  },
  tableLabel: {
    padding:5,
    borderWidth:1,
    width:"27%",
    textAlign:"center",
    lineHeight:20,
  },
  tableContent:{
    padding:5,
    fontSize:10,
    width:"73%",
    borderWidth:1,
    justifyContent:"center"
  },
  tableHead:{
    backgroundColor:"#ddd",
    fontSize:13,
    lineHeight:20,
  },
  text:{
    fontSize:16,
  },
  result:{
    fontSize:28,
    paddingLeft:20,
  },
  resultContainer:{
    width:"90%",
    height:35,
    borderBottomColor:"#ddd",
    borderBottomWidth:1,
    marginBottom:10,
  },
});





const  SettingScreen =(props)=>{
  const [email,setEmail]=useState()
  const [age,setAge]=useState()
  const [height,setHeight]=useState()
  const [weight,setWeight]=useState()
  const [isMen,setIsMen]=useState(true)
  const [isWomen,setIsWomen]=useState(false)
  const [selectedIndex,setSelectedIndex]=useState(3)
  const [requiredKcal,setRequiredKcal]=useState()
  const [targetWeight,setTargetWeight]=useState()
  
  const buttons = ["低い", "普通", "高い"]

  let activityLevel 
  if(selectedIndex == 0){
    activityLevel = 1.5
    }else if(selectedIndex == 1){
      activityLevel = 1.75
      }else if(selectedIndex == 2){
        activityLevel = 2
        }   

  let basalMetabolism 
  if(isMen == true){
    if(age<10){
      basalMetabolism = 50
      }else if(age<15){
          basalMetabolism = 35
        }else if (age<17){
          basalMetabolism = 27
          }else if (age<29){
              basalMetabolism = 24
            }else if (age<49){
                basalMetabolism = 22.3
              }else if (age<69){
                  basalMetabolism = 21.5
                }else if (age>70){
                  basalMetabolism = 21.5
                }
        }else if(isWomen){
          if(age<10){
            basalMetabolism = 48
           }else if(age<15){
                basalMetabolism = 30
             }else if (age<17){
                basalMetabolism = 25.3
                }else if (age<29){
                    basalMetabolism = 23.6
                  }else if (age<49){
                      basalMetabolism = 21.7
                    }else if (age<69){
                        basalMetabolism = 20.7
                      }else if (age>70){
                        basalMetabolism = 20.7
                        }
        }
    

  
     const db = firebase.firestore();
     const {currentUser} = firebase.auth();
     const handleSubmit = () => {
          db.collection(`users/${currentUser.uid}/personalData`).doc("PersonalData").set({
            age:age,
            height:height,
            weight:weight,
            bmi:30,
            isMen:isMen,
            isWomen:isWomen,
            selectedIndex:selectedIndex,
            dailyBasalMetabolism:Math.floor(basalMetabolism*weight),
            targetWeight:targetWeight,
            requiredKcal:Math.floor(basalMetabolism*activityLevel*weight),
          })
         .then(()=> {
           props.navigation.navigate("Home")
           console.log("then")
         })
         .catch((error)=>{
           console.error("Error adding document: ", error);
         });
      }
     const handleChangeEmail = () => {
      currentUser.updateEmail("user@example.com").then(function() {
        // Update successful.
        props.navigation.navigate("Home")
        console.log("changed")
      }).catch(function(error) {
        console.error("Error adding document: ", error);
        // An error happened.
      });
     }
  
       
      let disabled = true
      if(selectedIndex !== 3 && age !== false &&weight !== false && height !== false){
          disabled = false
      }
      useEffect(()=>{
        const {currentUser} = firebase.auth();
        const db =firebase.firestore()
        db.collection(`users/${currentUser.uid}/personalData`)
        .onSnapshot((querySnapshot)=>{
          const personalData = []
          querySnapshot.forEach((doc)=>{
            personalData.push({...doc.data(),key: doc.id})
          })
          setIsMen(personalData[0].isMen)
          setIsWomen(personalData[0].isWomen)
          setAge(personalData[0].age)
          setHeight(personalData[0].height)
          setWeight(personalData[0].weight)
          setSelectedIndex(personalData[0].selectedIndex)
          setRequiredKcal(requiredKcal)
          setTargetWeight(personalData[0].targetWeight)
        })
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            setEmail(user.email)
          } else {
           setEmail("メールアドレスが登録されていません。")
          }
        });
        return () => {console.log('Clean Up ')};
      },[])
    
    return (
      <KeyboardAvoidingView behavior={"padding"}
         keyboardVerticalOffset={80}>
      <ScrollView >
        <View style={styles.container}>
          <Text style={styles.label}>性別</Text>
          <View style={styles.checkBox}>
            <CheckBox
              center
              title="男性"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              containerStyle={{}}
              checked={isMen}
              onPress={()=>{isMen ? setIsMen(false):setIsMen(true),setIsWomen(false)}}
            />
            <CheckBox
              center
              title="女性"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={isWomen}
              onPress={()=>{isWomen ? setIsWomen(false):setIsWomen(true),setIsMen(false)}}
            />
          </View> 
          <Input
            label="年齢"
            placeholder="半角数字で入力して下さい"
            value={age}
            inputStyle={{padding:5}}
            labelStyle={{paddingTop:5,color:"black",fontSize:17,fontWeight:"100"}}
            onChangeText={text => setAge(text)}
            keyboardType={"numeric"}
          />
          <Input
            label="身長 (cm)"
            placeholder="半角数字で入力して下さい"
            value={height}
            inputStyle={{padding:5}}
            labelStyle={{paddingTop:5,color:"black",fontSize:17,fontWeight:"100"}}
            onChangeText={text => setHeight(text)}
            keyboardType={"numeric"}
          />
          <Input
            label="体重 (kg)"
            placeholder="半角数字で入力して下さい"
            value={weight}
            inputStyle={{padding:5}}
            labelStyle={{paddingTop:5,color:"black",fontSize:17,fontWeight:"100"}}
            onChangeText={text => setWeight(text)}
            keyboardType={"numeric"}
          />
          <Text style={styles.label}>身体活動レベル</Text>
          <View  style={styles.table}>
            <Text style={[styles.tableLabel,styles.tableHead]}>身体活動レベル</Text>
            <Text style={[styles.tableContent,styles.tableHead]}>日常生活の内容</Text>
          </View>
          <View style={styles.table}>
            <Text style={styles.tableLabel}>低い</Text>
            <Text style={styles.tableContent}>生活の大部分が座位で、静的な活動が中心の場合</Text>
          </View>
          <View style={styles.table}>
            <Text style={styles.tableLabel}>普通</Text>
            <Text style={styles.tableContent}>座位中心の仕事だが、職場での移動や立位での作業・接客等、あるいは通勤・家事、軽いスポーツ等を含む場合</Text>
          </View>
          <View style={styles.table}>
            <Text  style={styles.tableLabel}>高い</Text>
            <Text style={styles.tableContent}>移動や立位の多い仕事への従事者。または、スポーツなど余暇における活発な運動習慣がある場合</Text>
          </View>
          <ButtonGroup
            onPress={(index)=>setSelectedIndex(index)}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{height: 34,marginTop:10,marginBottom:10}}
          />
          <Text style={styles.text}>あなたのBMIは</Text>
          <View style={styles.resultContainer}>
            <Text style={styles.result}>{Math.floor(weight/((height/100)*(height/100)))}</Text>
          </View>
          <Text style={styles.text}>あなたの1日の基礎代謝量</Text>
          <View style={styles.resultContainer}>
            <Text style={styles.result}>{`${Math.floor(basalMetabolism*weight)}  kcal/日`}</Text>
          </View>
          <Text style={styles.text}>あなたの1日に必要な推定エネルギー量</Text>
          <View style={styles.resultContainer}>
            <Text style={styles.result}>{`${ Math.floor(basalMetabolism*activityLevel*weight)}  kcal/日`}</Text>
          </View>
          <Input
            label="目標体重(kg)"
            placeholder="半角数字で入力して下さい"
            value={targetWeight}
            inputStyle={{padding:10,fontSize:20,height:60,fontSize:28}}
            labelStyle={{paddingTop:5,color:"black",fontSize:20,fontWeight:"bold"}}
            containerStyle={{width:"90%"}}
            onChangeText={text => setTargetWeight(text)}
            keyboardType={"numeric"}
          />
          <Button title="この内容で更新する"
            onPress={()=>{handleSubmit()}}
            titleStyle={{fontWeight:"bold",fontSize:20}}
            buttonStyle={{borderRadius:25,padding:18}}
            containerStyle={{borderRadius:25,width:"80%",marginRight:"auto",marginLeft:"auto",marginTop:24,marginBottom:50}}>
          </Button>
        
        <Input
            label="メールアドレス"
            placeholder="半角英数字で入力して下さい"
            value={email}
            inputStyle={{padding:5}}
            labelStyle={{paddingTop:5,color:"black",fontSize:17,fontWeight:"100"}}
            onChangeText={text => setEmail(text)}
            autoCapitalize={"none"}
            keyboardType={"email-address"}
        />
        <Button title="メールアドレスを変更する"
            onPress={()=>{handleChangeEmail()}}
            titleStyle={{fontWeight:"bold",fontSize:20}}
            buttonStyle={{borderRadius:25,padding:18}}
            containerStyle={{borderRadius:25,width:"80%",marginRight:"auto",marginLeft:"auto",marginTop:24,marginBottom:50}}>
        </Button>
        
      </View>  
      </ScrollView>
      </KeyboardAvoidingView>
    );
}

export default SettingScreen