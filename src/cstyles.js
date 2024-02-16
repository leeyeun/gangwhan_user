import { StyleSheet } from "react-native";
import colors from './appcolors';

const cstyles = StyleSheet.create({
	text: {
		fontSize: 15,
		color: colors.textPrimary,
	},
	input: {
		paddingHorizontal: 10,
		height: 45,
		color: colors.textPrimary,
		fontSize: 15,
		borderColor: '#e3e3e3',
		borderRadius: 5,
		borderWidth: 1,
	},
	labelContainer: {
		flexDirection: 'row', alignItems: 'baseline'
	},
	inputLabel: {
		fontSize: 15, color: colors.textPrimary
	},
	errorText: {
		marginLeft: 10, fontSize: 14, color: colors.danger
	},
	borderRounded: {
		borderColor: colors.borderColor,
		borderWidth: 1,
		borderRadius: 6,
	},
	rootView: {
		paddingHorizontal: 22,
		paddingTop: 20,
		paddingBottom: 50,
	},
	badge: {
		borderRadius: 12,
		paddingHorizontal: 9,
		paddingVertical: 3,
		fontSize: 12,
		fontWeight: 'bold',
		color: colors.textPrimary,
	},
	modalTitle: {
		fontSize: 22,
		color: colors.textPrimary,
		fontWeight: 'bold',
	},
	modalSubtitle: {
		marginTop: 10,
		fontSize: 15,
		color: colors.textPrimary,
	},
	roundIcon: {
		width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderColor: colors.borderColor, borderWidth: 1,
	}
});

export default cstyles;