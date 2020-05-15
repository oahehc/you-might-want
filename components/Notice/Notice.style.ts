import css from 'styled-jsx/css';
import * as vars from '@styles/vars';

export default css`
  .notice {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .notice__success {
    color: ${vars.green};

    :global(svg) {
      fill: ${vars.green};
      margin-right: 0.5rem;
    }
  }

  .notice__info {
    color: ${vars.grey3};

    :global(svg) {
      fill: ${vars.grey3};
      margin-right: 0.5rem;
    }
  }

  .notice__warning {
    color: ${vars.orange};

    :global(svg) {
      fill: ${vars.orange};
      margin-right: 0.5rem;
    }
  }

  .notice__error {
    color: ${vars.red};

    :global(svg) {
      fill: ${vars.red};
      margin-right: 0.5rem;
    }
  }
`;
