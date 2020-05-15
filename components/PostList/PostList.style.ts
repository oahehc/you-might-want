import css from 'styled-jsx/css';
import * as vars from '@styles/vars';

export default css`
  .post__wrapper {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }

  .post__content {
    margin: 2rem 0;
    padding: 1.4rem;
    position: relative;
    font-size: 1.8rem;
    line-height: 2rem;
    box-shadow: 0 0 2px ${vars.grey5};

    > p {
      min-height: 1.2rem;
      line-height: 2rem;
    }
  }

  .post__time {
    position: absolute;
    bottom: 0;
    right: 0.4rem;
  }
`;
