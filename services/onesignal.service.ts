// services/NotificationService.ts
import { LogLevel, OneSignal } from 'react-native-onesignal';

export const intializeOneSignal = () => {

   // Remove this method to stop OneSignal Debugging
   OneSignal.Debug.setLogLevel(LogLevel.Verbose);

   // OneSignal Initialization
   OneSignal.initialize("1d12544a-bd54-440d-b316-27e21e248ba2");
 
   // requestPermission will show the native iOS or Android notification permission prompt.
   // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
   OneSignal.Notifications.requestPermission(true);
 
   // Method for listening for notification clicks
   OneSignal.Notifications.addEventListener('click', (event) => {
     console.log('OneSignal: notification clicked:', event);
   });

};
