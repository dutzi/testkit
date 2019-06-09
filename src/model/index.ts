import workspace, { WorkspaceModel } from './workspace';
import currentUser, { CurrentUserModel } from './current-user';

export interface StoreModel {
  workspace: WorkspaceModel;
  currentUser: CurrentUserModel;
}

const model: StoreModel = {
  workspace,
  currentUser,
};

export default model;
