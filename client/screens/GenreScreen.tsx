import { RouteProp } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, connect } from "react-redux";
import { getSongByGenre } from "../services/songService";
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

type GenreScreenProps = {
  route: RouteProp<RootStackParamList, "GenreScreen">;
};

type ReduxProps = ReturnType<typeof mapState> &
  typeof mapDispatch & {
    playSong: typeof playSong;
    pauseSong: typeof pauseSong;
  };

const GenreScreen: React.FC<GenreScreenProps & ReduxProps> = ({
  route,
  songs,
}) => {
  const { genre } = route.params;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await getSongByGenre(genre);
        dispatch(setSongs(response));
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      }
    };

    fetchSongs();
  }, [genre]);

  return (
    <View style={styles.container}>
      <View style={styles.reccontainer}>
        <View style={styles.rectangle}>
          <Text style={styles.rectitle}>{genre}</Text>
        </View>
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
  reccontainer: {
    width: "100%",
    aspectRatio: 3 / 1,
    marginVertical: 10,
  },
  rectangle: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "gray",
    padding: 10,
  },
  rectitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
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

export default connect(mapState, mapDispatch)(GenreScreen);
