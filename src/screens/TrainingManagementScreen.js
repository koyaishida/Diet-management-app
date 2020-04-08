import React ,{useState,useEffect}from 'react';
import { StyleSheet, View,} from 'react-native';
import FoodList from "../components/FoodList"
import CircleButton from "../elements/CircleButton"
import firebase from "firebase"



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

const  WorkOutManagementScreen = (props)=> {
  const [foodList,setFoodList] = useState([])
  const [workOut,setWorkOut] = useState([])
  const [weight,setWeight] = useState()
  const [currentDay,setCurrentDay] = useState(new Date().toISOString().split("T")[0],)
  const {foodData} = props.route.params
  useEffect(()=>{

    const {currentUser} = firebase.auth();
    const db =firebase.firestore()
    db.collection(`users/${currentUser.uid}/trainingMenu`)
     .onSnapshot((querySnapshot)=>{
       querySnapshot.forEach((doc)=>{
         console.log(doc.data(),"training")
       })
     })
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

export default WorkOutManagementScreen