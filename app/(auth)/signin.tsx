import React, {useContext} from 'react';
import {Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {FormInput} from "../../shared/components";
import {Button} from "react-native-paper";
import {AuthContext} from "../../shared/auth/context/auth";
import Logo from '../../assets/proxima_logo.svg'
import {router} from "expo-router";

export default function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const {onLogin, isLoggedIn} = useContext(AuthContext)

    const handleLogin = () => {
        onLogin(email, password)

    }

    const handleSignUp = () => {
        router.push("(auth)/sign-up")
    }


    return (
        <SafeAreaView className="flex-1 justify-between h-full p-5 w-screen">

            <View>
                <View className="items-center">
                    <Logo width={100} height={100}/>
                </View>
                <Text className="font-bold w-full text-center my-5 text-2xl">Login</Text>

                <View>
                    <FormInput
                        name="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e)}
                        placeholder="Enter your email."
                        required={true}
                    />
                    <FormInput
                        name="pasword"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e)}
                        placeholder="Enter your secure password"
                        required={true}
                        secureTextEntry={true}
                    />


                    <Pressable clasName="">
                        <Text className="text-primary text-center my-5">Forgot Password?</Text>
                    </Pressable>

                    <View className="items-center space-y-5">
                        <Button
                            mode="contained"
                            className="w-full bg-primary"
                            onPress={handleLogin}>
                            Login
                        </Button>
                        <Text className="fotn-bold">or</Text>
                        <Button
                            mode="contained"
                            className="w-full bg-white"
                            onPress={() => router.push("(auth)/otp")}
                            style={{
                                borderStyle: "solid",
                                borderColor: "#2DABB1",
                                borderWidth: 2,
                                textSize: 12,
                                borderRadius: 50
                            }}
                            textColor="black"
                        >
                            Login with OTP
                        </Button>
                    </View>
                </View>

                <Pressable className="flex flex-row justify-center my-5"
                           onPress={handleSignUp}
                >
                    <Text className="text-primary">Don't have an account?</Text>
                    <Text className="text-gray-700 underline font-bold mx-2">Sign Up</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}