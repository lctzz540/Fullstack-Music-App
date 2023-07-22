import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Explore } from "../navigation/Explore";
import { Library } from "../navigation/Library";
import { Profile } from "../navigation/Profile";

const Tab = createBottomTabNavigator();

export const Home = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Explore") {
              iconName = focused ? "musical-notes" : "musical-notes-outline";
            } else if (route.name === "Library") {
              iconName = focused ? "library" : "library-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }
            if (iconName) {
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          },
          activeTintColor: "blue",
          inactiveTintColor: "black",
        })}
      >
        <Tab.Screen
          name="Explore"
          component={Explore}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Library"
          component={Library}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </>
  );
};
