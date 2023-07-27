import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import ControlBar from "../components/ControlBar";
import { logout } from "../redux/actions/authActions";
import { AppDispatch, RootState } from "../redux/store";
import { getProfile, updateProfile } from "../services/authService";
import { useIsFocused, useNavigation } from "@react-navigation/native";

interface Profile {
  label: string;
  value: string;
}

export const Profile: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [profile, setProfile] = useState<Profile[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

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
  }, [userId, isFocused]);

  const handleLogout = () => {
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleUpdateProfile = async () => {
    try {
      if (userId) {
        await updateProfile(userId, firstName, lastName);
      }

      const profileData = await getProfile(userId);
      const profileItems: Profile[] = [
        { label: "Email:", value: profileData.Email },
        { label: "First name:", value: profileData.firstname },
        { label: "Last name:", value: profileData.lastname },
      ];
      setProfile(profileItems);

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const renderItem = ({ item }: { item: Profile }) => (
    <Text style={styles.profileText}>
      <Text style={styles.label}>{item.label}</Text> {item.value}
    </Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      {isEditing ? (
        <>
          <Input
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            containerStyle={styles.inputContainer}
          />
          <Input
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            containerStyle={styles.inputContainer}
          />
          <Button
            title="Save"
            onPress={handleUpdateProfile}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />
          <Button
            title="Cancel"
            onPress={() => setIsEditing(false)}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.cancelButton}
            titleStyle={styles.buttonText}
          />
        </>
      ) : (
        <>
          <FlatList
            data={profile}
            renderItem={renderItem}
            keyExtractor={(item) => item.label}
            showsHorizontalScrollIndicator={false}
          />
          <View style={{ flex: 1 }}>
            <Button
              title="Update Profile"
              onPress={() => setIsEditing(true)}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.button}
              titleStyle={styles.buttonText}
            />
            <Button
              title="Logout"
              onPress={handleLogout}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.button}
              titleStyle={styles.buttonText}
            />
          </View>
        </>
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
  inputContainer: {
    marginBottom: 20,
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
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "gray",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
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
