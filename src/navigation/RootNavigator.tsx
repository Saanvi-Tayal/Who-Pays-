import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { DropInScreen } from '@/screens/DropInScreen';
import { PlayerSetupScreen } from '@/screens/PlayerSetupScreen';
import { StakesScreen } from '@/screens/StakesScreen';
import { GameLobbyScreen } from '@/screens/GameLobbyScreen';
import { TimeBombArenaScreen } from '@/screens/arenas/TimeBombArenaScreen';
import { RouletteArenaScreen } from '@/screens/arenas/RouletteArenaScreen';
import { TapFrenzyArenaScreen } from '@/screens/arenas/TapFrenzyArenaScreen';
import { ReactionStandoffArenaScreen } from '@/screens/arenas/ReactionStandoffArenaScreen';
import { VerdictScreen } from '@/screens/VerdictScreen';
import { GroupHistoryScreen } from '@/screens/GroupHistoryScreen';
import { KarmaMeterScreen } from '@/screens/KarmaMeterScreen';
import { CirclesScreen } from '@/screens/CirclesScreen';
import { colors } from '@/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="DropIn"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="DropIn" component={DropInScreen} />
      <Stack.Screen name="PlayerSetup" component={PlayerSetupScreen} />
      <Stack.Screen name="Stakes" component={StakesScreen} />
      <Stack.Screen name="GameLobby" component={GameLobbyScreen} />
      <Stack.Screen name="TimeBombArena" component={TimeBombArenaScreen} />
      <Stack.Screen name="RouletteArena" component={RouletteArenaScreen} />
      <Stack.Screen name="TapFrenzyArena" component={TapFrenzyArenaScreen} />
      <Stack.Screen name="ReactionStandoffArena" component={ReactionStandoffArenaScreen} />
      <Stack.Screen name="Verdict" component={VerdictScreen} />
      <Stack.Screen name="GroupHistory" component={GroupHistoryScreen} />
      <Stack.Screen name="KarmaMeter" component={KarmaMeterScreen} />
      <Stack.Screen name="Circles" component={CirclesScreen} />
    </Stack.Navigator>
  );
};
