import uuidv1 from 'uuid/v1';
import { TestSet } from '../types';

export function createTestSet(): TestSet {
  return {
    id: '',
    name: '',
    lastRun: null,
    status: {},
    tests: [],
    assignee: '',
    platform: '',
  };
}
