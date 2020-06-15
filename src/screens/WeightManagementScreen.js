import React ,{useState,useEffect}from 'react';
import { StyleSheet, View,Text} from 'react-native';
import WeightList from "../components/WeightList"
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
  calendar:{
    borderColor: 'gray',
    height: 350,
    width:"100%",
  },
  date:{
    textAlign:"center",
    fontSize:20,
    fontWeight:"500",
    backgroundColor:"#00b2b2",
    color:"#fff",
  },
  
});
const older = ((a,b)=>(a.date.seconds - b.date.seconds))
const dateToString = (date)=>{
  const str = date.toDate().toISOString();
  return str.split("T")[0]
}


const  WeightManagementScreen = (props)=> {

  const [weightDataList,setWeightDataList] = useState([])
  const [currentDay,setCurrentDay] = useState(new Date().toISOString().split("T")[0],)
  const [timestamp,setTimestamp] = useState()

  useEffect(()=>{

    const {currentUser} = firebase.auth();
    const db =firebase.firestore()

    db.collection(`users/${currentUser.uid}/weight`)
     .onSnapshot((querySnapshot)=>{
       const weightList = []
       querySnapshot.forEach((doc)=>{
         weightList.push({...doc.data(),key: doc.id})
       })
       setWeightDataList(weightList)
    })
    
    return () => {console.log('Clean Up ')};
  },[currentDay])

   //日毎のデータの加工
     const currentWeightList = weightDataList.sort(older).filter((item,index,)=>{
       if (dateToString(item.date) === currentDay){
         return true
           }
     })
     
     let markedDays = [0]
     weightDataList.forEach((i)=>{
       markedDays = [...markedDays,{
         date:dateToString(i.date),
         dot:{dots:[{color:"black"}]}
       }]
     })

     const dotDays = Object.assign(...markedDays.map(item => ({ [item.date]: item.dot })))
     const markedDates = {...dotDays,[currentDay]:{selected:true,selectedColor:"#ffa500"}}

     

    return (
      <View style={styles.container}>
          <Calendar 
            onDayPress = {((day)=>{
              setCurrentDay(day.dateString),
              setTimestamp(day.timestamp)}
            )}
            style={styles.calendar}
            markedDates = {markedDates}
            markingType={'multi-dot'}
          />
          <Text style={styles.date}>{currentDay}の体重記録</Text>
          <WeightList 
            weightData={currentWeightList}
            navigation={props.navigation}/>
          <CircleButton name={"plus"} onPress={()=>props.navigation.navigate("WeightAdd",{date:timestamp})}/>
      </View>
    ); 
  
}

export default WeightManagementScreen