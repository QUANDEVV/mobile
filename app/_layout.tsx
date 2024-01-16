import {Slot} from "expo-router";
import {AuthProvider} from "../shared/auth/context/auth";
import {QueryClient, QueryClientProvider} from "react-query";
import {useFonts, SpaceGrotesk_300Light, SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold, SpaceGrotesk_600SemiBold} from "@expo-google-fonts/space-grotesk";
import * as SplashScreen from 'expo-splash-screen';
import {useCallback, useEffect, useState} from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Load fonts
                await SplashScreen.hideAsync();
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            // On layout, we need to un-hide the splash screen and then hide it
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    let [fontsLoaded, fontError] = useFonts({
        SpaceGrotesk_300Light,
        SpaceGrotesk_400Regular,
        SpaceGrotesk_500Medium,
        SpaceGrotesk_600SemiBold,
        SpaceGrotesk_700Bold,
    });

    if (!fontsLoaded && !fontError) return null;

    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Slot/>
            </AuthProvider>
        </QueryClientProvider>
    );
}