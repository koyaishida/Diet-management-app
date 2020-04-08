import React from 'react';
import { StyleSheet, Text, View,TouchableHighlight,FlatList } from 'react-native';

const styles = StyleSheet.create({
  foodList: {
    width: "100%",
    flex: 1,
  },
  foodListItem: {
    padding: 16,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: '#fff',
  },
  kcalValue: {
    fontSize: 30,
    marginBottom: 4,
  },
  foodMemo: {
    fontSize: 30,
    marginBottom: 4,
    width: 200,
  },
  eatTime: {
    fontSize: 30,
  },
  inputLocation :{
    flexDirection : "row",
    justifyContent : "space-between"
  },
  unit :{
    fontSize : 28,
    marginTop :15,
  }
})




const  FoodList =(props)=> {
  const renderFood =({item})=> {
    return(
      <TouchableHighlight style={styles.foodList} onPress={()=>{props.navigation.navigate("FoodAdd",{food : item})}}>
        <View style={styles.foodListItem}>
          <View style={styles.inputLocation}>
            <Text style={styles.foodMemo}>{item.foodMemo}</Text>
            <Text style={styles.kcalValue}>{item.kcal}</Text>
            <Text style={styles.unit}>kcal</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
  return (
    <View style={styles.foodList}>
      <FlatList data={props.foodList} renderItem={renderFood.bind(this)}/>
    </View>
  )  
}


export default FoodList ;