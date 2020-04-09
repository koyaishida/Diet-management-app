import React from 'react';
import { StyleSheet, Text, View,TouchableHighlight,FlatList } from 'react-native';

const styles = StyleSheet.create({
  foodList: {
    width: "100%",
    flex: 1,
  },
  listContainer: {
    padding: 16,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: '#fff',
  },
  number: {
    fontSize: 24,
    marginBottom: 2,
    paddingLeft: 6,
    lineHeight: 50,
  },
  trainingMenu: {
    fontSize: 28,
    width: 160,
    lineHeight: 50,
  },
  trainingList :{
    flexDirection : "row",
    justifyContent : "space-between"
  },
  unit :{
    fontSize : 20,
    marginTop :15,
  }
})




const  TrainingList =(props)=> {

  const renderFood =({item})=> {
    return(
      <TouchableHighlight style={styles.foodList} onPress={()=>{props.navigation.navigate("FoodAdd",{food : item})}}>
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
      </TouchableHighlight>
    )
  }
  return (
    <View style={styles.foodList}>
      <FlatList data={props.trainingList} renderItem={renderFood.bind(this)}/>
    </View>
  )  
}


export default TrainingList ;