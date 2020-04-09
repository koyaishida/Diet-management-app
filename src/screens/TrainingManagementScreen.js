import React ,{useState,useEffect}from 'react';
import { StyleSheet, View,} from 'react-native';
import TrainingList from "../components/TrainingList"
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

       const todayTrainingList = trainingList.filter((item,index,)=>{
        if (dateToString(item.date) === currentDay){
          return true
        }
      })
      const sortedTrainingList = [...todayTrainingList].sort(older)
       setTrainingList(sortedTrainingList)
      })   
  },[])
  const getWeight =(day)=>{
    trainingList.forEach((item)=>{
      if(dateToString(item.date) == day.dateString){
       console.log(item)
      }else{
        return
      }
    })
  }

 
    return (
      <View style={styles.container}>
          <TrainingList 
            trainingList={trainingList}
            navigation={props.navigation}/>
        <CircleButton name={"plus"} onPress={()=>props.navigation.navigate("TrainingMenu")}/>
        <Calendar 
          onDayPress = {((day)=>{getWeight(day)})}
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            height: 350,
            width:"100%"
          }}
        />
      </View>
    ); 
  
}

export default TrainingManagementScreen