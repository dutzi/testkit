import workspace, { WorkspaceModel } from './workspace';
import currentUser, { CurrentUserModel } from './current-user';
import users, { UsersModel } from './users';
import tests, { TestsModel } from './tests';

export interface StoreModel {
  workspace: WorkspaceModel;
  currentUser: CurrentUserModel;
  users: UsersModel;
  tests: TestsModel;
}

const model: StoreModel = {
  workspace,
  currentUser,
  users,
  tests,
};

export default model;
