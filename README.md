# React Aria Accordion

This accordion component aims to follow the guidelines set out in the [WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices/#accordion)
and uses the [render props](https://reactjs.org/docs/render-props.html) pattern to be as flexible
as possible.

It is purposefully missing the ability for a section to be auto collapsed on expanding another. Read [Design decisions](#design-decisions) for more information.

## Demo

[Demo](https://kenneth-gray.github.io/react-aria-accordion)

## Table of contents

- [Installation](#installation)
- [Example usage](#example-usage)
- [Using \<Header /> correctly](#using-header--correctly)
- [API](#api)
  - [\<Accordion />](#accordion-)
  - [\<Section />](#section-)
  - [\<Header />](#header-)
  - [\<Panel />](#panel-)
  - [initialiseForSsr](#initialiseforssr)
- [Design decisions](#design-decisions)
- [Technical decisions](#technical-decisions)
- [Contributors](#contributors)

## Installation

```
npm install react-aria-accordion
```

## Example usage

Given the flexible nature of the component it would be best to wrap each component and style them as is appropriate for your use case.

```jsx
// Accordion/Accordion
import Accordion from 'react-aria-accordion';

const MyAccordion = ({ children, ...rest }) => (
  <Accordion>
    {() => <div>{children}</div>}
  </Accordion>
);

export default MyAccordion;

// Accordion/Section
import { Section } from 'react-aria-accordion';

const MySection = ({ onToggle, defaultExpanded, children }) => (
  <Section onToggle={onToggle} defaultExpanded={defaultExpanded}>
    {({ getSectionProps }) => <div {...getSectionProps()}>{children}</div>}
  </Section>
);

export default MySection;

// Accordion/Header
import { Header } from 'react-aria-accordion';

// Using native html elements

const MyHeader = ({ title }) => (
  <Header>
    {({ getButtonToggleProps }) => (
      <h1>
        <button {...getButtonToggleProps()}>{title}</button>
      </h1>
    )}
  </Header>
);

// Using custom html elements

const MyHeader = ({ title }) => (
  <Header headingLevel={1}>
    {({ getHeadingProps, getElementToggleProps }) => (
      <div {...getHeadingProps()}>
        <div {...getElementToggleProps()}>{title}</div>
      </div>
    )}
  </Header>
);

export default Header;

// Accordion/Panel
import { Panel } from 'react-aria-accordion';

const MyPanel = ({ children }) => (
  <Panel>
    {({ getPanelProps }) => (
      <div {...getPanelProps()}>
        {children}
      </div>
    )}
  </Panel>
);

export default MyPanel;

// Accordion/index
export { default } from './Accordion';
export { default as Section } from './Section';
export { default as Header } from './Header';
export { default as Panel } from './Panel';
```

This would allow the following:

```jsx
import Accordion, { Section, Header, Panel } from './Accordion';

<Accordion>
  <Section
    defaultExpanded
    onToggle={
      (nextExpanded) => console.log(`First section is ${nextExpanded ? 'expanded' : 'collapsed'}`)
    }
  >
    <Header title="Names" />
    <Panel>
      {listOfNames}
    </Panel>
  </Section>
  <Section>
    <Header title="Contact details" />
    <Panel>
      {listOfContactDetails}
    </Panel>
  </Section>
  <Section>
    <Header title="Other" />
    <Panel>
      {other}
    </Panel>
  </Section>
</Accordion>
```

### Server Sider Rendering (SSR)

An additional `initialiseForSsr` function is required when using SSR so that the DOM matches when using client hydration:

```jsx
import { renderToString } from 'react-dom/server';
import { initialiseForSsr } from 'react-aria-accordion';

initialiseForSsr();
renderToString(<App />);

```

## Using \<Header /> correctly

The title for the accordion section must be wrapped in exactly one button and one heading. The following 2 examples offer the same semantics. Where possible use native html elements.

```jsx
const header = (
  <Header>
    {({ getButtonToggleProps }) => (
      <h2>
        <button {...getButtonToggleProps()}>Title</button>
      </h2>
    )}
  </Header>
);

const header = (
  <Header headingLevel={2}>
    {({ getHeadingProps, getElementToggleProps }) => (
      <div {...getHeadingProps()}>
        <div {...getElementToggleProps()}>Title</div>
      </div>
    )}
  </Header>
);
```

If you want to include a menu next to the title, then make sure the menu is not inside the heading element.

```jsx
const header = (
  <Header>
    {({ getButtonToggleProps }) => (
      <Fragment>
        <h2>
          <button {...getButtonToggleProps()}>Title</button>
        </h2>
        <Menu />
      </Fragment>
    )}
  </Header>
);
```

## API

### \<Accordion />

#### children

> `function({})` | _required_

This is called with an object.

| Property              | Type         | Description             |
|-----------------------|--------------|-------------------------|
| `expandAllSections`   | `function()` | Expands all sections.   |
| `collapseAllSections` | `function()` | Collapses all sections. |

### \<Section />

#### defaultExpanded

> `boolean` | defaults to `false`

This is the initial `expanded` value.

#### expanded

> `boolean` | **control prop**

#### onToggle

> `function(nextExpanded: boolean)` | defaults to `undefined`

#### children

> `function({})` | _required_

This is called with an object.

| Property          | Type                      | Description                                                   |
|-------------------|---------------------------|---------------------------------------------------------------|
| `getSectionProps` | `function(props: object)` | Returns the props you should apply to the element you render. |
| `expanded`        | `boolean`                 | The expanded state of the section.                            |

### \<Header />

#### disabled

> `boolean` | defaults to `false`

#### headingLevel

> `number` | defaults to `1`

#### children

> `function({})` | _required_

This is called with an object.

| Property                | Type                      | Description                                                                                      |
|-------------------------|---------------------------|--------------------------------------------------------------------------------------------------|
| `getHeadingProps`       | `function(props: object)` | Returns the props you should apply to the heading element you render when not using `<h# />`.    |
| `getButtonToggleProps`  | `function(props: object)` | Returns the props you should apply to the toggle element you render when using `<button />`.     |
| `getElementToggleProps` | `function(props: object)` | Returns the props you should apply to the toggle element you render when not using `<button />`. |
| `expanded`              | `boolean`                 | The expanded state of the section.                                                               |

### \<Panel />

#### children

> `function({})` | _required_

This is called with an object.

| Property        | Type                      | Description                                                   |
|-----------------|---------------------------|---------------------------------------------------------------|
| `getPanelProps` | `function(props: object)` | Returns the props you should apply to the element you render. |
| `expanded`      | `boolean`                 | The expanded state of the section.                            |

### initialiseForSsr

> `function()`

See [Server Side Rendering (SSR)](#server-sider-rendering-ssr) for more details.

## Design decisions

### No auto collapse behaviour

The aim of this component is to be used in projects to help developers feel confident they are
making their websites as accessible as possible using relevant aria-* properties.

Automatic collapsing of sections can disorientate some users, particularly if scroll behaviour is
also associated. For example, if a user is using magnification software they may not realise that
expanding one section has collapsed another.

Data presented within a section may be comparable with another, therefore having more than one
section expanded at a time may be a useful feature for your users.

Collapsing and expanding multiple sections manually may make your website difficult to use, so
this component provides the functionality to collapse and expand all sections at once. Given this
behaviour will need to be triggered by a user there are less usability concerns.

## Technical decisions

### Why expanded is available for Section, Header & Panel

The reason the same render prop is available is so that it's possible to wrap each component as
shown in [Example usage](#example-usage) without having to pass your own `expanded` prop to `Header`
and `Panel`.

### Using querySelectorAll in \<Accordion />

You may think that using a lifecycle method like `componentWillMount` in `<Section />` would
suffice, however it wouldn't cope with the following scenario:

```jsx
<Accordion>
  <Section>A</Section>
  {showSection ? <Section>B</Section> : null}
  <Section>C</Section>
</Accordion>
```

If `showSection` starts as `false` and switches to `true` later, then `componenetWillMount` will
fire for Section B, leaving the accordion no ability to know the ordering of the sections. Having
to manually specify the order of a `<Section />` would be a burden on the developer.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/10341832?v=4" width="100px;"/><br /><sub><b>Kenneth Gray</b></sub>](https://github.com/kenneth-gray)<br />[💻](https://github.com/kenneth-gray/react-aria-accordion/commits?author=kenneth-gray "Code") [📖](https://github.com/kenneth-gray/react-aria-accordion/commits?author=kenneth-gray "Documentation") [⚠️](https://github.com/kenneth-gray/react-aria-accordion/commits?author=kenneth-gray "Tests") [💡](#example-kenneth-gray "Examples") | [<img src="https://avatars0.githubusercontent.com/u/940749?v=4" width="100px;"/><br /><sub><b>Koji Wakayama</b></sub>](http://codersociety.com)<br />[💻](https://github.com/kenneth-gray/react-aria-accordion/commits?author=kojiwakayama "Code") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!
