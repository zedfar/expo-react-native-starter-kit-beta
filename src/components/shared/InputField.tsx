import React from 'react';
import { View, Text, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
  colors: any;
  error?: string | null;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  onHaptic: (fn: () => void) => void;
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  icon,
  colors,
  error,
  keyboardType = 'default',
  onHaptic,
  placeholder,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>{label}</Text>
      <View
        className="flex-row items-center rounded-lg border h-14 px-4"
        style={{
          borderColor: error ? colors.error : colors.inputBorder,
          backgroundColor: colors.inputBg,
        }}
      >
        {icon}
        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={() => onHaptic(() => Haptics.selectionAsync())}
          placeholder={placeholder || label}
          placeholderTextColor={colors.textSecondary}
          keyboardType={keyboardType}
          style={{ color: colors.inputText, flex: 1, marginLeft: 12 }}
        />
      </View>
      {error && (
        <Text className="text-xs mt-1 px-1" style={{ color: colors.error }}>
          {error}
        </Text>
      )}
    </View>
  );
};
