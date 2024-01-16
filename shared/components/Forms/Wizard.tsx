import React, { useState, useCallback } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import Step from './Step';

const Wizard = ({ children, initialValues }) => {
    const [index, setIndex] = useState(0);
    const [values, setValues] = useState({ ...initialValues });

    const nextStep = useCallback(() => {
        if (index !== React.Children.count(children) - 1) {
            setIndex((prevIndex) => prevIndex + 1);
        }
    }, [index, children]);

    const prevStep = useCallback(() => {
        if (index !== 0) {
            setIndex((prevIndex) => prevIndex - 1);
        }
    }, [index]);

    const onChangeValue = useCallback((name, value) => {
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }, []);

    const onSubmit = useCallback(() => {
        Alert.alert(JSON.stringify(values));
    }, [values]);

    return (
        <View style={{ flex: 1 }}>
            {React.Children.map(children, (el, childIndex) => {
                if (childIndex === index) {
                    return React.cloneElement(el, {
                        currentIndex: index,
                        nextStep,
                        prevStep,
                        isLast: index === React.Children.count(children) - 1,
                        onChangeValue,
                        values,
                        onSubmit,
                    });
                }

                return null;
            })}
        </View>
    );
};

Wizard.Step = Step; // Make the Step component accessible as a property of Wizard

export default Wizard;
