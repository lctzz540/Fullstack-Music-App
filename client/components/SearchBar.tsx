import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  Button,
  FlatList,
  Text,
  Image,
} from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import useSongPlayer from "../hooks/useSongPlayer";
import axios from "axios";
import { SongResponse } from "../services/songService";
import { API_URL } from "@env";

const SearchBar = () => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [clicked, setClicked] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<SongResponse[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const apiResponse = await axios.get(
        `{API_URL}/api/songs?title=` + searchPhrase
      );
      const data = await apiResponse.data;
      setSearchData(data);
    };
    getData();
  }, [searchPhrase]);

  const handleInputChange = (text: string) => {
    setSearchPhrase(text);
  };
  const playSong = useSongPlayer();

  const handleSuggestionClick = (suggestion: SongResponse) => {
    playSong(suggestion);
    setClicked(false);
    setSearchPhrase("");
    setSuggestions([]);
  };

  useEffect(() => {
    if (searchPhrase && clicked) {
      if (searchData) {
        const filteredSuggestions = searchData.filter((item) =>
          item.title.toLowerCase().includes(searchPhrase.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
      }
    } else {
      setSuggestions([]);
    }
  }, [searchPhrase, searchData, clicked]);
  return (
    <View style={styles.container}>
      <View
        style={
          clicked ? styles.searchBar__clicked : styles.searchBar__unclicked
        }
      >
        <Feather
          name="search"
          size={20}
          color="black"
          style={{ marginLeft: 1 }}
        />
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchPhrase}
          onChangeText={handleInputChange}
          onFocus={() => {
            setClicked(true);
          }}
        />
        {clicked && (
          <Entypo
            name="cross"
            size={20}
            color="black"
            style={{ padding: 1 }}
            onPress={() => {
              setSearchPhrase("");
            }}
          />
        )}
      </View>
      {clicked && (
        <View>
          <Button
            title="Cancel"
            onPress={() => {
              Keyboard.dismiss();
              setClicked(false);
            }}
          />
        </View>
      )}
      {clicked && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            renderItem={({ item }) => (
              <View style={styles.suggestionItemContainer}>
                <Image
                  source={{
                    uri:
                      "http://localhost:3000/api/songs/getsongimage?id=" +
                      item.id,
                  }}
                  style={styles.avatar}
                />
                <Text
                  onPress={() => handleSuggestionClick(item)}
                  style={styles.suggestionItem}
                >
                  {item.title}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.ID}
          />
        </View>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    position: "relative",
    zIndex: 1,
  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    width: "80%",
    maxHeight: 200,
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "lightgray",
    zIndex: 1,
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  avatar: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  suggestionItemContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
});
