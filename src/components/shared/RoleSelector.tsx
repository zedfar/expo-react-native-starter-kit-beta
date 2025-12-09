// components/shared/RoleSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface RoleSelectorProps {
	selectedRole: 'admin' | 'user' | any;
	onSelectRole: (role: 'admin' | 'user') => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
	selectedRole,
	onSelectRole,
}) => {
	const { colors } = useTheme();

	return (
		<View className="flex-row gap-3">
			{(['user', 'admin'] as const).map((role) => (
				<TouchableOpacity
					key={role}
					className="flex-1 py-3 rounded-xl items-center"
					style={{
						backgroundColor: selectedRole === role
							? colors.primary
							: `${colors.primary}10`,
					}}
					onPress={() => onSelectRole(role)}
					activeOpacity={0.7}
				>
					<Text
						className="text-sm"
						style={{
							color: selectedRole === role ? '#FFFFFF' : colors.text,
							fontWeight: selectedRole === role ? '700' : '500',
						}}
					>
						{role.charAt(0).toUpperCase() + role.slice(1)}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};
