import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormInput } from '../../shared/components'; // Update the import
import { Button } from 'react-native-paper';
import Logo from '../../assets/proxima_logo.svg';
import {router} from "expo-router";

const forms = [
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email.',
    },
    {
        name: 'otp',
        label: 'OTP',
        placeholder: '',
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password.',
    },
    {
        name: 'confirmPassword',
        label: 'Confirm Password',
        placeholder: 'Confirm your password.',
    },
    {
        name: 'username',
        label: 'Username',
        placeholder: 'Enter your username.',
    },
    {
        name: 'firstName',
        label: 'First Name',
        placeholder: 'Enter your first name.',
    },
    {
        name: 'lastName',
        label: 'Last Name',
        placeholder: 'Enter your last name.',
    },
    {
        name: 'phoneNumber',
        label: 'Phone Number',
        placeholder: 'Enter your phone number.',
    },
    {
        name: 'gender',
        label: 'Gender',
        placeholder: '',
    },
    {
        name: 'dob',
        label: 'Date of Birth',
        placeholder: 'Enter your date of birth.',
    },
];

export default function Page() {
    const initialValues = {
        email: '',
        otp: '',
        password: '',
        confirmPassword: '',
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        gender: '',
        dob: '',
    };

    const [currentStep, setCurrentStep] = useState(0);

    // Use state to manage the input values
    const [inputValues, setInputValues] = useState({ ...initialValues });

    const handleNextStep = () => {
        // Logic to handle step transitions
        if (currentStep === 0 && inputValues.email) {
            // If email is provided, move to the OTP step
            setCurrentStep(1);
        } else if (currentStep === 1 && inputValues.otp) {
            // If OTP is provided, move to the Password step
            setCurrentStep(2);
        } else if (currentStep === 2 && inputValues.password && inputValues.confirmPassword) {
            // If password and confirmPassword are provided, move to the Profile step
            setCurrentStep(3);
        }
    };

    const handlePrevStep = () => {
        // Logic to go back to the previous step
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const isLastStep = currentStep === 3; // Set the last step index according to your design

    const handleInputChange = (name, value) => {
        // Update the input values using state
        setInputValues((prevInputValues) => ({
            ...prevInputValues,
            [name]: value,
        }));
    };

    return (
        <SafeAreaView style={{ padding: 20 }}>
            <View style={{ alignItems: 'center' }}>
                <Logo width={100} height={100} />
            </View>
            <Text style={{ fontWeight: 'bold', textAlign: 'center', marginVertical: 20, fontSize: 20 }}>
                Sign Up
            </Text>

            {/* Conditionally render the form elements based on the current step */}
            {currentStep === 0 && (
                <View>
                    <FormInput
                        name="email"
                        label="Email"
                        value={inputValues.email}
                        onChange={(value) => handleInputChange('email', value)}
                        placeholder="Enter your email."
                        required={true}
                    />
                </View>
            )}

            {currentStep === 1 && (
                <View>
                    <FormInput
                        name="otp"
                        label="OTP"
                        value={inputValues.otp}
                        onChange={(value) => handleInputChange('otp', value)}
                        placeholder="Enter your OTP."
                        required={true}
                        screenType={'signup'}
                    />
                </View>
            )}

            {currentStep === 2 && (
                <View>
                    <FormInput
                        name="password"
                        label="Password"
                        value={inputValues.password}
                        onChange={(value) => handleInputChange('password', value)}
                        placeholder="Enter your password."
                        required={true}
                    />
                    <FormInput
                        name="confirmPassword"
                        label="Confirm Password"
                        value={inputValues.confirmPassword}
                        onChange={(value) => handleInputChange('confirmPassword', value)}
                        placeholder="Confirm your password."
                        required={true}
                    />
                </View>
            )}

            {currentStep === 3 && (
                <View>
                    <FormInput
                        name="username"
                        label="Username"
                        value={inputValues.username}
                        onChange={(value) => handleInputChange('username', value)}
                        placeholder="Enter your username."
                        required={true}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <FormInput
                            name="firstName"
                            label="First Name"
                            value={inputValues.firstName}
                            onChange={(value) => handleInputChange('firstName', value)}
                            placeholder="Enter your first name."
                            required={true}
                        />
                        <FormInput
                            name="lastName"
                            label="Last Name"
                            value={inputValues.lastName}
                            onChange={(value) => handleInputChange('lastName', value)}
                            placeholder="Enter your last name."
                            required={true}
                        />
                    </View>
                    <FormInput
                        name="phoneNumber"
                        label="Phone Number"
                        value={inputValues.phoneNumber}
                        onChange={(value) => handleInputChange('phoneNumber', value)}
                        placeholder="Enter your phone number."
                        required={true}
                    />
                    <FormInput
                        name="dob"
                        label="Date of Birth"
                        value={inputValues.dob}
                        onChange={(value) => handleInputChange('dob', value)}
                        placeholder="Enter your date of birth."
                        required={true}
                    />
                </View>
            )}

            {/* Navigation buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {currentStep > 0 && (
                    <Button onPress={handlePrevStep} textColor="white" buttonColor="#2DABB1" className="w-auto">Previous</Button>
                )}
                {!isLastStep ? (
                    <Button onPress={handleNextStep} textColor="white" buttonColor="#2DABB1" className="w-10">Next</Button>
                ) : (
                    <Button onPress={
                        () => {
                            router.push("(auth)/subscriptions")
                        }
                    }
                            textColor="white" buttonColor="#2DABB1" className="w-10"
                    >Submit</Button>
                )}
            </View>
        </SafeAreaView>
    );
}
