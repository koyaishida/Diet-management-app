import React ,{useState,useEffect}from 'react';
import { StyleSheet, View,} from 'react-native';
import FoodList from "../components/FoodList"
import CircleButton from "../elements/CircleButton"
import firebase from "firebase"
import {Calendar} from 'react-native-calendars'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFFDF6",
    width: "100%"
  },
  
});
const older = ((a,b)=>(a.date.seconds - b.date.seconds))


const  FoodManagementScreen = (props)=> {
  
  dateToString = (date)=>{
    const str = date.toDate().toISOString();
    return str.split("T")[0]
  }
  const [foodData,setFoodData] = useState([])
  const [kcalList,setKcalList] = useState([])
  const [currentDay,setCurrentDay] = useState(new Date().toISOString().split("T")[0],)
  const [requiredKcal,setRequiredKcal] = useState([])
  
  
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
   },[])

    const todayFoodList = foodData.filter((item,index,)=>{
      if (dateToString(item.date) === currentDay){
        return true
          }
    })

    const todaysFoodData = [...todayFoodList].sort(older)

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
          onDayPress = {((day)=>{setCurrentDay(day.dateString)})}
          style={{
            borderWidth:1,
            borderColor: "black",
            height: 350,
            width:"100%",
          }}
          markedDates = {
            markedDates
         }
         markingType={'multi-dot'}
         theme={{
          'stylesheet.calendar.header': {
            week: {
              marginTop: 0,
              flexDirection: 'row',
              justifyContent: "space-between"
            }
          }
        }}
        />
          <FoodList 
            foodData={todaysFoodData}
            navigation={props.navigation}/>
        <CircleButton name={"plus"} onPress={()=>props.navigation.navigate("FoodAdd")}/>
      </View>
    ); 
  
}

export default FoodManagementScreen