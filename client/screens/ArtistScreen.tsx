import { RouteProp } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useDispatch, connect } from "react-redux";
import { getSongByArtist } from "../services/songService";
import { RootStackParamList } from "../App";
import ControlBar from "../components/ControlBar";
import { RootState } from "../redux/store";
import {
  setDuration,
  setIsPlaying,
  setPlayer,
  setSongPlaying,
  setSongs,
  playSong,
  pauseSong,
} from "../redux/slices/songSlice";
import SongItem from "../components/SongItem";
import { API_URL } from "@env";

type ArtistScreenProps = {
  route: RouteProp<RootStackParamList, "ArtistScreen">;
};

type ReduxProps = ReturnType<typeof mapState> &
  typeof mapDispatch & {
    playSong: typeof playSong;
    pauseSong: typeof pauseSong;
  };

const ArtistScreen: React.FC<ArtistScreenProps & ReduxProps> = ({
  route,
  songs,
}) => {
  const { artistName, artistId } = route.params;
  const avatarUrl = `${API_URL}/api/songs/getavartar/?id=` + artistId;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await getSongByArtist(artistId);
        dispatch(setSongs(response));
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      }
    };

    fetchSongs();
  }, [artistId]);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatarUrl && (
          <Image style={styles.avatar} source={{ uri: avatarUrl }} />
        )}
        <Text style={styles.title}>{artistName}</Text>
      </View>
      <ScrollView>
        {songs.map((song) => (
          <SongItem item={song} />
        ))}
      </ScrollView>
      <ControlBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 16,
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    width: "100%",
    marginBottom: 50,
  },
  avatar: {
    width: 250,
    height: 250,
    resizeMode: "cover",
    marginBottom: 10,
  },
  songContainer: {
    marginBottom: 5,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  songGenre: {
    fontSize: 14,
    marginTop: 4,
  },
});

const mapState = (state: RootState) => ({
  songs: state.song.songs,
  player: state.song.player,
  isPlaying: state.song.isPlaying,
  duration: state.song.duration,
});

const mapDispatch = {
  setSongs,
  setPlayer,
  setIsPlaying,
  setDuration,
  setSongPlaying,
};

export default connect(mapState, mapDispatch)(ArtistScreen);
