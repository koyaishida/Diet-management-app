import React ,{useState,useEffect}from 'react';
import { StyleSheet, View, Text,TouchableHighlight } from 'react-native';
import firebase from "firebase"
import {LineChart} from "react-native-chart-kit"
import {Calendar,CalendarList,Agenda} from 'react-native-calendars'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF6",
    width: "100%"
  },
  upperContainer :{
    flexDirection: "row",
    height: 100,
    justifyContent: "space-around",
    alignItems: "center"
  },
  upperContainerTitle : {
    fontSize: 30,
  },
  upperContainerText : {
    fontSize: 24,
    alignSelf: "flex-end"
  },
  lineChart: {
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "green",
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    marginTop: 10,
  },
  buttonTitle: {
    fontSize:20,
    color: "#fff",
  },
});

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 0.5) => `rgba(0, 0, 0,0.5)`,
}


const decimalPoint  = (y)=>{
return parseFloat(y).toFixed(1)
}

const toInteger = (y)=>{
  return parseFloat(y).toFixed()
}

const dateToString = (date)=>{
  const str = date.toDate().toISOString();
  return str.split("T")[0] 
}

const byDate = ((a,b)=>(a.date.seconds - b.date.seconds))




const HomeScreen = (props)=> {
  const [weightData,setWeightData] = useState([])
  const [weightLabels,setWeightLabels] = useState([])
  const [weightList,setWeightList] = useState([1])
  const [trainingList,setTrainingList] = useState([1])
  const [foodData,setFoodData] = useState([])
  const [kcalList,setKcalList] = useState([1])
  const [currentKcal,setCurrentKcal] = useState([])
  const [kcalLabels,setKcalLabels] = useState([])

  
     
  useEffect (()=>{
    const {currentUser} = firebase.auth();
    const db =firebase.firestore()

     db.collection(`users/${currentUser.uid}/weight`)
     .onSnapshot((querySnapshot)=>{
      
       const weightData =[];
       //firebaseから体重データを取得
        querySnapshot.forEach((doc)=>{
          weightData.push({...doc.data(),key: doc.id})
         })
        setWeightData(weightData)

       //日付の取得
       const weightLabels = [];
       const sortedWeightData = [...weightData].sort(byDate)

       sortedWeightData.forEach((item)=>{
         weightLabels.push(dateToString(item.date).slice(5))
       })
       setWeightLabels(weightLabels)

       //体重の値の取得
       const weightList =[]
       sortedWeightData.forEach((item)=>{
         weightList.push(parseFloat(item.weight).toFixed(1))
       })

       setWeightList(weightList)
       console.log(dateToString(weightData[1].date))

       

     })

     db.collection(`users/${currentUser.uid}/trainingMemoList`)
     .onSnapshot((querySnapshot)=>{
       const trainingList = []
       querySnapshot.forEach((doc)=>{
         trainingList.push({...doc.data(),key: doc.id})
       })
       setTrainingList(trainingList)
     })




     db.collection(`users/${currentUser.uid}/food`)
     .onSnapshot((querySnapshot)=>{
       const foodData =[];
       //firebaseから食事データを取得
        querySnapshot.forEach((doc)=>{
          foodData.push({...doc.data(),key: doc.id})
         })
        setFoodData(foodData)
       
       //kcalの加工
       const kcalList =[]
       const sortedKcalData = [...foodData].sort(byDate)
      
       for(let i = 0; i < sortedKcalData.length ; i++){
         if(i === 0){
           kcalList.push(parseFloat(sortedKcalData[i].kcal))
         }else{
           if(dateToString(sortedKcalData[i].date) === dateToString(sortedKcalData[i -1].date)){
             kcalList[kcalList.length-1] += parseFloat(sortedKcalData[i].kcal)
           }else{
               kcalList.push(parseFloat(sortedKcalData[i].kcal))
             }
         }
       }
       setKcalList(kcalList)
       setCurrentKcal(kcalList[kcalList.length-1]) 


      //kcalLabelの加工
       const kcalLabels = [];

       for (let i = 0; i < sortedKcalData.length; i++){
         if(i === 0){
           kcalLabels.push(dateToString(sortedKcalData[i].date).slice(5))
         }else {
           if(dateToString(sortedKcalData[i].date) === dateToString(sortedKcalData[i -1].date)){
           }else{
               kcalLabels.push(dateToString(sortedKcalData[i].date).slice(5))
             }
         }
       }
       setKcalLabels(kcalLabels)
     })
     return (() => console.log('Clean Up '));
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
        <View  style={styles.upperContainer}>
          <View>
            <Text style={styles.upperContainerTitle}>摂取カロリー</Text>
            <Text style={styles.upperContainerText}>{`${currentKcal}kcal`}</Text>
          </View>

          <View>
            <Text style={styles.upperContainerTitle}>目標体重まで</Text>
            <Text style={styles.upperContainerText}>5kg</Text>
          </View>
        </View>
        <Calendar 
          // onDayPress = {((day)=>{console.log(day.dateString,"day")})}
          onDayPress = {((day)=>{getWeight(day)})}
          
        />
        {/* ユーザーが初めてログインした際にエラー発生 
                labels: [],
              datasets: [{data:[0]},*/}
         {/* <LineChart 
            data = {{
               labels: weightLabels ,
                datasets: [{data:weightList
               },
               ] 
            }}
            formatYLabel={decimalPoint}
            yAxisSuffix=" kg"
            style={styles.lineChart} 
            width={400} height={200} 
            chartConfig={chartConfig}
            withInnerLines={false}
            withOuterLines={false}
        />  
         <LineChart 
            data = {{
               labels: kcalLabels,
               datasets: [{data:kcalList},
            ]}}
            formatYLabel={toInteger}
            yAxisSuffix="kcal"
            style={styles.lineChart} 
            width={400} height={200} 
            chartConfig={chartConfig}
            withInnerLines={false}
            withOuterLines={false}
            />  */}

        <TouchableHighlight style={styles.button} underlayColor="#C70F66"
          onPress={()=>props.navigation.navigate("TrainingMenu")}>
          <Text style={styles.buttonTitle}>今日のトレーニング
          </Text>
        </TouchableHighlight> 

        <TouchableHighlight style={styles.button} 
                            underlayColor="#C70F66"
          onPress={()=>props.navigation.navigate("FoodManagement",{foodData:foodData})}>
          <Text style={styles.buttonTitle}>今日の食事</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button} underlayColor="#C70F66"
          onPress={()=>props.navigation.navigate("WeightManagement")}>
        <Text style={styles.buttonTitle} >今日の体重</Text>
        </TouchableHighlight> 

      </View>
    ); 
  
}

export default HomeScreen