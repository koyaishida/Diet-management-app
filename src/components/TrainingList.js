import React ,{useState}from 'react';
import { StyleSheet, Text, View,FlatList,TouchableHighlight } from 'react-native';
import firebase from "firebase"
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
  trainingListContainer: {
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
  },
  rightContainer:{
    flexDirection : "row",
    justifyContent:"space-around",
    width: "50%",
  },
  number: {
    fontSize: 14,
    lineHeight: 50,
  },
  trainingMenu: {
    fontSize: 16,
    width: "50%",
    lineHeight: 50,
    textAlign: "center"
  },
  value:{
    flexDirection:"row",

  },
  unit :{
    fontSize : 12,
    lineHeight: 60,
    paddingLeft:3,
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




const  TrainingList =(props)=> {
  const [deleteItemKey,setDeleteItemKey]=useState()

   const handleDelete = ()=>{
     const {currentUser} = firebase.auth();
     const db =firebase.firestore()

     db.collection(`users/${currentUser.uid}/trainingMemoList`).doc(`${deleteItemKey}`).delete()
     .then(function() {
       console.log("Document successfully deleted!");
       })
     .catch(function(error) {
       console.error("Error removing document: ", error);
     });
   }
  const renderRightActions = ()=>{
    return (
       <TouchableHighlight style={styles.leftAction} 
       onPress={handleDelete}
       >
         <Text style={styles.actionText}>
          <FontAwesome  name={"trash"} size={25}/>
         </Text> 
       </TouchableHighlight>
    );
  };
  const getKey = (item)=>{
    setDeleteItemKey(item.key)
  }
  
  

  const renderTraining =({item})=> {
    return(
        <Swipeable renderRightActions={renderRightActions}
        onSwipeableOpen={()=>{getKey(item)}}
        >
          <View  style={styles.listItemContainer} >
              <Text style={styles.trainingMenu}>{item.menuName}</Text>
              <View style={styles.rightContainer}>
                <View style={styles.value}>
                  <Text style={styles.number}>{item.kg}</Text>
    <Text style={styles.unit}>{item.part === "有酸素"?'分':"kg" }</Text>
                </View>
                <View style={styles.value}>
                  <Text style={styles.number}>{item.reps}</Text>
                  <Text style={styles.unit}>{item.part === "有酸素"?'km':"回" }</Text>
                </View>
                <View style={styles.value}>
                  <Text style={styles.number}>{item.setCount}</Text>
    <Text style={styles.unit}>{item.part === "有酸素"?'度(傾斜)':"セット" }</Text>
                </View>
              </View>
          </View> 
        </Swipeable>
    )
  }
  return (
    <View style={styles.trainingListContainer}>
      <FlatList data={props.trainingList} renderItem={renderTraining.bind(this)}/>
    </View>
  )  
}


export default TrainingList ;