import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react';
import { Outlet } from 'react-router-dom';

type SelectionState = {
  scope: string | null;
  selectedKeys: Set<string>;
};

type IndividualSelectionContextValue = {
  selectedKeys: Set<string>;
  setSelectedKeys: Dispatch<SetStateAction<Set<string>>>;
  setSelectionScope: (scope: string) => void;
};

const IndividualSelectionContext = createContext<IndividualSelectionContextValue | null>(null);

export const IndividualSelectionProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<SelectionState>({
    scope: null,
    selectedKeys: new Set(),
  });

  const setSelectedKeys = useCallback<Dispatch<SetStateAction<Set<string>>>>((nextValue) => {
    setState((current) => {
      const selectedKeys = typeof nextValue === 'function' ? nextValue(current.selectedKeys) : nextValue;
      return selectedKeys === current.selectedKeys ? current : { ...current, selectedKeys };
    });
  }, []);

  const setSelectionScope = useCallback((scope: string) => {
    setState((current) => {
      if (current.scope === scope) {
        return current;
      }

      if (current.scope === null) {
        return { ...current, scope };
      }

      return { scope, selectedKeys: new Set() };
    });
  }, []);

  const value = useMemo(
    () => ({ selectedKeys: state.selectedKeys, setSelectedKeys, setSelectionScope }),
    [setSelectedKeys, setSelectionScope, state.selectedKeys]
  );

  return <IndividualSelectionContext.Provider value={value}>{children}</IndividualSelectionContext.Provider>;
};

export const IndividualSelectionLayout = () => (
  <IndividualSelectionProvider>
    <Outlet />
  </IndividualSelectionProvider>
);

export const useIndividualSelection = () => {
  const context = useContext(IndividualSelectionContext);
  if (!context) {
    throw new Error('useIndividualSelection must be used within IndividualSelectionProvider');
  }
  return context;
};
