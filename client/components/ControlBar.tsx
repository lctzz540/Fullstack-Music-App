import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  playSong,
  setIsPlaying,
  setProgress,
  shufflePlaylist,
} from "../redux/slices/songSlice";
import AddToLibraryButton from "./AddToLibraryButton";
import PlaylistFloatingList from "./PlaylistFloatingList";
import axios from "axios";
import { API_URL } from "@env";
import { SongResponse } from "../services/songService";

const ControlBar: React.FC = () => {
  const dispatch = useDispatch();
  const songTitle = useSelector(
    (state: RootState) => state.song.songPlaying?.title
  );
  const player = useSelector((state: RootState) => state.song.player);
  const isPlaying = useSelector((state: RootState) => state.song.isPlaying);
  const duration = useSelector((state: RootState) => state.song.duration);
  const progress = useSelector((state: RootState) => state.song.progress);
  const songID = useSelector((state: RootState) => state.song.songPlaying?.id);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const playlistSongIds = useSelector(
    (state: RootState) => state.song.playlist
  );

  const handleControlBarPress = () => {
    setShowPlaylist(!showPlaylist);
  };
  const playNextSong = () => {
    const currentIndex = playlistSongIds.findIndex((Id) => Id === songID);
    if (currentIndex >= 0 && currentIndex < playlistSongIds.length - 1) {
      const nextSongId = playlistSongIds[currentIndex + 1];
      axios
        .get(`${API_URL}/api/songs/getsongbyid?id=${nextSongId}`)
        .then((response: any) => {
          const nextSong: SongResponse = response.data;
          dispatch(playSong(nextSong));
        })
        .catch((error: Error) => {
          console.error("Failed to fetch the next song:", error);
        });
    }
  };

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;
    if (isPlaying && progress < Math.floor(duration)) {
      progressInterval = setInterval(() => {
        const currentTime = progress + 1;
        dispatch(setProgress(currentTime));
      }, 1000);
    } else {
      if (progress == Math.floor(duration)) {
        playNextSong();
      }
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isPlaying, progress]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pause();
        dispatch(setIsPlaying(false));
      } else {
        player.play();
        dispatch(setIsPlaying(true));
      }
    }
  };
  const handlePlayback = () => {
    if (player && progress > 5) {
      player.prepare();
      player.play();
      dispatch(setProgress(0));
    } else if (player) {
      const currentIndex = playlistSongIds.findIndex((Id) => Id === songID);
      if (currentIndex >= 0 && currentIndex > 0) {
        const previousSongId = playlistSongIds[currentIndex - 1];
        axios
          .get(`${API_URL}/api/songs/getsongbyid?id=${previousSongId}`)
          .then((response: any) => {
            const previousSong: SongResponse = response.data;
            dispatch(playSong(previousSong));
          })
          .catch((error: Error) => {
            console.error("Failed to fetch the next song:", error);
          });
      }
    }
  };
  return player ? (
    <View>
      <TouchableOpacity onPress={handleControlBarPress}>
        <Text style={styles.songTitle}>{songTitle}</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <TouchableOpacity onPress={handlePlayback}>
          <Text style={styles.playPauseButton}>
            <AntDesign name="banckward" size={20} color="blue" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePlayPause}>
          <Text style={styles.playPauseButton}>
            {isPlaying ? (
              <AntDesign name="pause" size={24} color="blue" />
            ) : (
              <Feather name="play" size={24} color="blue" />
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={playNextSong}>
          <Text style={styles.playPauseButton}>
            <AntDesign name="forward" size={20} color="blue" />
          </Text>
        </TouchableOpacity>

        <Text style={styles.progressText}>{formatTime(progress)}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: (progress / duration) * 100 + "%" },
              ]}
            />
          </View>
        </View>
        <Text style={styles.progressText}>{formatTime(duration)}</Text>
        {songID && <AddToLibraryButton songID={songID} />}
        <TouchableOpacity onPress={() => dispatch(shufflePlaylist())}>
          <AntDesign name="retweet" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {showPlaylist && (
        <PlaylistFloatingList
          isVisible={showPlaylist}
          onClose={() => setShowPlaylist(false)}
        />
      )}
    </View>
  ) : (
    <></>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "relative",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f9f9f9",
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#555",
    paddingTop: 5,
    backgroundColor: "#f9f9f9",
  },
  playPauseButton: {
    fontSize: 18,
    marginRight: 10,
    fontWeight: "bold",
    color: "#007AFF",
  },
  progressContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    marginRight: 16,
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: "#ccc",
  },
  progressFill: {
    height: 2,
    backgroundColor: "#007AFF",
  },
  progressTextContainer: {
    flexDirection: "row",
  },
  progressText: {
    fontSize: 14,
    color: "#555",
    marginRight: 5,
    marginLeft: 5,
  },
});

export default ControlBar;
