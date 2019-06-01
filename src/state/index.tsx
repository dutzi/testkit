import React from 'react';

interface GlobalState {
  ui: {
    showSidebar: boolean;
  };
}

interface Action {
  type: 'initialize' | 'show-sidebar' | 'hide-sidebar';
  payload?: any;
}

const initialState = {
  ui: {
    showSidebar: false,
  },
};

const GlobalStateContext = React.createContext<GlobalState>(initialState);
const GlobalDispatchContext = React.createContext<
  React.Dispatch<Action> | undefined
>(undefined);

function globalReducer(state: GlobalState, action: Action) {
  switch (action.type) {
    case 'initialize':
      return state;
    case 'show-sidebar':
      return { ...state, ui: { ...state.ui, showSidebar: true } };
    case 'hide-sidebar':
      return { ...state, ui: { ...state.ui, showSidebar: false } };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function GlobalStateProvider({ children }: { children: React.ReactElement }) {
  const [state, dispatch] = React.useReducer(globalReducer, initialState);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
}

function useGlobalState() {
  const context = React.useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
}

function useGlobalDispatch() {
  const context = React.useContext(GlobalDispatchContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
}

function useGlobal(): [GlobalState, React.Dispatch<Action>] {
  return [useGlobalState(), useGlobalDispatch()];
}

export { GlobalStateProvider, useGlobal as useGlobalState };
