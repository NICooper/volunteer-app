import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PaperExpoNavBar } from '@/src/components/paper-expo-nav-bar';

export default function OrgTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <PaperExpoNavBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name='(suggestions)'

        options={{
          title: 'Suggestions',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='star-circle' color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name='(search)'
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='magnify' color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name='(community)'
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='account-group' color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name='(profile)'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            < MaterialCommunityIcons name='account' color={color} size={26} />
          ),
        }}
      />
    </Tabs>
  );
}
