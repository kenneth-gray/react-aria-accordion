import React, { KeyboardEvent, ReactNode, SFC } from 'react';

import { AccordionConsumer } from './Accordion';
import { EventListener, KeyboardEventListener } from './event-listeners';
import { ENTER, SPACE } from './keys';
import { SectionConsumer } from './Section';
import { callAll } from './utils';

type HeadingProps = {
  'aria-level': number;
  role: 'heading';
};

type ToggleProps = {
  id: string;
  'aria-controls': string;
  'aria-disabled': boolean | undefined;
  'aria-expanded': boolean;
  'data-accordion-id-type': string;
  onClick: EventListener;
  onKeyDown: KeyboardEventListener;
};

type ElementToggleProps = ToggleProps & {
  onKeyPress: KeyboardEventListener;
  role: 'button';
  tabIndex: 0;
};
type ButtonToggleProps = ToggleProps & {
  disabled?: boolean;
};

type RenderProps = {
  expanded: boolean;
  getHeadingProps: (props?: { [key: string]: any }) => HeadingProps;
  getElementToggleProps: (props?: { [key: string]: any }) => ElementToggleProps;
  getButtonToggleProps: (props?: { [key: string]: any }) => ButtonToggleProps;
};

type Props = {
  disabled?: boolean;
  headingLevel?: number;
  children: (renderProps: RenderProps) => ReactNode;
};

const isClickKey = (key: string) => [ENTER, SPACE].includes(key);

const Header: SFC<Props> = ({ children, headingLevel, disabled }) => (
  <AccordionConsumer>
    {({ accordionId, onHeaderKeyDown }) => (
      <SectionConsumer>
        {({ sectionId, expanded, onToggle: sectionOnToggle }) => {
          const onToggle = () => {
            if (disabled) {
              return;
            }

            sectionOnToggle(!expanded);
          };

          const getToggleProps = (props: { [key: string]: any }) => {
            const { onClick, onKeyDown, ...rest } = props;

            return {
              ...rest,
              id: `${sectionId}-header`,
              'aria-controls': `${sectionId}-panel`,
              'aria-disabled': disabled == null ? undefined : disabled,
              'aria-expanded': expanded,
              'data-accordion-id-type': `${accordionId}-header`,
              onClick: callAll(onClick, onToggle),
              onKeyDown: callAll(onKeyDown, onHeaderKeyDown),
            };
          };

          return children({
            expanded,
            getHeadingProps: (props = {}) => ({
              ...props,
              'aria-level': headingLevel as number,
              role: 'heading',
            }),
            getElementToggleProps: (props = {}) => {
              const { onKeyPress, ...rest } = props;

              return {
                ...getToggleProps(rest),
                tabIndex: 0,
                role: 'button',
                onKeyPress: callAll(
                  onKeyPress,
                  (event: KeyboardEvent<HTMLElement>) => {
                    if (!isClickKey(event.key)) {
                      return;
                    }

                    onToggle();
                    // Prevents SPACE from scrolling the page
                    event.preventDefault();
                  },
                ),
              };
            },
            getButtonToggleProps: (props = {}) => {
              return {
                ...getToggleProps(props),
                disabled: disabled == null ? undefined : disabled,
              };
            },
          });
        }}
      </SectionConsumer>
    )}
  </AccordionConsumer>
);

Header.defaultProps = {
  headingLevel: 1,
};

export default Header;
