import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {CurrencyProvider} from './src/store/CurrencyContext';
import ConverterScreen from './src/screens/ConverterScreen';
import RatesScreen from './src/screens/RatesScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import {Colors, Spacing} from './src/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <CurrencyProvider>
          <NavigationContainer
            theme={{
              dark: true,
              colors: {
                primary: Colors.primary,
                background: Colors.background,
                card: Colors.surfaceContainerLow,
                text: Colors.onSurface,
                border: Colors.border,
                notification: Colors.primary,
              },
              fonts: {
                regular: {fontFamily: 'System', fontWeight: '400'},
                medium: {fontFamily: 'System', fontWeight: '500'},
                bold: {fontFamily: 'System', fontWeight: '700'},
                heavy: {fontFamily: 'System', fontWeight: '900'},
              },
            }}>
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  backgroundColor: Colors.surfaceContainerLow,
                  borderTopColor: Colors.border,
                  borderTopWidth: 1,
                  paddingBottom: Spacing.xs,
                  height: 60,
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.onSurfaceVariant,
                tabBarLabelStyle: {
                  fontSize: 11,
                  fontWeight: '500',
                },
                tabBarIcon: () => null,
              }}>
              <Tab.Screen name="Converter" component={ConverterScreen} />
              <Tab.Screen name="Rates" component={RatesScreen} />
              <Tab.Screen name="Categories" component={CategoriesScreen} />
              <Tab.Screen name="History" component={HistoryScreen} />
              <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </CurrencyProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
