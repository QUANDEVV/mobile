import React, {useContext, useEffect} from 'react'
import {Stack} from "expo-router";
import {useTheme} from '@react-navigation/native';
import {AuthContext} from "../../../shared/auth/context/auth";
import * as SecureStore from "expo-secure-store";

export default () => {
    return <Stack
        screenOptions={{
            headerShown: false,
        }}
    />
}