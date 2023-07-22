import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import { Home } from "./screens/Home";
import { LoginScreen } from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ArtistScreen from "./screens/ArtistScreen";
import { PersistGate } from "redux-persist/integration/react";
import GenreScreen from "./screens/GenreScreen";

export type RootStackParamList = {
  Login: undefined;
  Music: undefined;
  Signup: undefined;
  Artist: {
    artistName: string;
    artistId: string;
  };
  Genre: {
    genre: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Music" component={Home} />
            <Stack.Screen name="Artist" component={ArtistScreen} />
            <Stack.Screen name="Genre" component={GenreScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
