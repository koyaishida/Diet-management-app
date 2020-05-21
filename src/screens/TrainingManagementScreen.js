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
   calendar:{
     height: 350,
     width:"100%",
   },
  dotsDescription:{
    flexDirection:"row",
    justifyContent:"space-around",
    backgroundColor:"#fff",
    paddingBottom:2,
  },
  dots:{
    fontWeight:"bold",
    fontSize:20,
  },
  trainingDay:{
    textAlign:"center",
    fontSize:20,
    fontWeight:"bold",
    backgroundColor:"green",
    color:"#fff",
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
  const [timestamp,setTimestamp] = useState()

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
    return () => {console.log('Clean Up ')};
  },[])

  const currentTrainingList = [...trainingList].sort(older).filter((item,index,)=>{
    if (dateToString(item.date) === currentDay){
      return true
    }
  })
  

  const dotList = [...trainingList].sort(older).map((item)=>{
    return {date:dateToString(item.date),part:item.part}
  })
  
  const markedList = [0]
  
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
        addMarkedList("red")
      }
      else if(dotList[i].part =="背中"){
        addMarkedList("green")
      }
      else if(dotList[i].part=="肩"){
        addMarkedList("blue")
      }
      else if(dotList[i].part=="腕"){
        addMarkedList("yellow")
      }
      else if(dotList[i].part=="腹"){
        addMarkedList("gray")
      }
      else if(dotList[i].part=="脚"){
        addMarkedList("purple")
      }else if(dotList[i].part=="その他"){
        addMarkedList("black")
      }
    }else if(i > 0){
       if(dotList[i].date == dotList[i-1].date && dotList[i].part !== dotList[i-1].part){
           if(dotList[i].part == "胸"){
             addDots("red")
           }
            else if(dotList[i].part =="背中"){
              addDots("green")
            }
            else if(dotList[i].part=="肩"){
              addDots("blue")
           }
            else if(dotList[i].part=="腕"){
              addDots("yellow")
           }
            else if(dotList[i].part=="腹"){
              addDots("gray")
           }
            else if(dotList[i].part=="脚"){
              addDots("purple")
           }
            else if(dotList[i].part=="その他"){
              addDots("black")
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
          onDayPress = {((day)=>{setCurrentDay(day.dateString),setTimestamp(new Date(day.timestamp))})}
          style={styles.calendar}
          markedDates={
            markedDays
          }
          markingType={'multi-dot'}
        />
        <View style={styles.dotsDescription}>
          <View style={styles.dotsDescription}>
            <Text style={{color:"red",fontWeight:"bold"}}>・</Text>
            <Text>胸</Text>
          </View>
          <View style={styles.dotsDescription}>
            <Text style={{color:"green",fontWeight:"bold"}}>・</Text>
            <Text>背中</Text>
          </View>
          <View  style={styles.dotsDescription}>
            <Text style={{color:"blue",fontWeight:"bold"}}>・</Text>
            <Text>肩</Text>
          </View>
          <View style={styles.dotsDescription}>
            <Text style={{color:"yellow",fontWeight:"bold"}}>・</Text>
            <Text>腕</Text>
          </View>
          <View style={styles.dotsDescription}>
            <Text style={{color:"gray",fontWeight:"bold"}}>・</Text>
            <Text>腹</Text>
          </View>
          <View style={styles.dotsDescription}>
            <Text style={{color:"purple",fontWeight:"bold"}}>・</Text>
            <Text>脚</Text>
          </View>
          <View style={styles.dotsDescription}>
            <Text style={{color:"black",fontWeight:"bold"}}>・</Text>
            <Text>その他</Text>
          </View>
        </View>
        <Text style={styles.trainingDay}>{currentDay}のトレーニング記録</Text>
        <TrainingList 
          trainingList={currentTrainingList}
          navigation={props.navigation}
        /> 
        <CircleButton name={"plus"} 
        onPress={()=>props.navigation.navigate("TrainingMenu",{date:timestamp})}
        /> 
      </View>
    ); 
  
}

export default TrainingManagementScreen