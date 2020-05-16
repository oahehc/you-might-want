import React, { createContext, useReducer, useContext } from 'react';
import { Modal, Button, RegisterInfo, MonetizationInfo } from '@components/index';

export enum Actions {
  ShowModal,
  CloseModal,
}

type ModalCategoryType = 'register' | 'monetization';

type StateType = {
  isShow: boolean;
  modalCategory?: ModalCategoryType;
};

export const initialState: StateType = {
  isShow: false,
};

type ActionType = {
  type: Actions;
  data?: ModalCategoryType;
};

export function reducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case Actions.ShowModal:
      return {
        isShow: true,
        modalCategory: action.data,
      };

    case Actions.CloseModal:
      return {
        isShow: false,
      };

    default:
      console.error('GlobalModal: action type not exist', action);
      return state;
  }
}

const GlobalModalContext = createContext({
  state: initialState,
  showRegisterModal: () => {},
  showMonetizationModal: () => {},
  closeModal: () => {},
});

export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModalProvider: React.SFC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const showRegisterModal = () => {
    dispatch({ type: Actions.ShowModal, data: 'register' });
  };
  const showMonetizationModal = () => {
    dispatch({ type: Actions.ShowModal, data: 'monetization' });
  };
  const closeModal = () => {
    dispatch({ type: Actions.CloseModal });
  };

  return (
    <GlobalModalContext.Provider
      value={{
        state,
        showRegisterModal,
        showMonetizationModal,
        closeModal,
      }}
    >
      {children}
      <Modal width="500px" show={state.isShow}>
        {state.modalCategory === 'register' && <RegisterInfo closeModal={closeModal} />}
        {state.modalCategory === 'monetization' && <MonetizationInfo closeModal={closeModal} />}
      </Modal>
    </GlobalModalContext.Provider>
  );
};
