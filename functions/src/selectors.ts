import * as admin from 'firebase-admin';
import * as changeCase from 'change-case';

export function getDisplayName(user: admin.auth.UserRecord) {
  if (!user.displayName) {
    if (user.email) {
      return changeCase.title(user.email.split('@')[0]);
    } else {
      return '';
    }
  }

  return user.displayName;
}

export function getPhotoUrl(user: admin.auth.UserRecord) {
  if (!user.photoURL) {
    return '';
  }

  return user.photoURL;
}
