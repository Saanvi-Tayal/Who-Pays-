import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  DropIn: undefined;
  PlayerSetup: undefined;
  Stakes: undefined;
  GameLobby: undefined;
  TimeBombArena: undefined;
  RouletteArena: undefined;
  TapFrenzyArena: undefined;
  ReactionStandoffArena: undefined;
  Verdict: undefined;
  GroupHistory: undefined;
  KarmaMeter: undefined;
  Circles: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
