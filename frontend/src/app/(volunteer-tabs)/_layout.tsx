import { TabNavigator, Tab } from '@/src/components/tab-navigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import IndexScreen from './index';
import SearchScreen from './search';
import CommunityScreen from './community';
import ProfileScreen from './profile';

export default function VolunteerTabLayout() {
  return (
    <TabNavigator>
      <Tab.Screen
        name="Suggested"
        component={IndexScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" color={color} size={26} />
          ),
        }}
      />
    </TabNavigator>
  );
}
