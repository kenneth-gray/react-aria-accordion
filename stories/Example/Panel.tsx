import React, { ReactNode } from 'react';
import styled from 'react-emotion';

import { Panel as AccordionPanel } from '../../src/Accordion';

type Props = {
  children: ReactNode;
};

const Div = styled('div')`
  padding: 20px;
  border-top: 1px solid #ddd;
`;

const Panel = ({ children }: Props) => (
  <AccordionPanel>
    {({ getPanelProps }) => <Div {...getPanelProps()}>{children}</Div>}
  </AccordionPanel>
);

export default Panel;
