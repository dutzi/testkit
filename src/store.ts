import { createStore, createTypedHooks } from 'easy-peasy';
import logger from 'redux-logger';
import model, { StoreModel } from './model';

const { useActions, useStore, useDispatch } = createTypedHooks<StoreModel>();

export { useActions, useDispatch, useStore };

const store = createStore<StoreModel>(model, {
  middleware: [logger],
});

export default store;
