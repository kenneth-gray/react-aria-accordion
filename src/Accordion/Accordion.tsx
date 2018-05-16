import React, {
  Component,
  createContext,
  KeyboardEvent,
  ReactNode,
} from 'react';

import { KeyboardEventListener } from './event-listeners';
import { ARROW_DOWN, ARROW_UP, END, HOME } from './keys';
import { noop } from './utils';

type Context = {
  accordionId: string;
  disableRegions: boolean;
  onHeaderKeyDown: KeyboardEventListener;
  addSection: (
    sectionId: string,
    expandSection: () => void,
    collapseSection: () => void,
  ) => void;
  removeSection: (sectionId: string) => void;
};

const { Provider: AccordionProvider, Consumer } = createContext<Context>({
  accordionId: '',
  disableRegions: false,
  onHeaderKeyDown: noop,
  addSection: noop,
  removeSection: noop,
});

export const AccordionConsumer = Consumer;

type RenderProps = {
  expandAllSections: () => void;
  collapseAllSections: () => void;
};

type Props = {
  wrapHeaderNavigation?: boolean;
  children: (renderProps: RenderProps) => ReactNode;
};

type State = {
  id: string;
  sections: Array<{
    id: string;
    expand: () => void;
    collapse: () => void;
  }>;
};

let accordionId = 1;

class Accordion extends Component<Props, State> {
  public state: State = {
    id: `accordion-${accordionId++}`,
    sections: [],
  };

  private domHeaders: HTMLElement[] = [];

  public componentDidMount() {
    this.setDomHeaders();
  }

  public componentDidUpdate() {
    this.setDomHeaders();
  }

  public render() {
    return (
      <AccordionProvider
        value={{
          accordionId: this.state.id,
          disableRegions: this.state.sections.length > 6,
          onHeaderKeyDown: this.handleHeaderKeyDown,
          addSection: this.addSection,
          removeSection: this.removeSection,
        }}
      >
        {this.props.children({
          collapseAllSections: this.collapseAllSections,
          expandAllSections: this.expandAllSections,
        })}
      </AccordionProvider>
    );
  }

  private expandAllSections = () => {
    this.state.sections.forEach(({ expand }) => expand());
  };

  private collapseAllSections = () => {
    this.state.sections.forEach(({ collapse }) => collapse());
  };

  private addSection = (
    sectionId: string,
    expand: () => void,
    collapse: () => void,
  ) => {
    this.setState(({ sections }) => ({
      sections: [...sections, { id: sectionId, expand, collapse }],
    }));
  };

  private removeSection = (sectionId: string) => {
    this.setState(({ sections }) => ({
      sections: sections.filter(({ id }) => id !== sectionId),
    }));
  };

  private setDomHeaders() {
    const elementList = document.querySelectorAll(
      `[data-accordion-id-type="${this.state.id}-header"]`,
    ) as NodeListOf<HTMLElement>;

    this.domHeaders = [].slice.call(elementList);
  }

  private focusFirstHeader() {
    return this.domHeaders[0].focus();
  }

  private focusLastHeader() {
    return this.domHeaders[this.domHeaders.length - 1].focus();
  }

  private focusNextHeader(currentIndex: number) {
    if (currentIndex === this.domHeaders.length - 1) {
      if (this.props.wrapHeaderNavigation) {
        this.focusFirstHeader();
      }

      return;
    }

    this.domHeaders[currentIndex + 1].focus();
  }

  private focusPreviousHeader(currentIndex: number) {
    if (currentIndex === 0) {
      if (this.props.wrapHeaderNavigation) {
        this.focusLastHeader();
      }

      return;
    }

    this.domHeaders[currentIndex - 1].focus();
  }

  private handleHeaderKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const { key, currentTarget: domHeader } = event;

    switch (key) {
      case ARROW_DOWN: {
        // Prevents ARROW_DOWN from scrolling the page
        event.preventDefault();
        const currentIndex = this.domHeaders.indexOf(domHeader);
        this.focusNextHeader(currentIndex);
        break;
      }
      case ARROW_UP: {
        // Prevents ARROW_UP from scrolling the page
        event.preventDefault();
        const currentIndex = this.domHeaders.indexOf(domHeader);
        this.focusPreviousHeader(currentIndex);
        break;
      }
      case HOME: {
        this.focusFirstHeader();
        break;
      }
      case END: {
        this.focusLastHeader();
        break;
      }
    }
  };
}

export default Accordion;
