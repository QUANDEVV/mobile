import React, {ReactNode} from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {Text, View} from "react-native";
import Logo from "../../assets/proxima_logo.svg";

interface AppLayoutProps {
    children: ReactNode
    title?: string
}

export function AppLayout({children, title}: AppLayoutProps) {
    return (
        <SafeAreaView className="flex-1 p-5 w-screen">
            <View className="flex-row items-center">
                <Logo width={100} height={100}/>
            </View>
            <Text className="font-bold w-full text-center my-5 text-2xl">{title}</Text>


            <View className="px-5">
                {children}
            </View>
        </SafeAreaView>
    )
}