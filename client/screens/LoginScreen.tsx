import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { login } from "../redux/actions/authActions";
import { AppDispatch, RootState } from "../redux/store";

export type LoginScreenProps = {
  navigation: any;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const id = useSelector((state: RootState) => state.auth.user?.id);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    await dispatch(login(email, password));
    if (id) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Music" }],
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: `User ID: ${id}`,
      });
    }
  };

  const handleSignUp = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Toast />
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />
      <View style={styles.container}>
        <Text>Don't have an account?</Text>
        <Button title="Sign up" onPress={handleSignUp} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 70,
  },
});

export default LoginScreen;
