import workspace, { WorkspaceModel } from './workspace';
import currentUser, { CurrentUserModel } from './current-user';
import users, { UsersModel } from './users';

export interface StoreModel {
  workspace: WorkspaceModel;
  currentUser: CurrentUserModel;
  users: UsersModel;
}

const model: StoreModel = {
  workspace,
  currentUser,
  users,
};

export default model;
