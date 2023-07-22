import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import ArtistAvatar from "../components/ArtistAvartar";
import Genre from "../components/Genre";
import ControlBar from "../components/ControlBar";
import SearchBar from "../components/SearchBar";
import TopSongs from "../components/TopSongs";
import { getAllArtists } from "../services/songService";

interface Artist {
  name: string;
  id: string;
}

interface GenreData {
  color: string;
  text: string;
}

export const Explore: React.FC = () => {
  const [artistList, setArtistList] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artists = await getAllArtists();
        setArtistList(artists);
      } catch (error) {
        console.error("Failed to fetch artists:", error);
      }
    };

    fetchArtists();
  }, []);

  const genres: GenreData[] = [
    { color: "darkred", text: "VPOP" },
    { color: "gray", text: "ROCK" },
  ];

  const renderItem = ({ item }: { item: Artist }) => (
    <ArtistAvatar name={item.name} id={item.id} />
  );

  const renderGenre = ({ item }: { item: GenreData }) => (
    <Genre color={item.color} text={item.text} />
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <SearchBar />
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.title}>Artist</Text>
          <FlatList
            data={artistList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={renderSeparator}
            contentContainerStyle={styles.flatListContent}
          />
          <Text style={styles.title}>Genre</Text>
          <FlatList
            data={genres}
            renderItem={renderGenre}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={renderSeparator}
            contentContainerStyle={styles.flatListContent}
          />
          <Text style={styles.title}>Top song</Text>
          <TopSongs />
        </View>
      </ScrollView>
      <View style={styles.controlBarContainer}>
        <ControlBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    height: "100%",
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  separator: {
    width: 10,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  controlBarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
