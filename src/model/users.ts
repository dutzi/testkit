import { Action, action, Listen, listen, thunk, Thunk } from 'easy-peasy';
import { Role, WorkspaceUser, InvitedWorkspaceUser } from '../types';
import { firestore, auth } from '../firebase';
import workspaceModel from './workspace';
import { StoreModel } from '.';

export type User = WorkspaceUser | InvitedWorkspaceUser;

export interface UsersModel {
  data?: User[];
  set: Action<UsersModel, User[]>;
  init: Thunk<UsersModel, string>;
  addUserAction: Action<UsersModel, User>;
  addUser: Thunk<UsersModel, string, any, StoreModel>;
  updateUserAction: Action<UsersModel, { id: string; user: Partial<User> }>;
  updateUser: Thunk<
    UsersModel,
    { id: string; user: Partial<User> },
    any,
    StoreModel
  >;
  deleteUserAction: Action<UsersModel, string>;
  deleteUser: Thunk<UsersModel, string, any, StoreModel>;
  listeners: Listen<UsersModel>;
}

export function getUserId(user: User) {
  if ('id' in user) {
    return user.id;
  } else if ('uid' in user) {
    return user.uid;
  }
}

const currentUser: UsersModel = {
  set: action((state, payload) => {
    state.data = payload;
  }),

  init: thunk(async (actions, payload) => {
    const workspace = payload;
    const users = await firestore
      .collection(`workspaces/${workspace}/users`)
      .get();

    actions.set(users.docs.map(userDoc => userDoc.data() as User));
  }),

  addUserAction: action((state, payload) => {
    state.data = state.data || [];
    state.data.push(payload);
  }),

  addUser: thunk(async (actions, payload, { getStoreState }) => {
    const workspaceId = getStoreState().workspace.id;
    const email = payload;

    actions.addUserAction({
      id: email,
      email,
      role: 'user',
    });

    const globalUsersCollectionRef = firestore.collection('/users');

    const usersCollectionRef = firestore.collection(
      `workspaces/${workspaceId}/users`,
    );

    await usersCollectionRef.add({
      id: email,
      email,
      role: 'user',
    });

    await globalUsersCollectionRef.add({
      email,
      workspace: workspaceId,
      isTemporaryUser: true,
    });
  }),

  updateUserAction: action((state, payload) => {
    if (state.data) {
      state.data = state.data.map(user => {
        if (getUserId(user) === payload.id) {
          return { ...user, ...payload.user };
        } else {
          return user;
        }
      });
    }
  }),

  updateUser: thunk(async (actions, payload, { getStoreState }) => {
    const workspaceId = getStoreState().workspace.id;
    const usersCollectionRef = firestore.collection(
      `workspaces/${workspaceId}/users`,
    );
    const usersCollection = await firestore
      .collection(`workspaces/${workspaceId}/users`)
      .get();

    actions.updateUserAction(payload);

    const doc = usersCollection.docs.find(
      doc => getUserId(doc.data() as User) === payload.id,
    );
    if (doc) {
      usersCollectionRef.doc(doc.id).update(payload.user);
    }
  }),

  deleteUserAction: action((state, payload) => {
    if (state.data) {
      state.data = state.data.filter(user => getUserId(user) !== payload);
    }
  }),

  deleteUser: thunk(async (actions, payload, { getStoreState }) => {
    const workspaceId = getStoreState().workspace.id;
    const userId = payload;

    actions.deleteUserAction(payload);

    const usersCollection = await firestore
      .collection(`workspaces/${workspaceId}/users`)
      .get();

    const doc = usersCollection.docs.find(
      doc => getUserId(doc.data() as User) === userId,
    );

    if (doc) {
      await firestore.doc(`workspaces/${workspaceId}/users/${doc.id}`).delete();
    }
  }),

  listeners: listen(on => {
    on(
      workspaceModel.setId,
      thunk((actions, payload) => {
        actions.init(payload);
      }),
    );
  }),
};

export default currentUser;
