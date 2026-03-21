import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, Snackbar as SnackbarPaper } from 'react-native-paper'

interface SnackbarProps {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  text: string
  onToggleSnackbar: () => void
}

export const Snackbar = ({ text, visible, setVisible, onToggleSnackbar }: SnackbarProps) => {
  const onDismissSnackbar = () => setVisible(false)
  return (
    <View style={styles.container}>
      <Button onPress={onToggleSnackbar}>{visible ? 'Hide' : 'Show'}</Button>
      <SnackbarPaper
        visible={visible}
        onDismiss={onDismissSnackbar}
        // action={{
        //   label: 'Dismiss',
        //   onPress: () => {
        //     // Do something
        //   },
        // }}
      >
        {text}
      </SnackbarPaper>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
})
