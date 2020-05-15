import css from 'styled-jsx/css';
import * as vars from '@styles/vars';

export const modalHeaderStyle = css`
  .modal__header {
    border-bottom: 1px solid ${vars.grey5};
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    font-weight: 600;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
`;
export const modalFooterStyle = css`
  .modal__footer {
    border-top: 1px solid ${vars.grey5};
    margin-top: 1rem;
    padding-top: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: stretch;

    :global(div) {
      display: flex;
    }

    :global(button + button) {
      margin-left: 1rem;
    }
  }
`;

export default css`
  .modal__wrapper {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: ${vars.transparentGrey};
    display: none;
    z-index: ${vars.modalIndex};

    &.show {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal__body {
      max-height: 80vh;
      overflow: auto;
      background-color: ${vars.white};
      padding: 1rem;
      line-height: 1.5em;
    }

    .modal__error {
      text-align: center;
      margin-bottom: 1rem;

      :global(svg) {
        fill: ${vars.red};
        font-size: 3.6rem;
      }
    }
  }
`;
