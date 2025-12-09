import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerClassName = '',
  className = '',
  secureTextEntry,
  ...props
}: InputProps) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
          {label}
        </Text>
      )}
      
      <View 
        className={`
          flex-row items-center border rounded-lg px-3
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        style={{ backgroundColor: colors.surface }}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        
        <TextInput
          className={`flex-1 py-3 ${className}`}
          style={{ color: colors.text }}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
            {showPassword ? (
              <EyeOff size={20} color={colors.textSecondary} />
            ) : (
              <Eye size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
        
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      
      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
      
      {helperText && !error && (
        <Text className="text-xs mt-1" style={{ color: colors.textSecondary }}>
          {helperText}
        </Text>
      )}
    </View>
  );
}