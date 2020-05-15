import css from 'styled-jsx/css';
import * as vars from '@styles/vars';

export default css`
  button {
    border: 0.2rem solid ${vars.grey2};
    background-color: ${vars.grey2};
    color: ${vars.grey5};
    border-radius: 0.2rem;
    padding: 1rem 2rem;
    font-size: 1.6rem;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;

    :global(span) {
      color: ${vars.grey5};
    }
    :global(svg) {
      fill: ${vars.grey5};
    }

    :global(svg + span),
    :global(span + svg) {
      margin-left: 0.5rem;
    }

    &:hover {
      background-color: transparent;
      color: ${vars.grey2};

      :global(svg) {
        fill: ${vars.grey2};
      }
      :global(span) {
        color: ${vars.grey2};
      }
    }

    &:disabled {
      cursor: not-allowed;
    }

    &.invert {
      border: 2px solid ${vars.grey5};
      background-color: transparent;
      color: ${vars.grey3};

      :global(svg) {
        fill: ${vars.grey3};
      }
      :global(span) {
        color: ${vars.grey3};
      }

      &:hover {
        background-color: ${vars.grey5};
        color: ${vars.grey2};

        :global(svg) {
          fill: ${vars.grey2};
        }
        :global(span) {
          color: ${vars.grey2};
        }
      }
    }
  }
`;
