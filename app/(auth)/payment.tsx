import React, {useState} from 'react';
import {Alert, Text, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from "react-native-paper";
import useStore from "../../shared/store";

export default function Payment({route}) {
    const getSelectedTier = useStore(state => state.getSelectedTier)
    console.log(getSelectedTier)
    const [mpesaNumber, setMpesaNumber] = useState(''); // State to store the entered M-Pesa number

    const handlePayment = async () => {
        if (!mpesaNumber) {
            // Don't proceed with payment if M-Pesa number is not entered
            alert('Please enter your M-Pesa number');
            return;
        }
        console.log(mpesaNumber)

        const paymentData = {
            // ShortCode:"600978",
            // CommandID:"CustomerPayBillOnline",
            // // tierName: tierData.name,
            // Amount: 1,
            // MSisdn: mpesaNumber,
            // BillRefNumber: "test",
            ShortCode: "600978",
            CommandID: "CustomerPayBillOnline",
            Amount: "1",
            Msisdn: "254793681840",
            BillRefNumber: "Test"
        };

        try {
            const response = await fetch('https://gpt.proximaai.co/api/mobilepayment/c2btransaction/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            console.log(response)

            if (response.ok) {
                // Payment successful, you can handle the response here
                Alert.alert('Payment successful');
            } else {
                // Payment failed, handle the error here
                Alert.alert('Payment failed', response.statusText);
            }
        } catch (error) {
            console.error('Error making payment:', error);
            Alert.alert('An error occurred while making the payment');
        }
    };


    return (
        <SafeAreaView style={{flex: 1, padding: 16}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 16}}>
                Payment Details
            </Text>
            {/*<Text>Tier: {tierData.name}</Text>*/}
            {/*<Text>Selected Quota: {selectedQuota}</Text>*/}

            <Text style={{marginTop: 16}}>Enter M-Pesa Number:</Text>
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 8,
                    marginBottom: 16,
                }}
                value={mpesaNumber}
                onChangeText={(text) => setMpesaNumber(text)}
            />

            <Button
                onPress={handlePayment}
                textColor="white"
                style={{backgroundColor: '#2DABB1', marginBottom: 16}}
                disabled={!mpesaNumber} // Disable the button if M-Pesa number is not entered
            >Pay via M-Pesa</Button>

            <Text style={{marginTop: 16}}>Payment Method: M-Pesa</Text>
        </SafeAreaView>
    );
}
