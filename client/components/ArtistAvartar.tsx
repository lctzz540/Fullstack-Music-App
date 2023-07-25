import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { API_URL } from "@env";

interface ArtistAvatarProps {
  name: string;
  id: string;
}

const ArtistAvatar: React.FC<ArtistAvatarProps> = ({ name, id }) => {
  const avatarUrl = `${API_URL}/api/songs/getavartar/?id=` + id;
  const navigation = useNavigation();

  const handleClick = (id: string) => {
    navigation.navigate("Artist", { artistName: name, artistId: id });
  };

  return (
    <TouchableOpacity key={id} onPress={() => handleClick(id)}>
      <View style={styles.container}>
        <Image style={styles.avatar} source={{ uri: avatarUrl }} />
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default ArtistAvatar;
