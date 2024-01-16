import {Login, User} from "../../types/user";
import {BASE_URL} from "../constants";
import {post} from "./requests";
import * as SecureStore from 'expo-secure-store'


export const register = async (newUser: User) => {
    const {data: user} = await post<User>(
        `${BASE_URL}/auth/client`,
        newUser
    )

    return user;
}


export const login = async (loginUser: Login) => {
    try {
        const { data: credentials } = await post<Login>(
            `${BASE_URL}/auth/signin/`,
            loginUser
        );

        await SecureStore.setItemAsync('isLoggedIn', 'true');

        await SecureStore.setItemAsync('token', credentials.token);
        
        return credentials;
    } catch (error) {
        // Handle the error here
        console.error('Error during login:', error);

        // You can throw or return a custom error response if needed
        throw new Error('Login failed');
    }
};

// Function to send an OTP to the user's email
export const sendOTP = async (email: string) => {
    try {
        const response = await post<any>(
            `${BASE_URL}/auth/requestlogintoken/`, // Adjust the URL accordingly
            { email }
        );

        if (response.data && response.data.success) {
            // OTP sent successfully
            return true;
        } else {
            // Handle error if OTP sending fails
            console.error('Error sending OTP:', response.data);
            throw new Error('Failed to send OTP');
        }
    } catch (error) {
        // Handle the error here
        console.error('Error sending OTP:', error);
        throw new Error('Failed to send OTP');
    }
};

// Function to verify the OTP
export const verifyOTP = async (otp: number) => {
    try {
        const {data: credentials} = await post<any>(
            `${BASE_URL}/auth/tokenlogin/`, // Adjust the URL accordingly
            { token: otp }
        );

        await SecureStore.setItemAsync('isLoggedIn', 'true');

        await SecureStore.setItemAsync('token', credentials.token);

        return credentials;
    } catch (error) {
        // Handle the error here
        console.error('Error verifying OTP:', error);
        throw new Error('Failed to verify OTP');
    }
};