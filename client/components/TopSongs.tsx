import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import SongItem from "./SongItem";
import { getAllSongs } from "../services/songService";

const TopSongs = () => {
  const [topSongs, setTopSongs] = useState<any[]>([]);
  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      const data = await getAllSongs();
      setTopSongs(data);
    } catch (error) {
      console.error("Failed to fetch top songs:", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const renderItem = ({ item }: { item: any }) => <SongItem item={item} />;

  return (
    <View style={styles.container}>
      <FlatList data={topSongs} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});

export default TopSongs;
