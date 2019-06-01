import { WorkspaceUser } from '../types';
import { auth } from '../firebase';
import { useEffect, useState } from 'react';
import { useWorkspaceUsers } from './workspace-users';
import { useAuthState } from 'react-firebase-hooks/auth';

export function useCurrentUser() {
  const [users] = useWorkspaceUsers();
  const { user: authUser, initialising } = useAuthState(auth);
  const [user, setUser] = useState<WorkspaceUser | undefined>();

  useEffect(() => {
    if (!initialising && users && !user) {
      const me = users.find(_user => _user.uid === authUser!.uid);

      if (me) {
        setUser(me);
      }
    }
  }, [users, initialising, user, authUser]);

  return user as WorkspaceUser;
}
