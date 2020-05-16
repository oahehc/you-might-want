import css from 'styled-jsx/css';
import * as vars from '@styles/vars';

export default css`
  .wrapper {
    h2 {
      font-size: 2rem;
      margin: 1rem 0;
    }

    p {
      font-size: 1.6rem;
      line-height: 2rem;
      margin: 2rem 0;
    }

    img {
      margin-right: 1rem;
    }

    ul {
      list-style: disc;
      margin-left: 2rem;
      font-size: 1.4rem;
      line-height: 1.8rem;
    }

    a {
      cursor: pointer;
      color: ${vars.blue};
    }

    :global(svg) {
      margin-left: 0.5rem;
    }
  }
`;
