import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Modal from "react-native-modal";
import axios from "axios";
import { API_URL } from "@env";
import { playSong } from "../redux/slices/songSlice";

interface PlaylistFloatingListProps {
  isVisible: boolean;
  onClose: () => void;
}

const PlaylistFloatingList: React.FC<PlaylistFloatingListProps> = ({
  isVisible,
  onClose,
}) => {
  const dispatch = useDispatch();
  const playlistSongIds = useSelector(
    (state: RootState) => state.song.playlist
  );

  const [playlist, setPlaylist] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlaylistSongs = async () => {
      try {
        const promises = playlistSongIds.map((songId) =>
          axios.get(`${API_URL}/api/songs/getsongbyid?id=${songId}`)
        );
        const resolvedPromises = await Promise.all(promises);
        const songsData = resolvedPromises.map((response) => response.data);
        setPlaylist(songsData);
      } catch (error) {
        console.error("Error fetching playlist songs:", error);
      }
    };

    fetchPlaylistSongs();
  }, [playlistSongIds]);

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.floatingListContainer}>
        {playlist.map((item) => (
          <TouchableOpacity
            style={styles.listItemContainer}
            onPress={() => {
              dispatch(playSong(item));
            }}
          >
            <Text style={styles.listItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  floatingListContainer: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
  },
  listItemText: {
    fontSize: 16,
    color: "black",
  },
  closeButton: {
    alignItems: "center",
    marginBottom: 16,
  },
  closeButtonText: {
    fontSize: 16,
    color: "blue",
  },
});

export default PlaylistFloatingList;
