import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
    id: string;
    message: string;
    sender: 'me' | 'other';
}

const dummyData: Message[] = [
    { id: '1', message: '¡Hola!', sender: 'other' },
    { id: '2', message: '¡Hola! ¿Cómo estás?', sender: 'me' },
    { id: '3', message: 'Estoy bien, gracias. ¿Y tú?', sender: 'other' },
    { id: '4', message: 'Muy bien, gracias por preguntar.', sender: 'me' },
];

const MessageScreen: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>(dummyData);

    const sendMessage = () => {
        if (message.trim()) {
            setMessages(prev => [
                ...prev,
                { id: (prev.length + 1).toString(), message, sender: 'me' },
            ]);
            setMessage('');
        }
    };

    const renderItem = ({ item }: { item: Message }) => (
        <View
            style={[
                styles.messageBubble,
                item.sender === 'me' ? styles.myMessage : styles.otherMessage,
            ]}
        >
            <Text style={styles.messageText}>{item.message}</Text>
        </View>
    );

    return (
        <View style={styles.margin}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <FlatList
                            data={messages}
                            style={styles.messageList}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                        />

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Escribe un mensaje..."
                                value={message}
                                onChangeText={setMessage}
                                placeholderTextColor="#888"
                            />
                            <Button title="Enviar" onPress={sendMessage} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    );
};

export default MessageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    messageList: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
        backgroundColor: '#F0F0F0',
    },
    messageBubble: {
        padding: 12,
        marginVertical: 6,
        borderRadius: 12,
        maxWidth: '80%',
    },
    myMessage: {
        backgroundColor: '#A8D5BA',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#E0E0E0',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 10 : 8,
        marginRight: 10,
        fontSize: 16,
        color: '#333',
    },
    margin: {
        flex: 1,
        padding: 20,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: '#fff'

    },
});
