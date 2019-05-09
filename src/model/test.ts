import { Test } from '../types';

export function createTest(id: string): Test {
  return {
    id,
    name: '',
    state: 'ready',
    status: 'no-run',
    lastRun: null,
    modified: null,
    component: '',
    area: '',
    steps: [
      {
        id: '1',
        description: '',
        result: '',
      },
    ],
  };
}
