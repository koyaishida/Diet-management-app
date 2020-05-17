import React,{useState} from 'react';
import { StyleSheet, Text, View,TouchableOpacity,FlatList } from 'react-native';
import firebase from "firebase"
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { FontAwesome } from '@expo/vector-icons';


const styles = StyleSheet.create({
  foodListContainer: {
    width: "100%",
    flex: 1,
  },
  listItemContainer: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: '#fff',
    height:50,
    flexDirection : "row",
    justifyContent : "space-around"
  },
  foodTitle: {
    fontSize: 20,
    width: "50%",
    lineHeight: 50,
    textAlign:"center"
  },
  kcal:{
    flexDirection:"row",

  },
  kcalValue: {
    fontSize: 20,
    lineHeight: 50,
  },
  unit :{
    fontSize : 16,
    lineHeight: 50,
    paddingLeft:5
  },
  leftAction:{
    backgroundColor:"red"
  },
  actionText:{
    fontSize:13,
    width:50,
    fontWeight:"bold",
    color:"#fff",
    textAlign:"center",
    lineHeight: 50,
  }
})




const  FoodList =(props)=> {
  const [deleteItemKey,setDeleteItemKey]=useState()

   const handleDelete = ()=>{
     const {currentUser} = firebase.auth();
     const db =firebase.firestore()

     db.collection(`users/${currentUser.uid}/food`).doc(`${deleteItemKey}`).delete()
     .then(function() {
       console.log("Document successfully deleted!");
       })
     .catch(function(error) {
       console.error("Error removing document: ", error);
     });
   }
  const renderRightActions = ()=>{
    return (
       <TouchableOpacity style={styles.leftAction} 
       onPress={handleDelete}>
         <Text style={styles.actionText}>
          <FontAwesome  name={"trash"} size={25}/>
         </Text> 
       </TouchableOpacity>
    );
  };
  const getKey = (item)=>{
    setDeleteItemKey(item.key)
  }
  const renderFood =({item})=> {
    return(
      <Swipeable renderRightActions={renderRightActions}
      onSwipeableOpen={()=>{getKey(item)}} >
          <TouchableOpacity style={styles.listItemContainer} onPress={()=>{props.navigation.navigate("FoodDetail",{foodData:item})}}>
            <Text style={styles.foodTitle}>{item.foodMemo}</Text>
            <View style={styles.kcal}>
              <Text style={styles.kcalValue}>{item.kcal}</Text>
              <Text style={styles.unit}>kcal</Text>
            </View>
          </TouchableOpacity>
      </Swipeable>
    )
  }
  return (
    <View style={styles.foodListContainer}>
      <FlatList data={props.currentFoodList} renderItem={renderFood.bind(this)}/>
    </View>
  )  
}


export default FoodList ;