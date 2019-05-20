import uuidv1 from 'uuid/v1';
import { Test } from '../types';

export function createTest(id: string): Test {
  return {
    id,
    name: '',
    state: 'ready',
    status: 'skipped',
    lastRun: null,
    modified: null,
    component: '',
    area: '',
    steps: [
      {
        id: uuidv1(),
        description: '',
        result: '',
      },
    ],
  };
}
