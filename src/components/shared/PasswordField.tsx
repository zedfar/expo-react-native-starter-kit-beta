import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Lock, Eye, EyeOff } from 'lucide-react-native';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
  colors: any;
  error?: string | null;
  onHaptic: (fn: () => void) => void;
  placeholder?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChange,
  show,
  setShow,
  colors,
  error,
  onHaptic,
  placeholder,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
        {label}
      </Text>
      <View
        className="flex-row items-center rounded-lg border h-14 px-4"
        style={{
          borderColor: error ? colors.error : colors.inputBorder,
          backgroundColor: colors.inputBg,
        }}
      >
        <Lock size={22} color={colors.primary} />
        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={() => onHaptic(() => Haptics.selectionAsync())}
          secureTextEntry={!show}
          placeholder={placeholder || label}
          placeholderTextColor={colors.textSecondary}
          style={{ color: colors.inputText, flex: 1, marginLeft: 12 }}
        />
        <TouchableOpacity
          onPress={() => {
            onHaptic(() => Haptics.selectionAsync());
            setShow(!show);
          }}
        >
          {show ? (
            <EyeOff size={22} color={colors.textSecondary} />
          ) : (
            <Eye size={22} color={colors.textSecondary} />
          )}
        </TouchableOpacity>
      </View>
      {error && (
        <Text className="text-xs mt-1 px-1" style={{ color: colors.error }}>
          {error}
        </Text>
      )}
    </View>
  );
};
