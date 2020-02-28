import React, { Component, createContext, ReactNode } from 'react';

import { AccordionConsumer } from './Accordion';
import { noop } from './utils';

type Context = {
  sectionId: string;
  expanded: boolean;
  onToggle: (nextExpanded: boolean) => void;
};

const { Provider: SectionProvider, Consumer } = createContext<Context>({
  sectionId: '',
  expanded: false,
  onToggle: noop,
});

export const SectionConsumer = Consumer;

type RenderProps = {
  getSectionProps: (
    props?: { [key: string]: any },
  ) => {
    'data-accordion-id-type': string;
  };
  expanded: boolean;
};

type Props = {
  defaultExpanded?: boolean;
  expanded?: boolean;
  onToggle?: (nextExpanded: boolean) => void;
  children: (renderProps: RenderProps) => ReactNode;
};

const Section = ({ defaultExpanded, expanded, onToggle, children }: Props) => (
  <AccordionConsumer>
    {({ accordionId, addSection, removeSection, getNextSectionId }) => (
      <InternalSection
        accordionId={accordionId}
        onToggle={onToggle}
        defaultExpanded={defaultExpanded}
        addSection={addSection}
        removeSection={removeSection}
        expanded={expanded}
        getNextSectionId={getNextSectionId}
        children={children}
      />
    )}
  </AccordionConsumer>
);

type InternalSectionProps = Props & {
  accordionId: string;
  addSection: (
    sectionId: string,
    expandSection: () => void,
    collapseSection: () => void,
  ) => void;
  removeSection: (sectionId: string) => void;
  getNextSectionId: () => number;
};

type InternalSectionState = {
  id: string;
  expanded: boolean;
};

class InternalSection extends Component<
  InternalSectionProps,
  InternalSectionState
> {
  public static defaultProps = {
    defaultExpanded: false,
  };

  public state = {
    id: `${this.props.accordionId}-section-${this.props.getNextSectionId()}`,
    expanded: this.props.defaultExpanded as boolean,
  };

  public componentDidMount() {
    this.props.addSection(
      this.state.id,
      this.expandSection,
      this.collapseSection,
    );
  }

  public componentWillUnmount() {
    this.props.removeSection(this.state.id);
  }

  public render() {
    const { accordionId } = this.props;
    const expanded = this.getExpanded();

    return (
      <SectionProvider
        value={{
          sectionId: this.state.id,
          expanded,
          onToggle: this.handleToggle,
        }}
      >
        {this.props.children({
          getSectionProps: (props = {}) => {
            return {
              ...props,
              'data-accordion-id-type': `${accordionId}-section`,
            };
          },
          expanded,
        })}
      </SectionProvider>
    );
  }

  private getExpanded() {
    const { expanded } = this.props;

    return expanded != null ? expanded : this.state.expanded;
  }

  private expandSection = () => {
    if (!this.getExpanded()) {
      this.handleToggle(true);
    }
  };

  private collapseSection = () => {
    if (this.getExpanded()) {
      this.handleToggle(false);
    }
  };

  private handleToggle = (nextExpanded: boolean) => {
    const { onToggle } = this.props;

    if (onToggle) {
      onToggle(nextExpanded);
    }

    if (this.props.expanded == null) {
      this.setState({
        expanded: nextExpanded,
      });
    }
  };
}

export default Section;
