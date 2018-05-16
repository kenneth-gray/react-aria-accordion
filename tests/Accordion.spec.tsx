import React, { Component, ReactNode, SFC } from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';

import Accordion, { Header, Panel, Section } from '../src/Accordion';

type TestAccordionProps = {
  accordionProps?: object;
  children?: ReactNode;
  [key: string]: any;
};
const TestAccordion: SFC<TestAccordionProps> = ({
  accordionProps = {},
  children,
  ...rest
}) => (
  <Accordion {...accordionProps}>
    {() => <div {...rest}>{children}</div>}
  </Accordion>
);

type TestSectionProps = {
  sectionProps?: object;
  children?: ReactNode;
  [key: string]: any;
};
const TestSection: SFC<TestSectionProps> = ({
  sectionProps = {},
  children,
  ...rest
}) => (
  <Section {...sectionProps}>
    {({ getSectionProps }) => <div {...getSectionProps(rest)}>{children}</div>}
  </Section>
);

type TestHeaderProps = {
  headerProps?: object;
  headingProps?: object;
  children?: ReactNode;
};
const TestHeader: SFC<TestHeaderProps> = ({
  headerProps = {},
  headingProps,
  children,
  ...rest
}) => (
  <Header {...headerProps}>
    {({ getHeadingProps, getElementToggleProps }) => (
      <div {...getHeadingProps(headingProps)}>
        <div {...getElementToggleProps(rest)}>{children}</div>
      </div>
    )}
  </Header>
);

type TestPanelProps = {
  panelProps?: object;
  children?: ReactNode;
  [key: string]: any;
};
const TestPanel: SFC<TestPanelProps> = ({
  panelProps = {},
  children,
  ...rest
}) => (
  <Panel {...panelProps}>
    {({ getPanelProps }) => <div {...getPanelProps(rest)}>{children}</div>}
  </Panel>
);

type Accordion1Props = {
  wrapHeaderNavigation?: boolean;
};

type Accordion1State = {
  showSection1: boolean;
  showSection2: boolean;
  showSection3: boolean;
  [key: string]: boolean;
};

class Accordion1 extends Component<Accordion1Props, Accordion1State> {
  public state = {
    showSection1: true,
    showSection2: true,
    showSection3: true,
  };

  public toggleSection(section: number) {
    const stateProp = `showSection${section}`;

    this.setState({
      [stateProp]: !this.state[stateProp],
    });
  }

  public render() {
    const { wrapHeaderNavigation } = this.props;
    const { showSection1, showSection2, showSection3 } = this.state;

    const ToggleButton = ({ section }: { section: number }) => (
      <button
        data-testid={`toggle-section-${section}`}
        onClick={() => this.toggleSection(section)}
      >
        Toggle section {section}
      </button>
    );

    return (
      <div>
        <TestAccordion accordionProps={{ wrapHeaderNavigation }}>
          {showSection1 && (
            <TestSection>
              <TestHeader data-testid="header-1">Header 1</TestHeader>
            </TestSection>
          )}
          {showSection2 && (
            <TestSection>
              <TestHeader data-testid="header-2">Header 2</TestHeader>
            </TestSection>
          )}
          {showSection3 && (
            <TestSection>
              <TestHeader data-testid="header-3">Header 3</TestHeader>
            </TestSection>
          )}
        </TestAccordion>
        <ToggleButton section={1} />
        <ToggleButton section={2} />
        <ToggleButton section={3} />
      </div>
    );
  }
}

describe('Accordion', () => {
  afterEach(cleanup);

  it('expands all sections on expandAllSections', () => {
    const { getByTestId } = render(
      <Accordion>
        {({ expandAllSections }) => (
          <div>
            <button data-testid="expand-button" onClick={expandAllSections}>
              Expand all sections
            </button>
            <Section defaultExpanded={false}>
              {({ expanded, getSectionProps }) => (
                <div
                  {...getSectionProps({
                    'data-testid': 'section1',
                    'data-expanded': expanded,
                  })}
                />
              )}
            </Section>
            <Section defaultExpanded={false}>
              {({ expanded, getSectionProps }) => (
                <div
                  {...getSectionProps({
                    'data-testid': 'section2',
                    'data-expanded': expanded,
                  })}
                />
              )}
            </Section>
          </div>
        )}
      </Accordion>,
    );

    const button = getByTestId('expand-button');
    const section1 = getByTestId('section1');
    const section2 = getByTestId('section2');

    fireEvent.click(button);

    expect(section1.dataset.expanded).toEqual('true');
    expect(section2.dataset.expanded).toEqual('true');

    // Check that the sections stay expanded
    fireEvent.click(button);

    expect(section1.dataset.expanded).toEqual('true');
    expect(section2.dataset.expanded).toEqual('true');
  });

  it('collapses all sections on collapseAllSections', () => {
    const { getByTestId } = render(
      <Accordion>
        {({ collapseAllSections }) => (
          <div>
            <button data-testid="collapse-button" onClick={collapseAllSections}>
              Collapse all sections
            </button>
            <Section defaultExpanded>
              {({ expanded, getSectionProps }) => (
                <div
                  {...getSectionProps({
                    'data-testid': 'section1',
                    'data-expanded': expanded,
                  })}
                />
              )}
            </Section>
            <Section defaultExpanded>
              {({ expanded, getSectionProps }) => (
                <div
                  {...getSectionProps({
                    'data-testid': 'section2',
                    'data-expanded': expanded,
                  })}
                />
              )}
            </Section>
          </div>
        )}
      </Accordion>,
    );

    const button = getByTestId('collapse-button');
    const section1 = getByTestId('section1');
    const section2 = getByTestId('section2');

    fireEvent.click(button);

    expect(section1.dataset.expanded).toEqual('false');
    expect(section2.dataset.expanded).toEqual('false');

    // Check that the sections stay collapsed
    fireEvent.click(button);

    expect(section1.dataset.expanded).toEqual('false');
    expect(section2.dataset.expanded).toEqual('false');
  });

  describe('Section', () => {
    it('defaults to collapsed', () => {
      let sectionExpanded = null;

      render(
        <TestAccordion>
          <Section>
            {({ expanded }) => {
              sectionExpanded = expanded;

              return null;
            }}
          </Section>
        </TestAccordion>,
      );

      expect(sectionExpanded).toBe(false);
    });

    it('can use defaultExpanded prop', () => {
      let sectionExpanded = null;

      render(
        <TestAccordion>
          <Section defaultExpanded>
            {({ expanded }) => {
              sectionExpanded = expanded;

              return null;
            }}
          </Section>
        </TestAccordion>,
      );

      expect(sectionExpanded).toBe(true);
    });

    it('can use expanded control prop', () => {
      let sectionExpanded = null;

      render(
        <TestAccordion>
          <Section expanded>
            {({ expanded }) => {
              sectionExpanded = expanded;

              return null;
            }}
          </Section>
        </TestAccordion>,
      );

      expect(sectionExpanded).toBe(true);
    });

    it('props get assigned correctly using getSectionProps', () => {
      const id = 'some-id';
      const { getByTestId } = render(
        <TestAccordion>
          <Section expanded>
            {({ getSectionProps }) => (
              <div
                {...getSectionProps({
                  id,
                  'data-testid': 'section',
                })}
              />
            )}
          </Section>
        </TestAccordion>,
      );

      const section = getByTestId('section');

      expect(section.getAttribute('id')).toBe(id);
    });

    it('getSectionProps can accept 0 arguments', () => {
      const { queryByTestId } = render(
        <TestAccordion>
          <Section>
            {({ getSectionProps }) => (
              <div {...getSectionProps()} data-testid="section" />
            )}
          </Section>
        </TestAccordion>,
      );

      expect(queryByTestId('section')).not.toBeNull();
    });

    it('calls onToggle with next expanded state', () => {
      const onToggle = jest.fn();

      const { getByTestId } = render(
        <TestAccordion>
          <TestSection sectionProps={{ defaultExpanded: true, onToggle }}>
            <TestHeader data-testid="header" />
          </TestSection>
        </TestAccordion>,
      );

      const header = getByTestId('header');
      fireEvent.click(header);

      expect(onToggle).toHaveBeenCalledWith(false);
    });

    it('onToggle not called when header is disabled', () => {
      const onToggle = jest.fn();

      const { getByTestId } = render(
        <TestAccordion>
          <TestSection sectionProps={{ onToggle }}>
            <TestHeader headerProps={{ disabled: true }} data-testid="header" />
          </TestSection>
        </TestAccordion>,
      );

      const header = getByTestId('header');
      fireEvent.click(header);

      expect(onToggle).not.toHaveBeenCalled();
    });

    it('getHeadingProps can accept arguments', () => {
      const { queryByTestId } = render(
        <TestAccordion>
          <TestSection>
            <Header>
              {({ getHeadingProps }) => (
                <div
                  {...getHeadingProps({
                    'data-testid': 'header',
                  })}
                />
              )}
            </Header>
          </TestSection>
        </TestAccordion>,
      );

      expect(queryByTestId('header')).not.toBeNull();
    });

    it('getElementToggleProps can accept 0 arguments', () => {
      const { queryByTestId } = render(
        <TestAccordion>
          <TestSection>
            <Header>
              {({ getElementToggleProps }) => (
                <div {...getElementToggleProps()} data-testid="header" />
              )}
            </Header>
          </TestSection>
        </TestAccordion>,
      );

      expect(queryByTestId('header')).not.toBeNull();
    });

    it('does not change expaned state when expanded is controlled', () => {
      const { getByTestId } = render(
        <TestAccordion>
          <Section expanded>
            {({ expanded, getSectionProps }) => (
              <div {...getSectionProps()}>
                <TestHeader data-testid="header" data-expanded={expanded} />
              </div>
            )}
          </Section>
        </TestAccordion>,
      );

      const header = getByTestId('header');
      fireEvent.click(header);

      expect(header.dataset.expanded).toEqual('true');
    });
  });

  describe('Header', () => {
    describe('key down behaviours', () => {
      it('when DOWN_ARROW is hit focus next header', () => {
        const { getByTestId } = render(<Accordion1 />);

        const firstHeader = getByTestId('header-1');
        const secondHeader = getByTestId('header-2');

        firstHeader.focus();
        fireEvent.keyDown(firstHeader, { key: 'ArrowDown' });

        expect(document.activeElement).toBe(secondHeader);
      });

      wrapHeaderNavigationDownFalseyTest(undefined);
      wrapHeaderNavigationDownFalseyTest(false);

      function wrapHeaderNavigationDownFalseyTest(
        wrapHeaderNavigation: false | undefined,
      ) {
        it(`when wrapHeaderNavigation is ${wrapHeaderNavigation}, DOWN_ARROW is hit and on last header do nothing`, () => {
          const { getByTestId } = render(
            <Accordion1 wrapHeaderNavigation={wrapHeaderNavigation} />,
          );

          const lastHeader = getByTestId('header-3');

          lastHeader.focus();
          fireEvent.keyDown(lastHeader, { key: 'ArrowDown' });

          expect(document.activeElement).toBe(lastHeader);
        });
      }

      it('when wrapHeaderNavigation is true, DOWN_ARROW is hit and on last header focus first header', () => {
        const { getByTestId } = render(<Accordion1 wrapHeaderNavigation />);

        const firstHeader = getByTestId('header-1');
        const lastHeader = getByTestId('header-3');

        lastHeader.focus();
        fireEvent.keyDown(lastHeader, { key: 'ArrowDown' });

        expect(document.activeElement).toBe(firstHeader);
      });

      it('when UP_ARROW is hit focus previous header', () => {
        const { getByTestId } = render(<Accordion1 />);

        const secondHeader = getByTestId('header-2');
        const thirdHeader = getByTestId('header-3');

        thirdHeader.focus();
        fireEvent.keyDown(thirdHeader, { key: 'ArrowUp' });

        expect(document.activeElement).toBe(secondHeader);
      });

      function wrapHeaderNavigationUpFalseyTest(
        wrapHeaderNavigation: false | undefined,
      ) {
        it(`when wrapHeaderNavigation is ${wrapHeaderNavigation}, UP_ARROW is hit and on first header do nothing`, () => {
          const { getByTestId } = render(
            <Accordion1 wrapHeaderNavigation={wrapHeaderNavigation} />,
          );

          const firstHeader = getByTestId('header-1');

          firstHeader.focus();
          fireEvent.keyDown(firstHeader, { key: 'ArrowUp' });

          expect(document.activeElement).toBe(firstHeader);
        });
      }

      wrapHeaderNavigationUpFalseyTest(undefined);
      wrapHeaderNavigationUpFalseyTest(false);

      it('when wrapHeaderNavigation is true, UP_ARROW is hit and on first header focus last header', () => {
        const { getByTestId } = render(<Accordion1 wrapHeaderNavigation />);

        const firstHeader = getByTestId('header-1');
        const thirdHeader = getByTestId('header-3');

        firstHeader.focus();
        fireEvent.keyDown(firstHeader, { key: 'ArrowUp' });

        expect(document.activeElement).toBe(thirdHeader);
      });

      it('when HOME is hit focus first header', () => {
        const { getByTestId } = render(<Accordion1 />);

        const firstHeader = getByTestId('header-1');
        const secondHeader = getByTestId('header-2');
        const thirdHeader = getByTestId('header-3');

        [secondHeader, thirdHeader].forEach(header => {
          header.focus();
          fireEvent.keyDown(header, { key: 'Home' });

          expect(document.activeElement).toBe(firstHeader);
        });
      });

      it('when END is hit focus last header', () => {
        const { getByTestId } = render(<Accordion1 />);

        const firstHeader = getByTestId('header-1');
        const secondHeader = getByTestId('header-2');
        const lastHeader = getByTestId('header-3');

        [firstHeader, secondHeader].forEach(header => {
          header.focus();
          fireEvent.keyDown(header, { key: 'End' });

          expect(document.activeElement).toBe(lastHeader);
        });
      });

      describe('when sections are removed or added', () => {
        it('updates last section correctly', () => {
          const { getByTestId, queryByTestId } = render(<Accordion1 />);

          expect(queryByTestId('header-3')).not.toBeNull();

          fireEvent.click(getByTestId('toggle-section-3'));

          const header = getByTestId('header-1');

          header.focus();
          fireEvent.keyDown(header, { key: 'End' });

          expect(document.activeElement).toBe(getByTestId('header-2'));

          fireEvent.click(getByTestId('toggle-section-3'));
          header.focus();
          fireEvent.keyDown(header, { key: 'End' });

          expect(document.activeElement).toBe(getByTestId('header-3'));
        });

        it('updates first section correctly', () => {
          const { getByTestId, queryByTestId } = render(<Accordion1 />);

          expect(queryByTestId('header-1')).not.toBeNull();

          fireEvent.click(getByTestId('toggle-section-1'));

          const header = getByTestId('header-3');

          header.focus();
          fireEvent.keyDown(header, { key: 'Home' });

          expect(document.activeElement).toBe(getByTestId('header-2'));

          fireEvent.click(getByTestId('toggle-section-1'));
          header.focus();
          fireEvent.keyDown(header, { key: 'Home' });

          expect(document.activeElement).toBe(getByTestId('header-1'));
        });

        it('updates a middle section correctly', () => {
          const { getByTestId, queryByTestId } = render(<Accordion1 />);

          let header;

          expect(queryByTestId('header-2')).not.toBeNull();

          fireEvent.click(getByTestId('toggle-section-2'));
          header = getByTestId('header-1');
          header.focus();
          fireEvent.keyDown(header, { key: 'ArrowDown' });

          expect(document.activeElement).toBe(getByTestId('header-3'));

          fireEvent.click(getByTestId('toggle-section-2'));
          header = getByTestId('header-3');
          header.focus();
          fireEvent.keyDown(header, { key: 'ArrowUp' });

          expect(document.activeElement).toBe(getByTestId('header-2'));
        });
      });
    });

    it('toggles expanded property', () => {
      const { getByTestId } = render(
        <TestAccordion>
          <Section>
            {({ getSectionProps, expanded: sectionExpanded }) => (
              <div
                {...getSectionProps({
                  'data-testid': 'section',
                  'data-expanded': sectionExpanded,
                })}
              >
                <Header>
                  {({ getElementToggleProps, expanded: headerExpanded }) => (
                    <div
                      {...getElementToggleProps({
                        'data-testid': 'header',
                        'data-expanded': headerExpanded,
                      })}
                    />
                  )}
                </Header>
              </div>
            )}
          </Section>
        </TestAccordion>,
      );

      const section = getByTestId('section');
      const header = getByTestId('header');

      expect(section.dataset.expanded).toEqual('false');
      expect(header.dataset.expanded).toEqual('false');

      fireEvent.click(header);

      expect(section.dataset.expanded).toEqual('true');
      expect(header.dataset.expanded).toEqual('true');

      header.focus();

      fireEvent.keyPress(header, { key: 'Enter', keyCode: 13 });

      expect(section.dataset.expanded).toEqual('false');
      expect(header.dataset.expanded).toEqual('false');

      // keyCode 13 is the only keyPress firing
      fireEvent.keyPress(header, { key: ' ', keyCode: 13 });

      expect(section.dataset.expanded).toEqual('true');
      expect(header.dataset.expanded).toEqual('true');
    });

    it('does not toggle expanded property if keypress is not ENTER or SPACE', () => {
      const { getByTestId } = render(
        <TestAccordion>
          <Section>
            {({ getSectionProps, expanded: sectionExpanded }) => (
              <div
                {...getSectionProps({
                  'data-testid': 'section',
                  'data-expanded': sectionExpanded,
                })}
              >
                <Header>
                  {({ getElementToggleProps, expanded: headerExpanded }) => (
                    <div
                      {...getElementToggleProps({
                        'data-testid': 'header',
                        'data-expanded': headerExpanded,
                      })}
                    />
                  )}
                </Header>
              </div>
            )}
          </Section>
        </TestAccordion>,
      );

      const section = getByTestId('section');
      const header = getByTestId('header');

      expect(section.dataset.expanded).toEqual('false');
      expect(header.dataset.expanded).toEqual('false');

      // keyCode 13 is the only keyPress firing
      fireEvent.keyPress(header, { key: 'A', keyCode: 13 });

      expect(section.dataset.expanded).toEqual('false');
      expect(header.dataset.expanded).toEqual('false');
    });

    describe('getElementToggleProps', () => {
      it('adds correct role and tabIndex', () => {
        const { getByTestId } = render(
          <TestAccordion>
            <TestSection>
              <Header>
                {({ getElementToggleProps }) => (
                  <div {...getElementToggleProps()} data-testid="header" />
                )}
              </Header>
            </TestSection>
          </TestAccordion>,
        );

        const header = getByTestId('header');

        expect(header.getAttribute('role')).toEqual('button');
        expect(header.getAttribute('tabIndex')).toEqual('0');
      });
    });

    describe('getButtonToggleProps', () => {
      it('adds disabled property when header is disabled', () => {
        const { getByTestId } = render(
          <TestAccordion>
            <TestSection>
              <Header disabled>
                {({ getButtonToggleProps }) => (
                  <div
                    {...getButtonToggleProps({
                      'data-testid': 'header',
                    })}
                  />
                )}
              </Header>
            </TestSection>
          </TestAccordion>,
        );

        const header = getByTestId('header');

        expect(header.hasAttribute('disabled')).toBe(true);
      });

      it('can be called without arguments', () => {
        const { getByTestId } = render(
          <TestAccordion>
            <TestSection>
              <Header>
                {({ getButtonToggleProps }) => (
                  <div {...getButtonToggleProps()} data-testid="header" />
                )}
              </Header>
            </TestSection>
          </TestAccordion>,
        );

        const header = getByTestId('header');

        expect(header).not.toBeNull();
      });
    });
  });

  describe('Panel', () => {
    describe('role', () => {
      it('is set to region when there are 6 or less panels', () => {
        const { getByTestId } = render(
          <TestAccordion>
            <TestSection>
              <TestPanel data-testid="panel" />
            </TestSection>
            <TestSection>
              <TestPanel />
            </TestSection>
            <TestSection>
              <TestPanel />
            </TestSection>
            <TestSection>
              <TestPanel />
            </TestSection>
            <TestSection>
              <TestPanel />
            </TestSection>
            <TestSection>
              <TestPanel />
            </TestSection>
          </TestAccordion>,
        );

        const panel = getByTestId('panel');

        expect(panel.getAttribute('role')).toBe('region');
      });

      it('is not set to region when there are more than 6 panels', () => {
        const { getByTestId } = render(
          <TestAccordion>
            <TestSection>
              <TestPanel data-testid="panel" />
            </TestSection>
            <TestSection>
              <TestPanel />
            </TestSection>
            <TestSection>
              <TestPanel />
            </TestSection>
            <TestSection>
              <TestPanel />
            </TestSection>
            <TestSection>
              <TestPanel />
            </TestSection>
            <TestSection>
              <TestPanel />
            </TestSection>
            <TestSection>
              <TestPanel />
            </TestSection>
          </TestAccordion>,
        );

        const panel = getByTestId('panel');

        expect(panel.getAttribute('role')).toBeNull();
      });
    });

    it('gets expanded from section', () => {
      let panelExpanded = null;

      render(
        <TestAccordion>
          <TestSection sectionProps={{ expanded: true }}>
            <Panel>
              {({ expanded }) => {
                panelExpanded = expanded;

                return null;
              }}
            </Panel>
          </TestSection>
        </TestAccordion>,
      );

      expect(panelExpanded).toBe(true);
    });

    panelHiddenTests('aria-hidden');
    panelHiddenTests('hidden');

    function panelHiddenTests(hiddenAttribute: 'aria-hidden' | 'hidden') {
      describe(hiddenAttribute, () => {
        const TestAccordion2 = ({ expanded }: { expanded: boolean }) => (
          <TestAccordion>
            <TestSection sectionProps={{ expanded }}>
              <TestPanel data-testid="panel" />
            </TestSection>
          </TestAccordion>
        );

        it('is not set when section is expanded', () => {
          const { getByTestId } = render(<TestAccordion2 expanded />);

          const panel = getByTestId('panel');

          expect(panel.getAttribute(hiddenAttribute)).toBeNull();
        });

        it('is set when section is collapsed', () => {
          const { getByTestId } = render(<TestAccordion2 expanded={false} />);

          const panel = getByTestId('panel');

          expect(panel.getAttribute(hiddenAttribute)).toEqual(
            hiddenAttribute === 'aria-hidden' ? 'true' : '',
          );
        });
      });
    }

    it('getPanelProps can accept 0 arguments', () => {
      const { queryByTestId } = render(
        <TestAccordion>
          <TestSection>
            <Panel>
              {({ getPanelProps }) => (
                <div {...getPanelProps()} data-testid="panel" />
              )}
            </Panel>
          </TestSection>
        </TestAccordion>,
      );

      expect(queryByTestId('panel')).not.toBeNull();
    });
  });

  describe('Header and Panel connections', () => {
    let getByTestId: Function; // tslint:disable-line
    beforeEach(() => {
      const utils = render(
        <TestAccordion>
          <TestSection>
            <TestHeader data-testid="header" />
            <TestPanel data-testid="panel" />
          </TestSection>
        </TestAccordion>,
      );

      getByTestId = utils.getByTestId;
    });

    it('aria-labelledby on panel references header id', () => {
      const header = getByTestId('header');
      const panel = getByTestId('panel');

      expect(header.getAttribute('id')).toEqual(
        panel.getAttribute('aria-labelledby'),
      );
    });

    it('aria-controls on header references panel id', () => {
      const header = getByTestId('header');
      const panel = getByTestId('panel');

      expect(header.getAttribute('aria-controls')).toEqual(
        panel.getAttribute('id'),
      );
    });
  });
});
