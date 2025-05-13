import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

const MESSAGES = [
    { id: '1', fromMe: false, text: 'Hola, ¿cómo estás?' },
    { id: '2', fromMe: true, text: '¡Hola! Todo bien, ¿y tú?' },
    { id: '3', fromMe: false, text: 'Muy bien, gracias 😊' },
];

const MessageScreen = ({ route }: any) => {
    const { user } = route.params;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <FlatList
                data={MESSAGES}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                <View
                    style={[
                        styles.messageBubble,
                        item.fromMe ? styles.fromMe : styles.fromOther,
                    ]}
                >
                    <Text style={styles.messageText}>{item.text}</Text>
                </View>
                )}
                contentContainerStyle={{ padding: 16 }}
            />
        </KeyboardAvoidingView>
    );
};

export default MessageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: '#f2f2f2',
    },
    messageBubble: {
        padding: 10,
        marginVertical: 4,
        borderRadius: 12,
        maxWidth: '80%',
    },
    fromMe: {
        backgroundColor: '#dcf8c6',
        alignSelf: 'flex-end',
    },
    fromOther: {
        backgroundColor: '#eee',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 14,
    },
    input: {
        borderTopWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
});
