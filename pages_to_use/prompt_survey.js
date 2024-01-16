import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.serverUrl = "wss://gpt.proximaai.co/ws/promptsurvey/";
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
  const [showBack, setShowBack] = useState(false);
  const [surveyTopic, setSurveyTopic] = useState("");
  const [prompt, setPrompt] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState("");
  const [questionType, setQuestionType] = useState("open");
  const [isStreaming, setIsStreaming] = useState(false);
  const [webSocketService, setWebSocketService] = useState(null);
  const [questionStream, setQuestionStream] = useState("");
  const [questions, setQuestions] = useState([]);
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

  const handleResponseChange = (index, value) => {
    setResponses({ ...responses, [index]: value });
  };

  const handleSubmitResponses = () => {
    console.log('Submitted Responses:', responses);
    // Handle submission logic here
  };

  const handleSendMessage = () => {
    const message = {
      tenant_name: "Proxima Agents Limited",
      prompt,
      numberOfQuestions,
      questionType,
      surveyTopic,
    };

    if (webSocketService) {
      webSocketService.sendMessage(message);
      setIsStreaming(true);
    }
  };

  const handleBack = () => setShowBack(true);

  if (showBack) {
    return <Text>Welcome Home</Text>; // Replace with actual navigation logic
  }

  if (isStreaming) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{surveyTopic}</Text>
        <View style={styles.questionContainer}>
          {questions.map((question, index) => (
            <View key={index} style={styles.questionBox}>
              <Text style={styles.question}>{index + 1}. {question}</Text>
              <TextInput
                style={styles.input}
                value={responses[index] || ""}
                onChangeText={(text) => handleResponseChange(index, text)}
                placeholder="Your answer"
              />
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={handleSubmitResponses}>
            <Text style={styles.buttonText}>Submit Responses</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="ios-arrow-back" size={24} />
      </TouchableOpacity>

      <Text style={styles.header}>Prompt Survey</Text>

      <TextInput
        style={styles.input}
        placeholder="Survey Topic"
        value={surveyTopic}
        onChangeText={setSurveyTopic}
      />

      <TextInput
        style={styles.input}
        placeholder="Prompt"
        value={prompt}
        onChangeText={setPrompt}
      />

      <TextInput
        style={styles.input}
        placeholder="Number of Questions"
        value={numberOfQuestions}
        onChangeText={setNumberOfQuestions}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Question Type"
        value={questionType}
        onChangeText={setQuestionType}
      />

      <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
        <Text style={styles.buttonText}>Start Survey</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionContainer: {
    width: '100%',
  },
  questionBox: {
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  }
});

export default Home;
