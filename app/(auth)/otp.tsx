import React, { useContext } from 'react';
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../assets/proxima_logo.svg";
import { FormInput } from "../../shared/components";
import { Button } from "react-native-paper";
import {router} from "expo-router";
import {AuthContext} from "../../shared/auth/context/auth"; // Import your AuthProvider context

export default function Otp() {
    const { sendOTP, onOtpLogin, isSendingOTP, isVerifyingOTP, otpError } = useContext(AuthContext);

    const initialValues = {
        email: "",
        otp: 0,
    }

    const [currentStep, setCurrentStep] = React.useState(0);
    const [values, setValues] = React.useState({ ...initialValues });

    const handleNextStep = () => {
        if (currentStep === 0 && values.email !== "") {
            sendOTP(values.email); // Send OTP
            setCurrentStep(1);
        } else if (currentStep === 1 && values.otp !== "") {
            const otpValue = parseInt(String(values.otp), 10); // Convert OTP to a number
            onOtpLogin(otpValue);
            router.push("(app)/home");
        }
    }

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const isLastStep = currentStep === 1; // OTP verification is the last step

    const handleInputChange = (name, value) => {
        setValues((prevInputValues) => ({
            ...prevInputValues,
            [name]: value,
        }));
    };

    return (
        <SafeAreaView className="flex-1 justify- h-full p-5 w-screen">
            <View>
                <View className="items-center">
                    <Logo width={100} height={100} />
                </View>
                <Text className="font-bold w-full text-center my-5 text-2xl">OTP Login</Text>
            </View>

            <View>
                {currentStep === 0 && (
                    <View>
                        <View>
                            <Text className="text-center">Enter your email address to receive an OTP</Text>
                        </View>
                        <View>
                            <FormInput
                                name="email"
                                label="Email"
                                value={values.email}
                                onChange={(value) => handleInputChange('email', value)}
                                placeholder="Enter your email."
                                required={true}
                            />
                        </View>
                    </View>
                )}
                {currentStep === 1 && (
                    <View>
                        <FormInput
                            name="otp"
                            label="OTP"
                            value={values.otp.toString()}
                            onChange={(value) => handleInputChange('otp', value)}
                            placeholder="Enter your OTP."
                            required={true}
                            screenType={'login'}
                        />
                        {otpError && (
                            <Text className="text-red-500">{otpError}</Text>
                        )}
                    </View>
                )}
            </View>

            {/* Navigation buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {currentStep > 0 && (
                    <Button onPress={handlePrevStep} textColor="white" buttonColor="#2DABB1" className="w-auto">Previous</Button>
                )}
                {!isLastStep ? (
                    <Button onPress={handleNextStep} textColor="white" buttonColor="#2DABB1" className="w-10" disabled={isSendingOTP || isVerifyingOTP}>
                        {isSendingOTP ? 'Sending OTP...' : 'Next'}
                    </Button>
                ) : (
                    <Button onPress={() => router.push("/")} textColor="white" buttonColor="#2DABB1" className="w-10">
                        Submit
                    </Button>
                )}
            </View>
        </SafeAreaView>
    )
}
