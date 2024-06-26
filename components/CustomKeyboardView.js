import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"

const ios = Platform.OS == "ios";
export const CustomKeyboardView = ({children, inChat}) => {
    let kavConfig = {}
    let scrollViewConfig = {}
    if(inChat){
        kavConfig = {keyboardVerticalOffset: 90};
        scrollViewConfig = {contentContainerStyle: {flex: 1}}
    }

    return(
        <KeyboardAvoidingView
        behavior={ios ? "padding" : null}
        style={{flex: 1}}
        {...kavConfig}
        >
            <ScrollView 
            style={{flex: 1}}
            bounces={false}
            showsVerticalScrollIndicator={false}
            {...scrollViewConfig}
            >
                {children}
            </ScrollView>

        </KeyboardAvoidingView>
    )
}