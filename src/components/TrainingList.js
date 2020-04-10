import React from 'react';
import { StyleSheet, Text, View,TouchableHighlight,FlatList } from 'react-native';

const styles = StyleSheet.create({
  trainingList: {
    width: "100%",
    flex: 1,
  },
  listContainer: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: '#fff', 
  },
  number: {
    fontSize: 18,
    lineHeight: 50,
  },
  trainingMenu: {
    fontSize: 20,
    width: 180,
    lineHeight: 50,
    textAlign: "center"
  },
  trainingList :{
    flexDirection : "row",
  },
  unit :{
    fontSize : 12,
    padding: 12,
    marginTop: 10,
  }
})




const  TrainingList =(props)=> {

  const renderTraining =({item})=> {
    return(
        <View style={styles.listContainer}>
          <View style={styles.trainingList}>
            <Text style={styles.trainingMenu}>{item.menuName}</Text>

            <Text style={styles.number}>{item.kg}</Text>
            <Text style={styles.unit}>kg</Text>

            <Text style={styles.number}>{item.reps}</Text>
            <Text style={styles.unit}>回</Text>

            <Text style={styles.number}>{item.setCount}</Text>
            <Text style={styles.unit}>セット</Text>
          </View>
        </View>
    )
  }
  return (
    <View style={styles.trainingList}>
      <FlatList data={props.trainingList} renderItem={renderTraining.bind(this)}/>
    </View>
  )  
}


export default TrainingList ;