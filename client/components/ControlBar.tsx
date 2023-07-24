import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setIsPlaying, setProgress } from "../redux/slices/songSlice";
import AddToLibraryButton from "./AddToLibraryButton";

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

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;
    if (isPlaying && progress < duration - 1) {
      progressInterval = setInterval(() => {
        const currentTime = progress + 1;
        dispatch(setProgress(currentTime));
      }, 1000);
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
    if (isPlaying && player) {
      player.pause();
      dispatch(setIsPlaying(false));
    } else {
      player && player.play();
      dispatch(setIsPlaying(true));
    }
  };
  return player ? (
    <View>
      <Text style={styles.songTitle}>{songTitle}</Text>
      <View style={styles.container}>
        <TouchableOpacity onPress={handlePlayPause}>
          <Text style={styles.playPauseButton}>
            {isPlaying ? (
              <AntDesign name="pause" size={24} color="blue" />
            ) : (
              <Feather name="play" size={24} color="blue" />
            )}
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
      </View>
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
