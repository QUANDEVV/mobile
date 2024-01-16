import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Pressable, Switch } from 'react-native';
import {router} from "expo-router";
import useStore from "../../shared/store";

export default function Subscriptions() {
    const [showFeatures, setShowFeatures] = useState(true);
    const [selectedQuota, setSelectedQuota] = useState('Monthly');
    const [tiersData, setTiersData] = useState([]); // State for storing the fetched tiers data
    const tiers = useStore(state => state.tiers)
    const setTiers = useStore(state => state.setTiers)
    const setSelectedTier = useStore(state => state.setSelectedTier)

    const fetchTiersData = async () => {
        try {
            const response = await fetch('https://gpt.proximaai.co/api/mobilepayment/tiers/');
            if (response.ok) {
                const data = await response.json();
                setTiersData(data);
                setTiers(data);
            } else {
                console.error('Failed to fetch tiers data');
            }
        } catch (error) {
            console.error('Error fetching tiers data:', error);
        }
    };

    console.log(tiers)

    useEffect(() => {
        // Fetch tiers data when the component mounts
        fetchTiersData();
    }, []);

    const priceQuotas = Array.from(
        new Set(tiersData.flatMap((tier) => tier.prices.map((price) => price.quota.name)))
    );

    const getPriceForQuota = (tier, quota) => {
        const price = tier.prices.find((p) => p.quota.name === quota);
        return price ? `$${price.amount}` : 'N/A';
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text className="text-center my-5 font-bold text-2xl">Subscriptions</Text>
            <View style={styles.switchContainer}>
                <Text>Show Features</Text>
                <Switch
                    value={showFeatures}
                    onValueChange={(value) => setShowFeatures(value)}
                />
            </View>
            <View style={styles.pickerContainer}>
                {priceQuotas.map((quota, index) => (
                    <Pressable
                        key={index}
                        style={({ pressed }) => [
                            styles.pickerItem,
                            selectedQuota === quota && { backgroundColor: '#2DABB1' },
                            pressed && { backgroundColor: '#2DABB1' },
                        ]}
                        onPress={() => {
                            setSelectedQuota(quota)
                            setSelectedTier(quota)
                        }}
                    >
                        <Text style={styles.pickerItemText}>{quota}</Text>
                    </Pressable>
                ))}
            </View>
            {tiersData.map((tier, index) => (
                <Pressable key={index} style={styles.tierContainer} onPress={
                    () => router.push({
                        pathname: "(auth)/payment",
                        params: {
                            tierData: tier,
                            selectedQuota,
                        },
                    })
                }>
                    <Text style={styles.tierName}>{tier.name}</Text>
                    {showFeatures && (
                        <View style={styles.featuresContainer}>
                            {tier.features.map((feature, featureIndex) => (
                                <Text key={featureIndex} style={styles.feature}>
                                    {feature.name}
                                </Text>
                            ))}
                        </View>
                    )}
                    <View style={styles.pricesContainer}>
                        <Text style={styles.price}>
                            {selectedQuota}: {getPriceForQuota(tier, selectedQuota)}
                        </Text>
                    </View>
                </Pressable>
            ))}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    pickerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    pickerItem: {
        padding: 8,
        borderRadius: 5,
        marginRight: 8,
        backgroundColor: '#E0E0E0',
    },
    pickerItemText: {
        fontSize: 16,
    },
    tierContainer: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2DABB1',
        borderRadius: 5,
        padding: 16,
    },
    tierName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    featuresContainer: {
        marginBottom: 8,
    },
    feature: {
        fontSize: 16,
    },
    pricesContainer: {},
    price: {
        fontSize: 14,
        color: '#2DABB1',
    },
});
