import { TabNavigator, Tab } from '@/src/components/tab-navigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import IndexScreen from './index';
import ShiftsScreen from './shifts';
import VolunteersScreen from './volunteers';
import ProfileScreen from './profile';

export default function OrgTabLayout() {
  return (
    <TabNavigator>
      <Tab.Screen
        name="Activities"
        component={IndexScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Shifts"
        component={ShiftsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" color={color} size={26} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Volunteers"
        component={VolunteersScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" color={color} size={26} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" color={color} size={26} />
          ),
          headerShown: false
        }}
      />
    </TabNavigator>
  );
}
