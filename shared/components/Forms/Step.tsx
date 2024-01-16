import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const Step = ({
                  children,
                  onChangeValue,
                  values,
                  currentIndex,
                  prevStep,
                  isLast,
                  onSubmit,
                  nextStep,
              }) => {
    return (
        <View style={styles.root}>
            {children({
                onChangeValue,
                values,
            })}
            <View style={styles.buttonWrapper}>
                <Button
                    title="Prev"
                    disabled={currentIndex === 0}
                    onPress={prevStep}
                />
                {isLast ? (
                    <Button title="Submit" onPress={onSubmit} />
                ) : (
                    <Button title="Next" onPress={nextStep} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    buttonWrapper: {
        flexDirection: 'row',
        height: 80,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});

export default Step;
