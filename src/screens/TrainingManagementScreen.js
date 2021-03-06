import React ,{ useState,useEffect}from 'react';
import { StyleSheet, View, Text} from 'react-native';
import TrainingList from "../components/TrainingList"
import CircleButton from "../elements/CircleButton"
import firebase from "firebase"
import {Calendar} from 'react-native-calendars';



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
  dateLabel:{
    textAlign:"center",
    fontSize:20,
    fontWeight:"500",
    backgroundColor:"#00b2b2",
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
  

  let  markedList = [0]
  const breast = {key:"breast",color:"red"}
  const back = {key:"back",color:"green"}
  const shoulder = {key:"shoulder",color:"blue"}
  const arm = {key:"arm",color:"orange"}
  const abs = {key:"abs",color:"#ff6ab5"}
  const leg = {key:"leg",color:"purple"}
  const aerobic = {key:"aerobic",color:"black"}
  const other = {key:"other",color:"#d3d3d3"}
  
  for(let i = 0 ; i < dotList.length; i++){
    //日付とdotの追加
    const addMarkedList = (part)=>{
      markedList = [...markedList,{
        date:[dotList[i].date],
        dot:{dots:[part]}
        }
      ]
    }
    //dotColorのみ追加
    const addDots = (part)=>{
      if( markedList[markedList.length-1].dot.dots.indexOf(part)===-1){
        markedList[markedList.length-1].dot.dots = [ ...markedList[markedList.length-1].dot.dots, part]
      }
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
      else if(dotList[i].part=="腹"){
        addMarkedList(abs)
      }
      else if(dotList[i].part=="脚"){
        addMarkedList(leg)
      }else if(dotList[i].part=="有酸素"){
        addMarkedList(aerobic)
      }else if(dotList[i].part=="その他"){
        addMarkedList(other)
      }
    }else if(i > 0){
      if(dotList[i].date == dotList[i-1].date){
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
            else if(dotList[i].part=="腹"){
              addDots(abs)
           }
            else if(dotList[i].part=="脚"){
              addDots(leg)
           }
            else if(dotList[i].part=="有酸素"){
              addDots(aerobic)
           } 
            else if(dotList[i].part=="その他"){
              addDots(other)
           } 
          }   
    }
  }
  const dotDays = Object.assign(...markedList.map(item => ({ [item.date]: item.dot })));
  const markedDays = {...dotDays,[currentDay]:{selected:true,selectedColor:"#ffa500"}}

  
    return (
      <View style={styles.container}>
        
        <Calendar 
          onDayPress = {((day)=>{
            setCurrentDay(day.dateString),
            setTimestamp(day.timestamp)}
          )}
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
            <Text style={{color:"orange",fontWeight:"bold"}}>・</Text>
            <Text>腕</Text>
          </View>
          <View style={styles.dotsDescription}>
            <Text style={{color:"#ff6ab5",fontWeight:"bold"}}>・</Text>
            <Text>腹</Text>
          </View>
          <View style={styles.dotsDescription}>
            <Text style={{color:"purple",fontWeight:"bold"}}>・</Text>
            <Text>脚</Text>
          </View>
          <View style={styles.dotsDescription}>
            <Text style={{color:"black",fontWeight:"bold"}}>・</Text>
            <Text>有酸素</Text>
          </View>
          <View style={styles.dotsDescription}>
            <Text style={{color:"#d3d3d3",fontWeight:"bold"}}>・</Text>
            <Text>その他</Text>
          </View>
        </View>
        <Text style={styles.dateLabel}>{currentDay}のトレーニング</Text>
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