import { useNavigation } from "@react-navigation/native"
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../themes/colors";
import { AntDesign } from '@expo/vector-icons';

export const BackButton = () => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.backButton} onPress={() => {navigation.goBack()}}>
            <AntDesign name="arrowleft" size={26} color="white" />
        </TouchableOpacity>
    )
};


const styles = StyleSheet.create({
    backButton: {
        backgroundColor: colors.bg.secondary,
        width: 40,
        height: 40,
        justifyContent: 'center',
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
    },
})