import React, { ReactNode } from 'react';

import { AccordionConsumer } from './Accordion';
import { SectionConsumer } from './Section';

type PanelProps = {
  id: string;
  role: 'region' | undefined;
  'aria-labelledby': string;
  'aria-hidden': true | undefined;
  hidden: true | undefined;
};

type RenderProps = {
  expanded: boolean;
  getPanelProps: (props?: { [key: string]: any }) => PanelProps;
};

type Props = {
  children: (renderProps: RenderProps) => ReactNode;
};

const Panel = ({ children }: Props) => (
  <AccordionConsumer>
    {({ disableRegions }) => (
      <SectionConsumer>
        {({ sectionId, expanded }) =>
          children({
            expanded,
            getPanelProps: (props = {}) => ({
              ...props,
              id: `${sectionId}-panel`,
              role: disableRegions ? undefined : 'region',
              'aria-labelledby': `${sectionId}-header`,
              'aria-hidden': expanded ? undefined : true,
              hidden: expanded ? undefined : true,
            }),
          })
        }
      </SectionConsumer>
    )}
  </AccordionConsumer>
);

export default Panel;
