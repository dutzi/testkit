export interface Area {
  name: string;
  label: string;
}

export interface Component {
  name: string;
  label: string;
  areas: Area[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface WorkspaceUser {
  uid: string;
  role: string;
  email: string;
  displayName: string;
  photoUrl: string;
}

export interface Platform {
  id: string;
  name: string;
}

export interface Step {
  id: string;
  description: string;
  result: string;
}

export interface Test {
  id: string;
  name: string;
  state: string;
  status: string;
  lastRun: object | null;
  modified: object | null;
  component: string;
  area: string;
  steps: Step[];
}

export interface TestStatus {
  [testStepId: string]: {
    message: string;
    status: StepStatus;
  };
}

export type StepStatus = 'passed' | 'failed' | 'skipped' | undefined;

export interface TestSet {
  id: string;
  name: string;
  lastRun: any | null;
  status: {
    [testId: string]: TestStatus;
  };
  tests: string[];
  assignee: string;
  platform: string;
}
