import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Snackbar as SnackbarPaper } from 'react-native-paper'

import { shapes } from '../theme/theme'

interface SnackbarProps {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  text: string
}

export const Snackbar = ({ text, visible, setVisible }: SnackbarProps) => {
  const onDismissSnackbar = () => setVisible(false)
  return (
    <View style={styles.container}>
      <SnackbarPaper
        visible={visible}
        onDismiss={onDismissSnackbar}
        action={{
          label: 'Dismiss',
          onPress: onDismissSnackbar,
        }}
        style={{ borderRadius: shapes.large }}
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
