import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Feather,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
    AntDesign,
} from '@expo/vector-icons';
import { AuthContext } from '../../../shared/auth/context/auth';
import {Drawer} from 'expo-router/drawer'

export default function Home() {
    const [chatMessages, setChatMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [ws, setWs] = useState(null);
    const scrollViewRef = useRef();
    const { onLogout, isLoggedIn } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(''); // Default selected option
    const defaultWebSocketURL = 'wss://gpt.proximaai.co/ws/conversationalagents/';
    const [webSocketURL, setWebSocketURL] = useState(`${defaultWebSocketURL}`); // Default WebSocket URL

    const { userDetails } = useContext(AuthContext);

    // Define your list of WebSocket URLs and options
    const webSocketOptions = [
        { label: '1. Conversational Agent', url: 'wss://gpt.proximaai.co/ws/conversationalagents/' },
        { label: '2. React Agent', url: 'wss://gpt.proximaai.co/ws/reactagent/' },
        { label: '3. React Document Agent', url: 'wss://gpt.proximaai.co/ws/reactdocumentagent/' },
        { label: '4. Plan Agent', url: 'wss://gpt.proximaai.co/ws/planagent/' },
        { label: '5. Chat Conversational Agent', url: 'wss://gpt.proximaai.co/ws/chatconversationalagents/' },
    ];

    useEffect(() => {
        console.log(`Connecting to WebSocket: ${webSocketURL}`);

        // Create a WebSocket connection when the component mounts
        const socket = new WebSocket(webSocketURL, {
            rejectUnauthorized: false,
        });

        // Set the WebSocket instance in state
        setWs(socket);

        // Handle WebSocket open event
        socket.addEventListener('open', function (event) {});

        // Handle WebSocket message event
        socket.addEventListener('message', function (event) {
            const data = JSON.parse(event.data);

            if (data.token && Array.isArray(data.token) && data.token.length > 0) {
                // Initialize step number
                let stepNumber = 1;

                // Initialize arrays to store unique steps and responses separately
                const steps = [];
                const responses = new Set(); // Use a Set to store unique responses

                // Process plan steps and responses
                data.token.forEach(token => {
                    if (token.plan) {
                        // Extract and handle plan steps if they exist
                        const planSteps = token.plan.split(',').map(step => {
                            // Extract the step value
                            const stepValueMatch = step.match(/Step\(value='(.*)'\)/);
                            const stepValue = stepValueMatch ? stepValueMatch[1] : '';

                            // Check if the step is not empty and not a duplicate
                            if (stepValue.trim() && !steps.includes(stepValue)) {
                                // Add the step to the steps array
                                steps.push(stepValue);
                                stepNumber++;
                            }
                        });

                        if (token.response && !responses.has(token.response)) {
                            // Add the response to the responses Set if it's not already present
                            responses.add(token.response);
                        }
                    } else if (token.step) {
                        // Extract and handle single step if it exists
                        const singleStepValue = token.step.trim();

                        // Check if the step is not empty and not a duplicate
                        if (singleStepValue && !steps.includes(singleStepValue)) {
                            // Add the step to the steps array
                            steps.push(singleStepValue);
                            stepNumber++;
                        }

                        if (token.response && !responses.has(token.response)) {
                            // Add the response to the responses Set if it's not already present
                            responses.add(token.response);
                        }
                    }
                });

                // Create a numbered list of non-empty and unique steps
                const numberedSteps = steps.map((step, index) => `${index + 1}. ${step}`);

                // Combine steps and responses into a single message
                const chatMessage = numberedSteps.join('\n\n') + '\n\n' + Array.from(responses).join('\n\n');

                if (chatMessage.trim()) {
                    // Exclude the specific response message from being displayed
                    if (chatMessage.trim() !== "Given the above steps taken, please respond to the user's original question.") {
                        // Update chat messages with the combined message
                        setChatMessages((prevMessages) => [
                            ...prevMessages,
                            { text: chatMessage.trim(), type: 'agent' },
                        ]);
                    }
                }
            } else if (data.action === 'Calculator') {
                // Handle calculator action response
                setChatMessages((prevMessages) => [
                    ...prevMessages,
                    { text: `Calculator Result: ${data.result}`, type: 'agent' },
                ]);
            } else if (data.end === true) {
                // Skip adding a message if "end" is true
                // You can add any specific handling here if needed
            } else {
                if (
                    data.message !==
                    "Given the above steps taken, please respond to the user's original question."
                ) {
                    // Update chat messages with the received message
                    setChatMessages((prevMessages) => [
                        ...prevMessages,
                        { text: data.message, type: 'agent' },
                    ]);
                }
            }
        });

        // Handle WebSocket error event
        socket.addEventListener('error', function (event) {
            console.error('WebSocket error occurred:', event);
        });

        // Close the WebSocket connection when the component unmounts
        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [webSocketURL]); // Reconnect when the WebSocket URL changes

    const sendMessage = () => {
        let trimmedMessage = messageText.trim();
        if (trimmedMessage.length === 0) {
            return;
        }

        // Send the message via WebSocket
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ message: trimmedMessage }));
        }

        // Update local chat messages
        setChatMessages((prevMessages) => [
            ...prevMessages,
            { text: trimmedMessage, type: 'user' },
        ]);

        // Clear the input field
        setMessageText('');
    };

    const showModal = () => {
        setModalVisible(true);
    };

    // Function to hide the modal
    const hideModal = () => {
        setModalVisible(false);
    };

    // Function to handle option selection
    const handleOptionSelect = (option) => {
        setSelectedOption(option.label);
        setWebSocketURL(option.url);
        hideModal();
        setChatMessages([]);
        setMessageText('');
    };

    const handleDrawerOpen = () => {
        return <Drawer />
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View className="px-4 py-3">
                {/* Top Navigation Bar */}
                <View
                    className="relative flex-row items-center justify-between px-[16px] bg-white rounded-full"
                    style={{
                        height: 60, // Adjust the height as needed
                    }}
                >
                    <Pressable
                        onPress={handleDrawerOpen}
                    >
                        <FontAwesome name="bars" size={24} color="#2DABB1" />
                    </Pressable>
                    <View className="flex-row gap-3">
                        <Pressable>
                            <MaterialCommunityIcons
                                name="bell-badge"
                                size={24}
                                color="#2DABB1"
                            />
                        </Pressable>

                        <View className="">
                            <Pressable onPress={showModal}>
                                <Feather
                                    name="plus"
                                    size={24}
                                    color="#2DABB1"
                                />
                            </Pressable>
                            <Modal
                                // animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                className=""
                                onRequestClose={hideModal} // Close the modal when the back button is pressed on Android
                            >
                                <View className="absolute right-3 top-[80px]">
                                    {/* Modal content with options */}
                                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                                        <View className="flex-row justify-between space-x-10 items-center">
                                            <Text className="font-bold">Choose an Agent to Talk to</Text>
                                            <Pressable onPress={hideModal}>
                                                <Ionicons name="close" size={24} color="#2DABB1" />
                                            </Pressable>
                                        </View>
                                        {webSocketOptions.map((option, index) => (
                                            <Pressable
                                                key={index}
                                                className={"py-2"}
                                                onPress={() => handleOptionSelect(option)}
                                            >
                                                <Text>{option.label}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </View>
                            </Modal>
                        </View>

                        <Pressable
                            onPress={() => {
                                onLogout();
                            }}
                        >
                            <AntDesign name="logout" size={24} color="#2DABB1" />
                        </Pressable>
                    </View>
                </View>
            </View>
            <ScrollView
                ref={scrollViewRef}
                className="flex-1 px-5 py-4 pb-20"
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() =>
                    scrollViewRef.current.scrollToEnd({ animated: true })
                }
            >
                {chatMessages.map((message, index) => (
                    <View
                        key={index}
                        style={{
                            flexDirection: 'row',
                            justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                            marginBottom: 8,
                        }}
                    >
                        <View
                            className={`${message.type === 'user' ? 'rounded-l-[25px] rounded-tr-none rounded-br-[25px] my-3' : 'my-5 rounded-tl-[25px] rounded-bl-none p-4 rounded-r-[25px]'}`}
                            style={{
                                // Use different styles for user and agent messages
                                backgroundColor: message.type === 'user' ? '#2DABB1' : '#E0E0E0',
                                borderRadius: 8,
                                padding: 8,
                                maxWidth: '80%', // Limit message width for readability
                            }}
                        >
                            <Text
                                style={{
                                    color: message.type === 'user' ? 'white' : 'black',
                                    // Add custom styles for the plan agent's messages
                                    fontStyle: message.type === 'agent' ? 'italic' : 'normal',
                                    fontWeight: message.type === 'agent' ? 'normal' : 'bold',
                                }}
                            >
                                {message.text}
                            </Text>
                        </View>
                    </View>
                ))}

            </ScrollView>
            <View className="flex-row items-center px-4 gap-4 py-3">
                <View className="bg-white flex-1 flex-row items-center gap-4 rounded-full">
                    <TextInput
                        multiline
                        placeholder={'Type a message...'}
                        className="bg-primary flex-1 bg-transparent pb-4"
                        value={messageText}
                        onChangeText={(text) => setMessageText(text)}
                    />
                    <Pressable className={'pb-4'}>
                        <FontAwesome name="microphone" size={24} color="#2DABB1" />
                    </Pressable>
                    <Pressable onPress={sendMessage} className={'mr-4 pb-4'}>
                        <FontAwesome name="send" size={24} color="#2DABB1" />
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}
