import React from "react";
import { Text, Image, TouchableOpacity, StyleSheet, View } from "react-native";
import AddToLibraryButton from "./AddToLibraryButton";
import { API_URL } from "@env";
import { useDispatch } from "react-redux";
import { addSongToPlaylist, playSong } from "../redux/slices/songSlice";
import { AntDesign } from "@expo/vector-icons";

interface SongItemProps {
  item: any;
}

const SongItem: React.FC<SongItemProps> = ({ item }) => {
  const dispatch = useDispatch();

  const handlePlaySong = () => {
    dispatch(playSong(item));
    dispatch(addSongToPlaylist(item.id));
  };
  const handleAddToPlaylist = () => {
    dispatch(addSongToPlaylist(item.id));
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
      <View style={styles.buttonsContainer}>
        <AddToLibraryButton songID={item.id} />
        <TouchableOpacity onPress={handleAddToPlaylist}>
          <AntDesign name="pluscircleo" size={20} color="black" />
        </TouchableOpacity>
      </View>
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
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default SongItem;
