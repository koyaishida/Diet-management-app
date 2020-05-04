import React ,{useState,useEffect}from 'react';
import { StyleSheet, View,Text} from 'react-native';
import FoodList from "../components/FoodList"
import CircleButton from "../elements/CircleButton"
import firebase from "firebase"
import {Calendar} from 'react-native-calendars'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF6",
    width: "100%"
  },
  dotsDescription:{
    flexDirection:"row",
    justifyContent:"space-around",
    backgroundColor:"#fff",
    paddingBottom:2,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dotItem:{
    flexDirection:"row",
  },
  calendar:{
    borderColor: 'gray',
    height: 350,
    width:"100%",
  }
  
});
const older = ((a,b)=>(a.date.seconds - b.date.seconds))
const dateToString = (date)=>{
  const str = date.toDate().toISOString();
  return str.split("T")[0]
}


const  FoodManagementScreen = (props)=> {

  const [foodData,setFoodData] = useState([])
  const [kcalList,setKcalList] = useState([])
  const [currentDay,setCurrentDay] = useState(new Date().toISOString().split("T")[0],)
  const [requiredKcal,setRequiredKcal] = useState([])
  const [timestamp,setTimestamp] = useState()

  useEffect(()=>{
    const {currentUser} = firebase.auth();
    const db =firebase.firestore()

    db.collection(`users/${currentUser.uid}/food`)
    .onSnapshot((querySnapshot)=>{
      const foodData =[];
      //firebaseから食事データを取得
      querySnapshot.forEach((doc)=>{
        foodData.push({...doc.data(),key: doc.id})
      })
      setFoodData(foodData)
      const sortedKcalData = [...foodData].sort(older)
      for(let i = 0; i < sortedKcalData.length ; i++){
        if(i === 0){
          kcalList.push(
          {kcal:parseFloat(sortedKcalData[0].kcal),
            date:dateToString(sortedKcalData[0].date)})
        }else{
          if(dateToString(sortedKcalData[i].date) === dateToString(sortedKcalData[i -1].date)){
            kcalList[kcalList.length-1].kcal += parseFloat(sortedKcalData[i].kcal)
          }else{
            kcalList.push({kcal:parseFloat(sortedKcalData[i].kcal),date:dateToString(sortedKcalData[i].date)})
            }
        }
      }

      if(kcalList.length == 0){
        setKcalList()
      }else{
        setKcalList(kcalList)
      }
    })
    
   db.collection(`users/${currentUser.uid}/personalData`)
   .onSnapshot((querySnapshot)=>{
      const personalData = []
      querySnapshot.forEach((doc)=>{
        personalData.push({...doc.data(),key: doc.id})
      })
      setRequiredKcal(personalData[0].requiredKcal)
    })

    return () => {console.log('Clean Up ')};
   },[])

   //日毎のデータの加工
    const todayFoodList = foodData.filter((item,index,)=>{
      if (dateToString(item.date) === currentDay){
        return true
          }
    })
    const todaysFoodData = [...todayFoodList].sort(older)

    //カレンダーに渡すmarkedDateの加工
    const markedDays = [0]
    kcalList.forEach((i)=>{
      if(requiredKcal - i.kcal >= 0){
        markedDays.push({
          date:i.date,
          dot:{dots:[{color:"green"}]}
        })
      }else if(requiredKcal - i.kcal < 0){
        markedDays.push({
          date:i.date,
          dot:{dots:[{color:"red"}]}
        })
      }
    })
    const dotDays = Object.assign(...markedDays.map(item => ({ [item.date]: item.dot })))
    const markedDates = {...dotDays,[currentDay]:{selected:true,selectedColor:"#ffa500"}}

    


    return (
      <View style={styles.container}>
          <Calendar 
          onDayPress = {((day)=>{setCurrentDay(day.dateString),setTimestamp(new Date(day.timestamp))})}
          style={styles.calendar}
          markedDates = {
            markedDates
          }
          markingType={'multi-dot'}
          />
          <View style={styles.dotsDescription}>
            <View style={styles.dotItem}>
              <Text style={{color:"green",fontWeight:"bold"}}>・</Text>
              <Text>適正カロリー</Text>
            </View>
            <View style={styles.dotItem}>
              <Text style={{color:"red",fontWeight:"bold"}}>・</Text>
              <Text>カロリーオーバー</Text>
            </View>
          </View>
        
          <FoodList 
            foodData={todaysFoodData}
            navigation={props.navigation}/>
        <CircleButton name={"plus"} onPress={()=>props.navigation.navigate("FoodAdd",{date:timestamp})}/>
      </View>
    ); 
  
}

export default FoodManagementScreen