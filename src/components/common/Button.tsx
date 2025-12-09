import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
  GestureResponderEvent,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps extends TouchableOpacityProps {
  title: string | React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  disableHaptic?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  iconLeft,
  iconRight,
  disableHaptic = false,
  className = '',
  onPress,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();

  const sizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size];

  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.primary };
      case 'secondary':
        return { backgroundColor: colors.textSecondary };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getTextColor = () => {
    if (variant === 'outline' || variant === 'ghost') return colors.primary;
    return '#ffffff';
  };

  const handlePress = (e: GestureResponderEvent) => {
    if (!disableHaptic) Haptics.selectionAsync();
    onPress?.(e);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      className={`
        ${sizeClasses[size]}
        rounded-lg items-center justify-center
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50' : ''}
        ${className}
      `}
      style={getButtonStyles()}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {iconLeft && <View>{iconLeft}</View>}

          {typeof title === 'string' ? (
            <Text className={`${textSize} font-semibold`} style={{ color: getTextColor() }}>
              {title}
            </Text>
          ) : (
            title
          )}

          {iconRight && <View>{iconRight}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}
