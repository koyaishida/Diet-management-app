import React,{useState} from 'react';
import { StyleSheet, Text, View,TouchableHighlight,SectionList,SafeAreaView,TouchableOpacity } from 'react-native';
import firebase from "firebase"
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { FontAwesome } from '@expo/vector-icons';



const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  label: {
    fontSize: 20,
    color: "#fff",
    padding: 12,
    fontWeight: "bold",
    width: "90%",
  },
  item: {
    padding: 12,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: '#fff',
  },
  labelContainer: {
    display: "flex",
    flexDirection:"row",
    backgroundColor: "#007979",
    color: "#fff",
  },
  addMenu: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 38,
  },
  leftAction:{
    backgroundColor:"red"
  },
  actionText:{
    width:50,
    fontWeight:"bold",
    color:"#fff",
    textAlign:"center",
    lineHeight: 40,
  }
})


const array = ["胸","背中","肩","腕","腹","脚","その他"]
const sortedTrainingMenu = ((a,b)=>array.indexOf(a.part)-array.indexOf(b.part))
 
 const  TrainingMenuList =(props)=> {
   const [deleteMenu,setDeleteMenu]=useState()
   const [deleteArrayName,setDeleteArrayName]=useState()
   
   const {navigation} = props.navigation
   const {date} = props.navigation.route.params
   const DATA = props.trainingMenu.sort(sortedTrainingMenu)
   const id = props.id

   const handleDelete = ()=>{
    const {currentUser} = firebase.auth();
    const db =firebase.firestore()

      db.collection(`users/${currentUser.uid}/trainingMenu`).doc(id).update({
        [deleteArrayName] : firebase.firestore.FieldValue.arrayRemove(deleteMenu)
      })
     .then(()=> {
       navigation.navigate("TrainingMenu")
     })
     .catch((error)=>{
       console.error("Error adding document: ", error);
     });
  }

   const renderRightActions = ()=>{
    return (
       <TouchableHighlight style={styles.leftAction} 
       onPress={handleDelete}
       >
         <Text style={styles.actionText}>
          <FontAwesome  name={"trash"} size={28}/>
         </Text> 
       </TouchableHighlight>
      );
    };
  const getKey = (data,section)=>{
    setDeleteMenu(data)
    setDeleteArrayName(section.part)
  }


  const Item = ( {data, section} ) => (
    <Swipeable 
    renderRightActions={renderRightActions}
    onSwipeableOpen={()=>{getKey(data,section)}} >

      <TouchableOpacity  style={styles.item} 
      onPress={()=>navigation.navigate("TrainingMemo",{trainingMenu:data,part:section.part,date:date})}>
        <Text style={styles.title}>{data}</Text> 
      </TouchableOpacity>
    </Swipeable>
  );

   return(
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item,section }) => <Item data={item} section={section} />}

        renderSectionHeader={({ section: {part} }) => (
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{part}</Text>
            <TouchableOpacity onPress={()=>navigation.navigate("TrainingAdd",{part:part,id:id})}>
              <Text style={styles.addMenu}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      />
  </SafeAreaView>
   )
 }


export default TrainingMenuList ;