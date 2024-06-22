import { ScrollView, Text } from "react-native"
import { MessageItem } from "./MessageItem"
import { useEffect } from "react"

export const MessagesList = ({ messages, currentUser }) => {

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 20}}>
            {
                messages?.map((message, index) => {
                    return(
                        <MessageItem key={index} message={message} currentUser={currentUser}/>
                    )
                })
            }
        </ScrollView>
    )
}