import { StyleSheet } from "react-native";


export const commonStyles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  confirmButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 4
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10.49,
    backgroundColor: '#ffffff',
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12

  },
  closeButtonView: {
    width: 50,
    height: 50,
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 999
  }
});