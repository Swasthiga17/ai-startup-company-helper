/**
 * Helper to request browser Push Notification permissions and send desktop notifications.
 */

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('[Push Notification] Browser does not support Desktop Notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendPushNotification(title, body, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    console.log('[Push Notification In-App Only]', title, body);
    return;
  }

  try {
    const notification = new Notification(title, {
      body: body,
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: options.tag || 'idea-executor-notification',
      ...options,
    });

    notification.onclick = function () {
      window.focus();
      if (options.url) {
        window.location.href = options.url;
      }
    };
  } catch (err) {
    console.error('[Push Notification Error]', err);
  }
}
