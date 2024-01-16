import React, {useContext, useEffect} from 'react';
import * as SecureStore from 'expo-secure-store';
import {AuthContext} from "../shared/auth/context/auth";
import {Redirect, useRootNavigationState, useRouter, useSegments} from "expo-router";
import {View, Text} from "react-native";

export default function Index() {
    const segments = useSegments();
    const router = useRouter();
    const { isLoggedIn} = useContext(AuthContext)
    const navigationState = useRootNavigationState();

    const token = SecureStore.getItemAsync("token");

    useEffect(() => {
        if(!navigationState?.key) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (!isLoggedIn && !inAuthGroup) {
            router.replace("(auth)/signin")
        } else if (isLoggedIn) {
            router.replace("(app)/home")
        }
    }, [isLoggedIn, segments, navigationState?.key]);

    if (!token) {
        return <Redirect href={"/signin"} />
    }

   return <View>{!navigationState?.key ? <Text>Loading...</Text>: <></>}</View>
}