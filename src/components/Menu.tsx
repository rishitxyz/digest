import { Menu, useTheme } from 'react-native-paper'

import { fontSize, shapes } from '../theme/theme'

interface MenuActionProps {
  anchor: React.ReactNode
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  menuOptions: { title: string; onPress: () => void; icon?: string; disabled: boolean }[]
}

export const MenuAction = ({
  anchor,
  visible,
  setVisible,
  menuOptions,
  disabled,
}: MenuActionProps) => {
  const theme = useTheme()

  const closeMenu = () => setVisible(false)

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={anchor}
      contentStyle={{
        backgroundColor: theme.colors.surface,
        borderRadius: shapes.medium,
      }}
    >
      {menuOptions.map(({ title, onPress, icon }, index) => (
        <Menu.Item
          key={index}
          title={title}
          onPress={() => {
            onPress()
            closeMenu()
          }}
          leadingIcon={icon}
          titleStyle={{ color: theme.colors.onSurface, fontSize: fontSize.bodyMedium }}
          disabled={disabled}
        />
      ))}
    </Menu>
  )
}
