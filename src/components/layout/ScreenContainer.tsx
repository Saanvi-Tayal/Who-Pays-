import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  useSafeArea?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  edges = ['top', 'bottom', 'left', 'right'],
  useSafeArea = true,
}) => {
  if (!useSafeArea) {
    return (
      <View style={[styles.container, style]}>
        <StatusBar style="light" />
        {children}
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      <StatusBar style="light" />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
