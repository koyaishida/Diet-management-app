import React ,{useState,useEffect}from 'react';
import { StyleSheet, View, Text,TouchableOpacity,Dimensions} from 'react-native';
import firebase from "firebase"
import {LineChart} from "react-native-chart-kit"
import CircleButton from "../elements/CircleButton"
import { FontAwesome } from '@expo/vector-icons';


const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#FFFDF6",
    width: "100%",
  },
  upperContainer :{
    flexDirection: "row",
     padding:10,
    paddingRight:30,
  },
  upperLeft:{
    width:"50%",
  },
  upperContainerTitle : {
    fontSize: 18,
    alignSelf: "flex-end"
  },
  upperContainerText : {
    fontSize: 22,
    alignSelf: "flex-end"
  },
  button: {
    backgroundColor: "green",
    height: screenHeight/20,
    borderRadius: 14,
    justifyContent: "center",
    alignItems:"center",
    width: "75%",
    alignSelf: "center",
    marginTop: 10,
  },
  buttonTitle: {
    fontSize:20,
    color: "#fff",
  },
  arrowContainer:{
    flexDirection:"row",
    justifyContent:"space-around",
    backgroundColor:"#FFF",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius:2,
    zIndex:-1,
    elevation:1
  },
  chartArrow:{
    flexDirection:"row",
    margin:5,
  },
  chartTitle:{
    fontSize:18,
    width:"90%",
    alignSelf: "center",
    padding:5,
  },
  chartTitleValue:{
    fontSize:22,
  }
});

const chartConfig = {
  backgroundColor: "#FFF",
  backgroundGradientFrom: "#FFF",
  backgroundGradientTo: "#FFF",
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

const older = ((a,b)=>(a.date.seconds - b.date.seconds))


const HomeScreen = (props)=> {
  const [weightData,setWeightData] = useState([])
  const [weightLabels,setWeightLabels] = useState([])
  const [weightList,setWeightList] = useState([0])
  const [foodData,setFoodData] = useState([])
  const [kcalList,setKcalList] = useState([0])
  const [currentKcal,setCurrentKcal] = useState([])
  const [kcalLabels,setKcalLabels] = useState([])
  const [currentDay,setCurrentDay] = useState(new Date().toISOString().split("T")[0],)
  const [requiredKcal,setRequiredKcal] = useState([])
  const [targetWeight,setTargetWeight] = useState([])
  const [amountDisplay,setAmountDisplay] = useState(7)
  

  const displayChart =(data)=>{
    if(data.length > amountDisplay){
      return data.slice(data.length-amountDisplay,data.length-amountDisplay+7)
    }else if(data.length <= 7){
       return data 
    }else if(data.length <= amountDisplay){
      return data.slice(data.length-data.length,data.length-data.length+7)
    }
  }

  const prevChart =()=>{
    if(weightLabels.length < amountDisplay || kcalLabels.length < amountDisplay){
      return
    }else{
      setAmountDisplay(amountDisplay+7)
    }
  }

  const nextChart =()=>{
    if(amountDisplay == 7){
      return
    }else{
      setAmountDisplay(amountDisplay-7)
    }
  }
  
  
     
  useEffect (()=>{
    console.log("render")
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

      //体重の値の取得
      const weightList =[]
      const sortedWeightData = [...weightData].sort(older)

      sortedWeightData.forEach((item)=>{
        weightList.push(parseFloat(item.weight))
      })
      //折れ線グラフエラー回避の為
      if(weightList.length == 0){
        setWeightList([0])
      }else{
        setWeightList(displayChart(weightList))
      }

      //体重のラベルの取得
      const weightLabels = [];
      
      sortedWeightData.forEach((a)=>{
        weightLabels.push(dateToString(a.date).slice(5))
      })
      setWeightLabels(displayChart(weightLabels))
    })

    //firebaseから食事データを取得
    db.collection(`users/${currentUser.uid}/food`)
    .onSnapshot((querySnapshot)=>{
      const foodData =[];
      querySnapshot.forEach((doc)=>{
        foodData.push({...doc.data(),key: doc.id})
        })
      setFoodData(foodData)
    
      //kcalの加工
      const kcalList =[]
      const sortedKcalData = [...foodData].sort(older)

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

      if(kcalList.length == 0){
        setKcalList([0])
      }else{
        setKcalList(displayChart(kcalList))
      }  
      


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
      setKcalLabels(displayChart(kcalLabels))

      if(kcalLabels[kcalLabels.length-1] !== currentDay.slice(5)){
        setCurrentKcal(0)
      }else{
        setCurrentKcal(kcalList[kcalList.length-1])
      }
    })

  
    db.collection(`users/${currentUser.uid}/personalData`)
    .onSnapshot((querySnapshot)=>{
      const personalData = []
      querySnapshot.forEach((doc)=>{
        personalData.push({...doc.data(),key: doc.id})
      })
      setRequiredKcal(personalData[0].requiredKcal)
      setTargetWeight(personalData[0].targetWeight)
    })
    return () => {console.log('Clean Up ')};
  },[amountDisplay])
  
        
  
  return (
    <View style={styles.container}>
      <View style={{backgroundColor:"#fff"}}>
      <Text style={styles.chartTitle}>目標体重まであと
        <Text style={styles.chartTitleValue}> {`${Math.round((weightList[weightList.length-1]-targetWeight)*10)/10}`}</Text> 
        kg
      </Text>
      </View>
      <LineChart 
        data = {{
          labels: weightLabels,
          datasets: [{data:weightList}]
        }}
        formatYLabel={decimalPoint}
        yAxisSuffix=" kg"
        style={styles.lineChart} 
        width={screenWidth} height={screenHeight/4.2} 
        chartConfig={chartConfig}
        withInnerLines={false}
        withOuterLines={false}
      />
      <View style={{backgroundColor:"#fff"}}>
      <Text style={styles.chartTitle}>必要摂取カロリーまであと
        <Text style={styles.chartTitleValue}> {`${requiredKcal-currentKcal}`}</Text>
        kcal
      </Text>
      </View>
      
      <LineChart 
        data = {{
          labels: kcalLabels,
          datasets: [{data:kcalList}]
        }}
        formatYLabel={toInteger}
        yAxisSuffix="kcal"
        style={styles.lineChart} 
        width={screenWidth} height={screenHeight/4.2} 
        chartConfig={chartConfig}
        withInnerLines={false}
        withOuterLines={false}
      />
      
      <View style={styles.arrowContainer}>
        <TouchableOpacity onPress={prevChart} activeOpacity={0.5}>
          <View style={styles.chartArrow}>
            <Text>
              <FontAwesome name={"angle-double-left"} size={20}/>
            </Text>
            <Text style={{fontSize:18,marginLeft:5,}}>BACK</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextChart} activeOpacity={0.5}> 
          <View style={styles.chartArrow}>
            <Text style={{fontSize:18,marginRight:5,}}>NEXT</Text>
            <Text>
              <FontAwesome name={"angle-double-right"} size={20}/>
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{marginTop:20}}>
        <TouchableOpacity style={styles.button} activeOpacity={0.5}
          onPress={()=>props.navigation.navigate("TrainingManagement")}>
          <Text style={styles.buttonTitle}>トレーニング管理
          </Text>
        </TouchableOpacity> 

        <TouchableOpacity style={styles.button} activeOpacity={0.5}
          onPress={()=>props.navigation.navigate("FoodManagement")}>
          <Text style={styles.buttonTitle}>食事管理</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} activeOpacity={0.5}
          onPress={()=>props.navigation.navigate("WeightManagement")}>
        <Text style={styles.buttonTitle} >体重管理</Text>
        </TouchableOpacity>
      </View>
      <CircleButton name={"cog"} onPress={()=>props.navigation.navigate("PersonalData")} display={false}/>
    </View>
  ); 
}

export default HomeScreen