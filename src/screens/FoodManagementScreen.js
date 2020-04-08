import React ,{useState,useEffect}from 'react';
import { StyleSheet, View,} from 'react-native';
import FoodList from "../components/FoodList"
import CircleButton from "../elements/CircleButton"



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFFDF6",
    width: "100%"
  },
  
});


const  FoodManagementScreen = (props)=> {
  console.log(props)
  dateToString = (date)=>{
    const str = date.toDate().toISOString();
    return str.split("T")[0]
  }
  const {foodData} = props.route.params
  
  const [foodList,setFoodList] = useState([])
  const [currentDay,setCurrentDay] = useState(new Date().toISOString().split("T")[0],)
  
  useEffect(()=>{
       const todayFoodList = foodData.filter((item,index,)=>{
         if (dateToString(item.date) === currentDay){
           return true
         }
       })
       const sortedFoodData = [...todayFoodList].sort((a,b)=>(a.date.seconds - b.date.seconds))
       setFoodList(sortedFoodData)
  },[])
    
  
  

 
    return (
      <View style={styles.container}>
          <FoodList 
            foodList={foodList}
            navigation={props.navigation}/>
        <CircleButton name={"plus"} onPress={()=>props.navigation.navigate("FoodAdd")}/>
      </View>
    ); 
  
}

export default FoodManagementScreen