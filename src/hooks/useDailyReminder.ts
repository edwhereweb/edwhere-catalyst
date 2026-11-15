import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useGetDailyQuery } from '@/store/api/gamificationApi';

const REMINDER_HOUR = 19;
const DAYS_AHEAD = 7;

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false })
});

/**
 * Schedules a 7 pm "Daily 5" reminder on this device for the next week. Re-run whenever the daily
 * state changes, so finishing today's Daily 5 moves the first reminder to tomorrow.
 * shortcut: local reminders only (no server push), upgrade when the LMS needs to message idle students.
 */
export function useDailyReminder(enabled: boolean) {
  const { data } = useGetDailyQuery(undefined, { skip: !enabled });
  const done = data?.done;

  useEffect(() => {
    if (!enabled || done === undefined) return;
    (async () => {
      try {
        const perm = await Notifications.getPermissionsAsync();
        const granted =
          perm.granted || (perm.canAskAgain && (await Notifications.requestPermissionsAsync()).granted);
        if (!granted) return;
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('reminders', {
            name: 'Daily reminders',
            importance: Notifications.AndroidImportance.DEFAULT
          });
        }
        await Notifications.cancelAllScheduledNotificationsAsync();
        const now = new Date();
        for (let i = 0; i < DAYS_AHEAD; i++) {
          const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, REMINDER_HOUR, 0, 0);
          if (at <= now || (i === 0 && done)) continue;
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Your Daily 5 is waiting',
              body: 'Five quick questions keep your streak and your squad going.'
            },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: 'reminders' }
          });
        }
      } catch {
        // Reminders are a convenience; never block the app.
      }
    })();
  }, [enabled, done]);
}
