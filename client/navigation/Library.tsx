import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { useSelector } from "react-redux";
import ControlBar from "../components/ControlBar";
import SongItem from "../components/SongItem";
import { RootState } from "../redux/store";
import { getSongsInLibraryService } from "../services/songService";

export const Library: React.FC = () => {
  const userID = useSelector((state: RootState) => state.auth.user?.id || "");
  const [library, setLibrary] = useState<any[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSongsInLibraryService(userID);
        setLibrary(data);
      } catch (error) {
        console.error("Failed to fetch top songs:", error);
      }
    };

    fetchData();
  }, [isFocused]);

  const renderItem = ({ item }: { item: any }) => <SongItem item={item} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Library</Text>
      {!library ? (
        <Text style={styles.emptyText}>Your library is empty.</Text>
      ) : (
        <FlatList
          data={library}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      <View style={styles.controlBarContainer}>
        <ControlBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
  separator: {
    width: 10,
  },
  controlBarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
