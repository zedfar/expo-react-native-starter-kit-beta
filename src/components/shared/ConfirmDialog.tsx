// components/shared/ConfirmDialog.tsx
import React from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  destructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  destructive = false,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View
          className="w-full max-w-[360px] rounded-2xl p-6 shadow-xl"
          style={{
            backgroundColor: colors.background,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {destructive && (
            <View className="items-center mb-4">
              <AlertTriangle size={48} color="#ef4444" />
            </View>
          )}

          <Text className="text-xl font-extrabold mb-3 text-center" style={{ color: colors.text }}>
            {title}
          </Text>
          <Text className="text-sm font-medium leading-5 text-center mb-6" style={{ color: colors.textSecondary }}>
            {message}
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 py-3.5 rounded-xl items-center justify-center border-2"
              style={{ borderColor: colors.border }}
              onPress={onCancel}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text className="text-base font-bold" style={{ color: colors.text }}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3.5 rounded-xl items-center justify-center shadow-md"
              style={{
                backgroundColor: destructive ? '#ef4444' : colors.primary,
                opacity: loading ? 0.7 : 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={onConfirm}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-base font-bold text-white">
                  {confirmText}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
