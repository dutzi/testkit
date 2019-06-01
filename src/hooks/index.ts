import { useContext, useState, useEffect } from 'react';
import { GlobalUserContext } from './../views/ContextProviders';
import { WorkspaceUser } from '../types';
import { getWorkspaceUsers } from '../data/workspace-users';

export function useUsers() {
  const globalUser = useContext(GlobalUserContext);
  const [users, setUsers] = useState<WorkspaceUser[]>([]);

  useEffect(() => {
    getWorkspaceUsers(globalUser.workspace).then(setUsers);
  }, [globalUser.workspace]);

  return users;
}

export function useIsMobile() {
  return window.innerWidth < 414;
}
