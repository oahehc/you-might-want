import css from 'styled-jsx/css';
import * as vars from '@styles/vars';

export const modalHeaderStyle = css`
  .modal__header {
    border-bottom: 1px solid ${vars.grey5};
    margin-bottom: 10px;
    padding-bottom: 5px;
    font-weight: 600;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
`;
export const modalFooterStyle = css`
  .modal__footer {
    border-top: 1px solid ${vars.grey5};
    margin-top: 10px;
    padding-top: 5px;
    display: flex;
    justify-content: space-between;
    align-items: stretch;

    :global(div) {
      display: flex;
    }

    :global(button + button) {
      margin-left: 10px;
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
      padding: 10px;
      line-height: 1.5em;
    }

    .modal__error {
      text-align: center;
      margin-bottom: 10px;

      :global(svg) {
        fill: ${vars.red};
        font-size: 36px;
      }
    }
  }
`;
