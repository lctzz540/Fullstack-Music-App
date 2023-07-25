import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  addToLibraryService,
  removeFromLibraryService,
} from "../services/authService";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import { API_URL } from "@env";

interface AddToLibraryButtonProps {
  songID: string;
}

const AddToLibraryButton: React.FC<AddToLibraryButtonProps> = ({ songID }) => {
  const [isInLibrary, setIsInLibrary] = useState(false);
  const userID = useSelector((state: RootState) => state.auth.user?.id || "");
  const isFocused = useIsFocused();

  useEffect(() => {
    const checkSongInLibrary = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/auth/checksonginlibrary?userID=${userID}&songID=${songID}`
        );
        setIsInLibrary(response.data.success);
      } catch (error) {
        console.error("Failed to check song in library:", error);
      }
    };

    checkSongInLibrary();
  }, [songID, userID, isFocused]);

  const handleAddToLibrary = async () => {
    try {
      if (isInLibrary) {
        await removeFromLibraryService({ userID, songID });
      } else {
        await addToLibraryService({ userID, songID });
      }
      setIsInLibrary(!isInLibrary);
    } catch (error) {
      console.error("Failed to add/remove song to/from library:", error);
    }
  };

  return (
    <TouchableOpacity onPress={handleAddToLibrary}>
      {isInLibrary ? (
        <Ionicons name="heart" size={24} color="red" />
      ) : (
        <Ionicons name="heart-outline" size={24} color="black" />
      )}
    </TouchableOpacity>
  );
};

export default AddToLibraryButton;
