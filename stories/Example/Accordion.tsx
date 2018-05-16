import React, { ReactNode } from 'react';
import styled from 'react-emotion';

import ActualAccordion from '../../src/Accordion';

type Props = {
  children: ReactNode;
};

const Div = styled('div')`
  border: 1px solid #ddd;
  border-radius: 10px;
`;

const Accordion = ({ children }: Props) => (
  <ActualAccordion>{() => <Div>{children}</Div>}</ActualAccordion>
);

export default Accordion;
