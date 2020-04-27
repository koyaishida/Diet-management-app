import React from 'react';
import { StyleSheet, Text, View,TouchableHighlight,SectionList,SafeAreaView,TouchableOpacity } from 'react-native';


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
    backgroundColor: 'green',
    color: "#fff",
  },
  addMenu: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 38,
  }
})
const array = ["胸","背中","肩","腕","脚","その他"]
const sortedTraining = ((a,b)=>array.indexOf(a.title)-array.indexOf(b.title))
 
 const  TrainingMenuList =(props)=> {
   const {navigation} = props.navigation
   const DATA = props.trainingMenu
   DATA.sort(sortedTraining)
   
   
   const Item = ( {data, section} ) => (
    <TouchableHighlight style={styles.item} 
    // onPress={()=>console.log(data,"data",section,"sec")}
    onPress={()=>navigation.navigate("TrainingMemo",{trainingMenu:data,part:section.title})}
    >
        <Text style={styles.title}>{data}</Text> 
    </TouchableHighlight>
  );

   return(
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item,section }) => <Item data={item} section={section} />}

        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{title}</Text>
            <TouchableOpacity onPress={()=>navigation.navigate("TrainingAdd",{trainingMenu: title,id:props.id})}>
            <Text style={styles.addMenu}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      />
  </SafeAreaView>
   )
 }


export default TrainingMenuList ;