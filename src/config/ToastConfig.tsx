import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react-native';
import { ToastConfig } from 'react-native-toast-message';
import { useTheme } from '@/hooks/useTheme';

const Base = ({
  icon,
  text1,
  text2,
  bg,
  border,
  iconColor,
}: {
  icon: React.ReactNode;
  text1: string;
  text2?: string;
  bg: string;
  border: string;
  iconColor: string;
}) => (
  <View style={[styles.toastContainer, { backgroundColor: bg, borderLeftColor: border }]}>
    {icon}
    <View style={styles.toastContent}>
      <Text style={styles.toastTitle}>{text1}</Text>
      {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
    </View>
  </View>
);

export const toastConfig: ToastConfig = {
  success: (props) => {
    const { colors } = useTheme();
    return (
      <Base
        icon={<CheckCircle size={24} color={colors.success} />}
        text1={props.text1 ?? ''}
        text2={props.text2}
        bg={colors.toastSuccessBg}
        border={colors.success}
        iconColor={colors.success}
      />
    );
  },
  error: (props) => {
    const { colors } = useTheme();
    return (
      <Base
        icon={<XCircle size={24} color={colors.error} />}
        text1={props.text1 ?? ''}
        text2={props.text2}
        bg={colors.toastErrorBg}
        border={colors.error}
        iconColor={colors.error}
      />
    );
  },
  warning: (props) => {
    const { colors } = useTheme();
    return (
      <Base
        icon={<AlertCircle size={24} color={colors.warning} />}
        text1={props.text1 ?? ''}
        text2={props.text2}
        bg={colors.toastWarningBg}
        border={colors.warning}
        iconColor={colors.warning}
      />
    );
  },
  info: (props) => {
    const { colors } = useTheme();
    return (
      <Base
        icon={<Info size={24} color={colors.info} />}
        text1={props.text1 ?? ''}
        text2={props.text2}
        bg={colors.toastInfoBg}
        border={colors.info}
        iconColor={colors.info}
      />
    );
  },
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 24,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    gap: 12,
  },
  toastContent: { flex: 1 },
  toastTitle: { fontSize: 15, fontWeight: '700', color: '#1f2937', marginBottom: 2 },
  toastMessage: { fontSize: 13, fontWeight: '500', color: '#6b7280' },
});
