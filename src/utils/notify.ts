import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

let lastCall = 0;
const MIN_INTERVAL = 700;

const safeShow = (fn: () => void) => {
    const now = Date.now();
    if (now - lastCall < MIN_INTERVAL) return;
    lastCall = now;
    fn();
};

type ToastType = 'success' | 'error' | 'warning' | 'info';

const hapticMap: Record<ToastType, () => void> = {
    success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
    warning: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    info: () => Haptics.selectionAsync(),
};

const show = (type: ToastType, text1: string, text2?: string) => {
    safeShow(() => {
        hapticMap[type]();
        Toast.show({ type, text1, text2 });
    });
};

export const notify = {
    success: (t1: string, t2?: string) => show('success', t1, t2),
    error: (t1: string, t2?: string) => show('error', t1, t2),
    warning: (t1: string, t2?: string) => show('warning', t1, t2),
    info: (t1: string, t2?: string) => show('info', t1, t2),

    /** 🚀 notify.promise — auto loading → success → error */
    promise: async <T>(
        promise: Promise<T>,
        messages: {
            loading?: string;
            success?: string;
            error?: string;
        }
    ): Promise<T> => {
        // toast + haptic saat mulai
        if (messages.loading) {
            show('info', messages.loading);
        }

        try {
            const result = await promise;

            if (messages.success) {
                // bypass anti-spam karena ini continuation dari loading
                hapticMap.success();
                Toast.show({ type: 'success', text1: messages.success });
            }

            return result;
        } catch (err: any) {
            // gunakan pesan dari error atau fallback ke pesan default
            const errorMsg = err?.message || messages.error || 'Something went wrong';

            // bypass anti-spam karena ini continuation dari loading
            hapticMap.error();
            Toast.show({ type: 'error', text1: errorMsg });

            throw err;
        }
    },
};
