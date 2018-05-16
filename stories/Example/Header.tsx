import React, { ReactNode } from 'react';
import styled, { css } from 'react-emotion';

import { Header as AccordionHeader } from '../../src/Accordion';

type Props = {
  children: ReactNode;
};

const Heading = styled('h2')`
  margin: 0;
`;

export const buttonClassName = css`
  display: block;
  width: 100%;
  background: inherit;
  padding: 20px;
  border: none;
  font: inherit;
  text-align: left;

  :focus,
  :hover {
    background-color: #ddd;
  }
`;

const Header = ({ children }: Props) => (
  <AccordionHeader>
    {({ getButtonToggleProps }) => (
      <Heading>
        <button
          {...getButtonToggleProps({
            className: buttonClassName,
          })}
        >
          {children}
        </button>
      </Heading>
    )}
  </AccordionHeader>
);

export default Header;
