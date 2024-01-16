import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

interface FormInputProps {
    name: string;
    label?: string;
    value: string;
    onChange: (text: string) => void;
    placeholder: string;
    required: boolean;
    disabled?: boolean;
    secureTextEntry?: boolean;
    style?: any;
    screenType?: 'signup' | 'login';
}

export function FormInput({
                              name,
                              label,
                              value,
                              onChange,
                              placeholder,
                              required,
                              disabled,
                              secureTextEntry,
                              style,
                              screenType,
                          }: FormInputProps) {
    const otpLength = screenType === 'signup' ? 6 : 7;
    const isOTPField = name === 'otp';

    if (isOTPField) {
        const inputRefs = useRef<Array<TextInput | null>>(
            Array.from({length: otpLength}, () => null)
        );

        useEffect(() => {
            // Focus the first input field when the OTP input is initially displayed
            if (isOTPField && inputRefs.current[0]) {
                inputRefs.current[0]?.focus();
            }
        }, []);

        const handleInputChange = (text: string, index: number) => {
            // Update the OTP value
            const otpDigits = value.split('');
            otpDigits[index] = text;
            onChange(otpDigits.join(''));

            // Focus on the next input field if available
            if (index < otpLength - 1 && inputRefs.current[index + 1]) {
                inputRefs.current[index + 1]?.focus();
            }
        };

        const handleInputBackspace = (index: number) => {
            // Navigate to the previous input field when backspace is pressed on an empty field
            if (index > 0 && !value[index] && inputRefs.current[index - 1]) {
                inputRefs.current[index - 1]?.focus();
            }
        };

        const otpInputFields = Array.from({length: otpLength}, (_, index) => (
            <TextInput
                key={index}
                mode="outlined"
                name={`otp-${index}`}
                value={value[index] || ''}
                onChangeText={(text) => handleInputChange(text, index)}
                onKeyPress={({nativeEvent}) => {
                    if (nativeEvent.key === 'Backspace') {
                        handleInputBackspace(index);
                    }
                }}
                placeholder={placeholder}
                editable={!disabled}
                secureTextEntry={secureTextEntry}
                style={styles.otpInputField}
                keyboardType="number-pad" // Set the keyboard type to "number"
                ref={(ref) => (inputRefs.current[index] = ref)}
            />
        ));

        return (
            <View style={{marginBottom: 15, ...style}}>
                <Text className="font-bold">{label}</Text>
                <View style={styles.otpInputContainer}>{otpInputFields}</View>
            </View>
        );
    }

    const inputStyle = styles.inputField; // Regular input field styling

    return (
        <View style={{marginBottom: 15, ...style}}>
            <Text className="font-bold my-5 pb-5"
                style={{color: '#2DABB1', fontSize: 16, fontWeight: 'bold'}}>{label}</Text>
            <TextInput
                mode="outlined"
                name={name}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                editable={!disabled}
                secureTextEntry={secureTextEntry}
                style={inputStyle}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputField: {
        padding: 10,
        backgroundColor: '#fff',
        borderColor: '#2DABB1',
        borderRadius: 5,
        color: '#2DABB1',
        borderWidth: 1,
        marginHorizontal: 5,
        marginVertical: 5,
    },
    otpInputField: {
        padding: 10,
        width: 40,
        backgroundColor: '#fff',
        borderColor: '#2DABB1',
        borderRadius: 5,
        color: '#2DABB1',
        borderWidth: 1,
        marginRight: 5, // Add some spacing between digits for OTP
    },
    otpInputContainer: {
        flexDirection: 'row',
    },
});
