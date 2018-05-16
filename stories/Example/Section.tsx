import React, { ReactNode } from 'react';
import { css } from 'react-emotion';

import { Section as AccordionSection } from '../../src/Accordion';
import { buttonClassName } from './Header';

type Props = {
  defaultExpanded?: boolean;
  children: ReactNode;
};

const className = css`
  :not(:first-child) {
    .${buttonClassName} {
      border-top: 1px solid #ddd;
    }
  }
`;

const Section = ({ defaultExpanded, children }: Props) => (
  <AccordionSection defaultExpanded={defaultExpanded}>
    {({ getSectionProps }) => (
      <div {...getSectionProps({ className })}>{children}</div>
    )}
  </AccordionSection>
);

export default Section;
