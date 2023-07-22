import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface GenreProps {
  color: string;
  text: string;
}

const Genre: React.FC<GenreProps> = ({ color, text }) => {
  const navigation = useNavigation();

  const handleClick = (genre: string) => {
    navigation.navigate("Genre", { genre: genre });
  };
  return (
    <TouchableOpacity key={text} onPress={() => handleClick(text)}>
      <View style={[styles.container, { backgroundColor: color }]}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Genre;
