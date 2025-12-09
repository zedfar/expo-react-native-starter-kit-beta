// components/shared/FormInput.tsx
import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { User, Mail, Lock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface FormInputProps extends TextInputProps {
  label: string;
  icon?: 'user' | 'mail' | 'lock';
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  icon,
  required = false,
  ...textInputProps
}) => {
  const { colors } = useTheme();
  const IconComponent = icon === 'user' ? User : icon === 'mail' ? Mail : Lock;

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold mb-1" style={{ color: colors.text }}>
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <View
        className="flex-row items-center px-4 py-3 rounded-xl gap-2.5"
        style={{ backgroundColor: `${colors.primary}08` }}
      >
        {icon && <IconComponent size={18} color={colors.textSecondary} />}
        <TextInput
          className="flex-1 text-base font-medium"
          style={{ color: colors.text }}
          placeholderTextColor={colors.textSecondary}
          {...textInputProps}
        />
      </View>
    </View>
  );
};



