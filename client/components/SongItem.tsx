import React from "react";
import { Text, Image, TouchableOpacity, StyleSheet, View } from "react-native";
import useSongPlayer from "../hooks/useSongPlayer";
import AddToLibraryButton from "./AddToLibraryButton";
import { API_URL } from "@env";

interface SongItemProps {
  item: any;
}

const SongItem: React.FC<SongItemProps> = ({ item }) => {
  const playSong = useSongPlayer();

  const handlePlaySong = () => {
    playSong(item);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePlaySong} style={styles.songContainer}>
        <Image
          source={{
            uri: `${API_URL}/api/songs/getsongimage?id=` + item.id,
          }}
          style={styles.avatar}
        />
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
      <AddToLibraryButton songID={item.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  songContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    marginLeft: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export default SongItem;
