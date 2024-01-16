import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Radio, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Import navigation and colorMappings as needed

class WebSocketService {
  constructor() {
    this.ws = null;
    this.serverUrl = "wss://gpt.proximaai.co/ws/personalizedsurvey/";
  }

  connect(onOpenCallback, onCloseCallback, onMessageCallback, onErrorCallback) {
    this.ws = new WebSocket(this.serverUrl);

    this.ws.onopen = onOpenCallback;
    this.ws.onclose = onCloseCallback;
    this.ws.onmessage = onMessageCallback;
    this.ws.onerror = onErrorCallback;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}

const Home = () => {
  // Replace useRouter with React Navigation or similar
  const [showBack, setShowBack] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [webSocketService, setWebSocketService] = useState(null);
  const [questionStream, setQuestionStream] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showQuestionTrigger, setShowQuestionTrigger] = useState("");
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const wsService = new WebSocketService();
    setWebSocketService(wsService);

    wsService.connect(
      () => console.log("Connected to WebSocket"),
      () => console.log("Disconnected from WebSocket"),
      (event) => {
        const parsedData = JSON.parse(event.data);
        setQuestionStream(prev => prev + parsedData.token);
      },
      (event) => console.error("WebSocket Error:", event)
    );

    return () => wsService.disconnect();
  }, []);

  useEffect(() => {
    const splitQuestions = questionStream.split(/\\n[0-9]+\. /).filter(q => q.trim());
    setQuestions(splitQuestions);
  }, [questionStream]);

  const handleSendMessage = () => {
    const message = {
      tenant_name: "hello",
      questions_trigger: showQuestionTrigger,
    };

    if (webSocketService) {
      webSocketService.sendMessage(message);
    }
    setIsStreaming(true);
  };

  const handleBack = () => {
    setShowBack(true);
  };

  const handleSubmit = () => {
    // Process and collect survey data here
  };

  const handleResponseChange = (index, value) => {
    setResponses({ ...responses, [index]: value });
  };

  const handleTriggerSurveyFromQuestions = () => {
    // Define your message structure
    const message = {/*...*/};

    if (webSocketService) {
      webSocketService.sendMessage(message);
    }
  };

  if (isStreaming) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Survey</Text>
        <View style={styles.questionContainer}>
          {questions.map((question, index) => (
            <View key={index} style={styles.questionBox}>
              <Text style={styles.question}>{index + 1}. {question}</Text>
              {/* Implement radio buttons for Yes/No */}
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={handleTriggerSurveyFromQuestions}>
            <Text style={styles.buttonText}>Submit Responses</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name="ios-arrow-back" size={24} />
      </TouchableOpacity>

      <Text style={styles.header}>Question-Based Survey</Text>

      <TextInput
        style={styles.input}
        placeholder="Question Trigger"
        onChangeText={setShowQuestionTrigger}
      />

      <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionContainer: {
    // styles for question container
  },
  questionBox: {
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
  },
  backButton: {
    // styles for back button
  }
});

export default Home;
