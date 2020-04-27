import React ,{useState,useEffect}from 'react';
import { StyleSheet, View,Text} from 'react-native';
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
  trainingDay:{
    textAlign:"center",
    fontSize:20,
    fontWeight:"bold",
    backgroundColor:"green",
    color:"#fff",
  }
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
  const dotTrainingList = [...trainingList].sort(older)


  const dotList = dotTrainingList.map((item)=>{
    return {date:dateToString(item.date),part:item.part}
  })
  

  const markedList = [0]
  const breast = "red"
  const back = "green"
  const shoulder = "blue"
  const arm = "yellow"
  const leg = "purple"
  const other = "black"
  

  for(let i = 0 ; i < dotList.length; i++){
    const addMarkedList = (dotColor)=>{
      markedList.push({
        date:[dotList[i].date],
        dot:{dots:[{color:dotColor}]}
      })
    }
    const addDots = (dotColor)=>{
      markedList[markedList.length-1].dot.dots.push({color:dotColor})
    }
    if(i == 0 || dotList[i].date !== dotList[i-1].date){
      if(dotList[i].part == "胸"){
        addMarkedList(breast)
      }
      else if(dotList[i].part =="背中"){
        addMarkedList(back)
      }
      else if(dotList[i].part=="肩"){
        addMarkedList(shoulder)
      }
      else if(dotList[i].part=="腕"){
        addMarkedList(arm)
      }
      else if(dotList[i].part=="脚"){
        addMarkedList(leg)
      }else if(dotList[i].part=="その他"){
        addMarkedList(other)
      }
    }else if(i > 0){
       if(dotList[i].date == dotList[i-1].date && dotList[i].part !== dotList[i-1].part){
           if(dotList[i].part == "胸"){
             addDots(breast)
           }
            else if(dotList[i].part =="背中"){
              addDots(back)
            }
            else if(dotList[i].part=="肩"){
              addDots(shoulder)
           }
            else if(dotList[i].part=="腕"){
              addDots(arm)
           }
            else if(dotList[i].part=="脚"){
              addDots(leg)
           }
            else if(dotList[i].part=="その他"){
              addDots(other)
           }    
      }else if(dotList[i].date == dotList[i-1].date && dotList[i].part == dotList[i-1].part){
        
      }
    }
  }
  const dotDays = Object.assign(...markedList.map(item => ({ [item.date]: item.dot })));
  const markedDays = {...dotDays,[currentDay]:{selected:true,selectedColor:"#ffa500"}}

    return (
      <View style={styles.container}>
        <Calendar 
          onDayPress = {((day)=>{setCurrentDay(day.dateString)})}
          style={{
            borderColor: 'gray',
            height: 350,
            width:"100%"
          }}
          markedDates={
            markedDays
          }
          markingType={'multi-dot'}
        />
        <Text style={styles.trainingDay}>{currentDay}のトレーニング記録</Text>
        <TrainingList 
          trainingList={sortedTrainingList}
          navigation={props.navigation}/>
        <CircleButton name={"plus"} 
        onPress={()=>props.navigation.navigate("TrainingMenu")}
        /> 
      </View>
    ); 
  
}

export default TrainingManagementScreen