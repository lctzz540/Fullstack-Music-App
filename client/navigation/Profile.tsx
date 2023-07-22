import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Button, Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import ControlBar from "../components/ControlBar";
import { logout } from "../redux/actions/authActions";
import { AppDispatch, RootState } from "../redux/store";
import { getProfile } from "../services/authService";

interface Profile {
  label: string;
  value: string;
}

export const Profile: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [profile, setProfile] = useState<Profile[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (userId) {
          const profileData = await getProfile(userId);
          const profileItems: Profile[] = [
            { label: "Email:", value: profileData.Email },
            { label: "First name:", value: profileData.firstname },
            { label: "Last name:", value: profileData.lastname },
          ];
          setProfile(profileItems);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleLogout = () => {
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });

    console.log("Logged out");
  };

  const renderItem = ({ item }: { item: Profile }) => (
    <Text style={styles.profileText}>
      <Text style={styles.label}>{item.label}</Text> {item.value}
    </Text>
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Your Profile</Text>
        <FlatList
          data={profile}
          renderItem={renderItem}
          keyExtractor={(item) => item.label}
          showsHorizontalScrollIndicator={false}
        />
        <Button
          title="Logout"
          onPress={handleLogout}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>
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
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profileText: {
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "red",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  controlBarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
