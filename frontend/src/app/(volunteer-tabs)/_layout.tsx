import { PaperExpoNavBar } from '@/src/components/paper-expo-nav-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function VolunteerTabLayout() {
  return (
    <Tabs
      tabBar={(props) => <PaperExpoNavBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Suggested',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='home' color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='cog' color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name='community'
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='cog' color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='cog' color={color} size={26} />
          ),
        }}
      />
    </Tabs>
  );
}
