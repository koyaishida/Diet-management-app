import React from 'react';
import { StyleSheet, Text, View ,TouchableHighlight} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
  memoAdd:{
    position: "absolute",
    bottom: 32,
    right: 32,
    width: 48,
    height: 48,
    backgroundColor:"#E31676",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    zIndex: 1,
  },
  memoAddButton: {
    fontSize: 24,
    textAlign: "center",
    lineHeight: 48,
    color: "#fff"
  }
})

const CircleButton = (props) =>{
  const {style,color,onPress} = props 

  let bgColor = "#E31676";
  let textColor = "#fff";
  
  if (color === "white"){
    bgColor = "#fff";
    textColor = "#E31676";
  }
  
  let name = props.name

  return (
  <TouchableHighlight 　style={[styles.memoAdd,style,{backgroundColor: bgColor}]} onPress={onPress} underlayColor="transparent">
    <View>
      <Text　style={[styles.memoAddButton,{color: textColor}]}>
        <FontAwesome name={name} size={25}/>
      </Text>
    </View>
  </TouchableHighlight>
    
  )
}

export default CircleButton ;