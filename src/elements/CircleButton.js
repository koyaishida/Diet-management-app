import React from 'react';
import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container:{
    position: "absolute",
    bottom: 32,
    right: 18,
    width: 48,
    height: 48,
    backgroundColor:"#E31676",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    zIndex: 1,
    elevation:4,
  },
  innerText: {
    fontSize: 24,
    textAlign: "center",
    lineHeight: 48,
    color: "#fff"
  }
})

const CircleButton = (props) =>{
  const {style,color,onPress,disabled} = props 

  let bgColor = "#E31676";
  let textColor = "#fff";
  
  if (color === "white"){
    bgColor = "#fff";
    textColor = "#E31676";
  }
  
  let name = props.name

  return (
  <TouchableOpacity style={[styles.container,style,{backgroundColor: bgColor}]} onPress={onPress} activeOpacity={0.5} disabled={disabled}>
    <View>
      <Text style={[styles.innerText,{color: textColor}]}>
        <FontAwesome name={name} size={25}/>
      </Text>
    </View>
  </TouchableOpacity>
    
  )
}

export default CircleButton ;