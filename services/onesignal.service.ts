// services/NotificationService.ts
import { authAPI } from '@/api/authAPI';
import { LogLevel, OneSignal } from 'react-native-onesignal';

export const intializeOneSignal = () => {

  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize("e22d044d-f575-43b7-be88-46f1b03291be")

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true).then(response => {
    console.log('OneSignal: requestPermission:', response);

  });

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', (event) => {
    console.log('OneSignal: notification clicked:', event);
  });




};


export const registerUserDeviceSubscription = () => {
  // get player id
  OneSignal.User.pushSubscription.getIdAsync().then(async (id) => {
    console.log('OneSignal: playerId:', id);
    try {
      if(!id) {
        return;
      }
      await authAPI.registerUserDevice({ device_id: String(id) });
    } catch (error) {
      console.log('Error: ', error);

    }
  });
}

export const unRegisterUserDeviceSubscription = async () => {
  // get player id
  return OneSignal.User.pushSubscription.getIdAsync().then(async (id) => {
    console.log('OneSignal: playerId:', id);
    try {

      await authAPI.unregisterUserDevice({ device_id: String(id) });
    } catch (error) {
      console.log('Error: ', error);

    }
  });
}
