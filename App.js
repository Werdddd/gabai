import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from './src/screens/Landing';
import LoginScreen from './src/screens/Login';
import SignUpScreen from './src/screens/SignUp';
import HomeScreen from './src/screens/Home';
import Upload from './src/screens/Upload';
import Flashcards from './src/screens/Flashcards';
import ProfileScreen from './src/screens/ProfileScreen';
import ModeSelect from './src/screens/ModeSelect';
import Overview from './src/screens/Overview';
import Start from './src/screens/Start';
import Quiz from './src/screens/Quiz';
import Summary from './src/screens/Summary';


import QRCodeScanner from './src/screens/QRCodeScanner';

import { TimerProvider } from './src/components/TimerContext';
import { GlobalProvider } from './src/components/GlobalState';


import Candle from './src/screens/Candle';
import { TimerProvider } from './src/components/TimerContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GlobalProvider>
    <TimerProvider>

      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          {/* Change this for testing new routes */}
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Upload" component={Upload} options={{ headerShown: false }} />
            <Stack.Screen name="ModeSelect" component={ModeSelect} options={{ headerShown: false }} />
            <Stack.Screen name="Flashcards" component={Flashcards} options={{ headerShown: false }} />
            <Stack.Screen name="Overview" component={Overview} options={{ headerShown: false }} />
            <Stack.Screen name="Quiz" component={Quiz} />
            <Stack.Screen name="Summary" component={Summary} />
            <Stack.Screen name="Candle" component={Candle} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>



    
    </TimerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});