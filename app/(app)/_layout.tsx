import {Stack} from "expo-router";
import {ReactNode} from "react";


export default function AppLayout({children}: { children: ReactNode }) {
    return <Stack
        screenOptions={{
            headerShown: false,
        }}
    />;
}