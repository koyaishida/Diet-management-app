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
  const [currentDay,setCurrentDay] = useState(new Date().toISOString().split("T")[0],)
  
  
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
    })
  },[])
    const todayFoodList = foodData.filter((item,index,)=>{
      if (dateToString(item.date) === currentDay){
        return true
          }
    })

    const sortedFoodData = [...todayFoodList].sort(older)
    
 
    return (
      <View style={styles.container}>
          <Calendar 
          onDayPress = {((day)=>{setCurrentDay(day.dateString)})}
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            height: 350,
            width:"100%"
          }}
          markedDates = {{
            [currentDay]:{selected:true,selectedColor:"green"},
            
         }}
        />
          <FoodList 
            foodData={sortedFoodData}
            navigation={props.navigation}/>
        <CircleButton name={"plus"} onPress={()=>props.navigation.navigate("FoodAdd")}/>
      </View>
    ); 
  
}

export default FoodManagementScreen