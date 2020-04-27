import React ,{useState}from 'react';
import { StyleSheet, View, Text,ScrollView,} from 'react-native';
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
    fontSize:17,
    paddingTop:10,
    paddingBottom:10,
  },
  table: {
    flexDirection : "row",
    width:"98%",
    justifyContent:"center"
  },
  tableLabel: {
    padding:5,
    borderWidth:1,
    width:"26%",
    textAlign:"center",
    lineHeight:20,
  },
  tableContent:{
    padding:5,
    fontSize:10,
    width:"72%",
    borderWidth:1,
    justifyContent:"center"
  },
  tableHead:{
    backgroundColor:"#ddd",
    fontSize:13,
    lineHeight:20
  },
  text:{
    fontSize:20,
    paddingTop:50,
  },
  result:{
    fontSize:28,
    paddingLeft:20,
  },
  resultContainer:{
    width:"80%",
    height:35,
    borderBottomColor:"#ddd",
    borderBottomWidth:2,
  },
  scrollContainer:{
    marginTop:250,
  }
});





const  PersonalDataScreen =(props)=>{
  const [age,setAge]=useState()
  const [height,setHeight]=useState()
  const [weight,setWeight]=useState()
  const [bmi,setBmi]=useState()
  const [isMen,setIsMen]=useState(true)
  const [isWomen,setIsWomen]=useState()
  const [selectedIndex,setSelectedIndex]=useState(3)
  const [dailyBasalMetabolism,setDailyBasalMetabolism]=useState()
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
    const scrollEnd =()=>{
      this.scroller.scrollToEnd()
    }

  
  
     const handleSubmit = () => {
       console.log(props)
        const db = firebase.firestore();
        const {currentUser} = firebase.auth();
          db.collection(`users/${currentUser.uid}/personalData`).doc("PersonalData").set({
            requiredKcal:requiredKcal,
            targetWeight:targetWeight,
          })
         .then(()=> {
           props.navigation.navigate("Home")
           console.log("then")
         })
         .catch((error)=>{
           console.error("Error adding document: ", error);
         });
      }
       
       
      const calculate =()=>{
        setBmi(Math.floor(weight/((height/100)*(height/100))))
        setDailyBasalMetabolism(Math.floor(basalMetabolism*weight))
        setRequiredKcal(Math.floor(basalMetabolism*activityLevel*weight))
         if(selectedIndex == 3 || age == false ||weight == false || height == false){
          setBmi("全ての項目を入力して下さい")
          setRequiredKcal("全ての項目を入力して下さい")
         }
         scrollEnd()
      }
    
  
    return (
      <ScrollView ref={(scroller) => {this.scroller = scroller}} >
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
          inputStyle={{padding:10}}
          labelStyle={{paddingTop:5,color:"black",fontSize:17,fontWeight:"100"}}
          onChangeText={text => setAge(text)}
          keyboardType={"numeric"}
        />
        <Input
          label="身長 (cm)"
          placeholder="半角数字で入力して下さい"
          value={height}
          inputStyle={{padding:10}}
          labelStyle={{paddingTop:5,color:"black",fontSize:17,fontWeight:"100"}}
          onChangeText={text => setHeight(text)}
          keyboardType={"numeric"}
        />
        <Input
          label="体重 (kg)"
          placeholder="半角数字で入力して下さい"
          value={weight}
          inputStyle={{padding:10}}
          labelStyle={{paddingTop:5,color:"black",fontSize:17,fontWeight:"100"}}
          onChangeText={text => setWeight(text)}
          keyboardType={"numeric"}
        />
        <Text style={styles.label}>身体活動レベルを選択して下さい</Text>
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
          <Text style={styles.tableContent}>座位中心の仕事だが、職場での移動や立位での作業・接客等、{"\n"}あるいは通勤・買物・家事、軽いスポーツ等を含む場合</Text>
        </View>
        <View style={styles.table}>
          <Text  style={styles.tableLabel}>高い</Text>
          <Text style={styles.tableContent}>移動や立位の多い仕事への従事者。{"\n"}または、スポーツなど余暇における活発な運動習慣がある場合</Text>
        </View>
        <ButtonGroup
          onPress={(index)=>setSelectedIndex(index)}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={{height: 36,marginTop:15,marginBottom:15}}
        />

        <Button
          title="計算する"
          onPress={()=>{calculate()}}
          buttonStyle={{borderRadius:25}}
          containerStyle={{borderRadius:25,width:"80%",marginRight:"auto",marginLeft:"auto",marginBottom:100,marginTop:50}}
        />

        <View style={styles.scrollContainer}>
        <Text style={styles.text}>あなたのBMIは</Text>
        <View style={styles.resultContainer}>
          <Text style={styles.result}>{bmi}</Text>
        </View>
        <Text style={styles.text}>あなたの1日の基礎代謝量</Text>
        <View style={styles.resultContainer}>
          <Text style={styles.result}>{`${dailyBasalMetabolism}  kcal/日`}</Text>
        </View>
        <Text style={styles.text}>あなたの1日に必要な推定エネルギー量</Text>
        <View style={styles.resultContainer}>
          <Text style={styles.result}>{`${requiredKcal}  kcal/日`}</Text>
        </View>
        <Input
          label="目標体重を設定して下さい(kg)"
          placeholder="半角数字で入力して下さい"
          value={targetWeight}
          inputStyle={{padding:10,fontSize:24,height:60}}
          labelStyle={{paddingTop:5,color:"black",fontSize:28,fontWeight:"bold",textAlign:"center"}}
          containerStyle={{width:"100%",marginTop:80,marginBottom:80}}
          onChangeText={text => setTargetWeight(text)}
          keyboardType={"numeric"}
        />
        <Button title="この内容で登録する"
          onPress={()=>{handleSubmit()}}
          titleStyle={{fontWeight:"bold",fontSize:24}}
          buttonStyle={{borderRadius:25,padding:24}}
          containerStyle={{borderRadius:25,width:"80%",marginRight:"auto",marginBottom:120,marginLeft:"auto"}}></Button>
        </View>
      </View>  
      </ScrollView>
    );
}

export default PersonalDataScreen