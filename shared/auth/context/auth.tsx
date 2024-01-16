import { createContext, ReactNode, useEffect, useState } from "react";
import { useMutation } from "react-query";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";
import {Login, User} from "../../../types/user";
import {login, sendOTP, verifyOTP} from "../../services/auth";

// Import your OTP-related functions and types here if needed

export interface IAuthContext {
    userDetails?: User;
    token?: string;
    isLoggedIn: boolean;
    isLoggingIn: boolean;
    isSendingOTP: boolean;
    isVerifyingOTP: boolean;
    otpError: string | null;
    sendOTP: (email: string) => void;
    onLogin: (email: string, password: string) => void;
    onOtpLogin: (otp: number) => void;
    onLogout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
    userDetails: undefined,
    token: undefined,
    isLoggedIn: false,
    isLoggingIn: false,
    isSendingOTP: false,
    isVerifyingOTP: false,
    otpError: null,
    sendOTP: (email: string) => {},
    onLogin: (email: string, password: string) => {},
    onOtpLogin: (otp: number) => {},
    onLogout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userDetails, setUserDetails] = useState<User | undefined>();
    const [token, setToken] = useState<string | undefined>();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
    const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false);
    const [isVerifyingOTP, setIsVerifyingOTP] = useState<boolean>(false);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [otpInput, setOtpInput] = useState<string>(""); // Input field for OTP

    const loginMutation = useMutation(
        (loginUser: Login) => login(loginUser),
        {
            onSuccess: credentials => {
                setIsLoggedIn(true);
                setUserDetails(credentials);
                setToken(credentials.token);
                router.push("(app)/home");
            },
            onSettled: () => {
                setIsLoggingIn(false);
            }
        }
    );

    const otpLoginMutation = useMutation(
        (otp: number) => verifyOTP(otp),
        {
            onSuccess: credentials => {
                setIsLoggedIn(true);
                setUserDetails(credentials);
                setToken(credentials.token);

                router.push("(app)/home");
            },
            onSettled: () => {
                setIsLoggingIn(false);
            }
        }
    );

    const sendOTPMutation = useMutation(
        (email: string) => sendOTP(email),
        {
            onSuccess: () => {
                setIsSendingOTP(false);
                setIsVerifyingOTP(true);
            },
            onError: (error) => {
                setOtpError(error.message);
                setIsSendingOTP(false);
            }
        })

    useEffect(() => {
        const loadToken = async () => {
            const isLoggedIn = await SecureStore.getItemAsync('isLoggedIn');
            const token = await SecureStore.getItemAsync('token');
            if (token && isLoggedIn === 'true') {
                setToken(token);
                setIsLoggedIn(true);
                if (isLoggedIn) {
                    router.replace("/");
                }
            } else {
                setIsLoggedIn(false);
            }
        };
        loadToken();
    }, []);

    const loginHandler = (email: string, password: string) => {
        setIsLoggedIn(true);
        loginMutation.mutate({email, password});
    }

    const sendOTPHandler = (email: string) => {
        setIsSendingOTP(true);
        sendOTPMutation.mutate(email);
    }

    const otpLoginHandler = (otp: number) => {
        setIsLoggedIn(true);
        otpLoginMutation.mutate(otp);
    }
    const logoutHandler = async () => {
        await SecureStore.deleteItemAsync('isLoggedIn');
        await SecureStore.deleteItemAsync('token');

        setUserDetails(undefined);
        setToken(undefined);
        setIsLoggedIn(false);
        router.replace("(auth)/signin");
    };

    return (
        <AuthContext.Provider
            value={{
                userDetails,
                token,
                isLoggingIn,
                isLoggedIn,
                isSendingOTP,
                isVerifyingOTP,
                otpError,
                sendOTP: sendOTPHandler,
                onOtpLogin: otpLoginHandler,
                onLogin: loginHandler,
                onLogout: logoutHandler,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
