import React ,{useState,useEffect}from 'react';
import { StyleSheet, View,} from 'react-native';
import TrainingList from "../components/TrainingList"
import CircleButton from "../elements/CircleButton"
import firebase from "firebase"
import {Calendar} from 'react-native-calendars'



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF6",
    width: "100%"
  },
  
});
const  dateToString = (date)=>{
  const str = date.toDate().toISOString();
  return str.split("T")[0]
}
const older = ((a,b)=>(a.date.seconds - b.date.seconds))

const  TrainingManagementScreen = (props)=> {
  const [trainingList,setTrainingList] = useState([])
  const [currentDay,setCurrentDay] = useState(new Date().toISOString().split("T")[0],)

  useEffect(()=>{

    const {currentUser} = firebase.auth();
    const db =firebase.firestore()

    db.collection(`users/${currentUser.uid}/trainingMemoList`)
     .onSnapshot((querySnapshot)=>{
       const trainingList = []
       querySnapshot.forEach((doc)=>{
         trainingList.push({...doc.data(),key: doc.id})
       })
       setTrainingList(trainingList)
    })   
  },[])

   const todayTrainingList = trainingList.filter((item,index,)=>{
     if (dateToString(item.date) === currentDay){
       return true
     }
   })

   const sortedTrainingList = [...todayTrainingList].sort(older)
 
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
          <TrainingList 
            trainingList={sortedTrainingList}
            navigation={props.navigation}/>
        <CircleButton name={"plus"} onPress={()=>props.navigation.navigate("TrainingMenu")}/> 
      </View>
    ); 
  
}

export default TrainingManagementScreen