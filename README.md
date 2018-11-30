# React BEM

A small library for creating React components using the [http://getbem.com/](BEM) methodology.

The React components created using this library are stateless and pure, they should be used in other stateful components. This allows the BEM components to be reused and also built in isolation.

## Creating BEM Blocks

There are 2 ways to create a block. The first is to define the individual elements, and use them individually in other components.

### Simple blocks

```jsx
const Header = bem('header', header => ({
  Header: header,
  Menu: header.element('menu'),
  MenuItem: header.element('menu-item').modifier('isSelected'),
  Logo: header.element('logo'),
}));
```

This definition will create 4 React components that can be used, and will have the appropriate BEM classes added.

```jsx
ReactDOM.render(
  <Header>
    <Header.Logo />
    <Header.Menu>
      <Header.MenuItem>Item 1</Header.MenuItem>
      <Header.MenuItem>Item 2</Header.MenuItem>
      <Header.MenuItem isSelected={true}>Item 3</Header.MenuItem>
    </Header.Menu>
  </Header>
);
```

Will render:

```html
<div class="header">
  <div class="header__logo"></div>
  <div class="header__menu">
    <div class="header__menu-item">Item 1</div>
    <div class="header__menu-item">Item 2</div>
    <div class="header__menu-item header__menu-item--selected">Item 3</div>
  </div>
</div>
```

### Specifying a structure

You can also specify a structure for a block, where a new component will be created that renders this structure. You have to manage the props yourself, just like any other component. Starting from the component we had above:

```jsx
const Header = bem(
  'header',
  header => ({
    Header: header,
    Menu: header.element('menu'),
    MenuItem: header.element('menu-item').modifier('isSelected'),
    Logo: header.element('logo'),
  }),
  ({ Header, Menu, MenuItem, Logo }, props) => (
    <Header>
      <Logo />
      <Menu>
        {props.menuItems.map((menuItem, key) => (
          <MenuItem
            key={key}
            isSelected={menuItem === props.selectedItem}
          >
            {menuItem}
          </MenuItem>
        ))}
      </Menu>
    </Header>
  )
);
```

With this structure you can map simple props to values inside of the components. To replciate the HTML from the first example you can simply:

```jsx
ReactDOM.render(
  <Header menuItems={['Item 1', 'Item 2', 'Item 3']} selectedItem="Item 3" />
);
```

## Customising blocks and elements

There are a few methods avaiable on the block that you can use to customise the underlying HTML element.

```jsx
const Header = bem('header', header => ({
  Header: header,
  Menu: header.element('menu').asTag('ul'),
  MenuItem: header
    .element('menu-item')
    .modifier('isSelected')
    .asTag('li'),
  Logo: header
    .element('logo')
    .asTag('img')
    .withProp('alt', 'Site logo'),
}));
```

Available methods:

```js
// Returns BEM element
element((elementName: string));

// Sets modifier, will add the BEM modifier when a matching prop is passed to the component.
modifier((bemModifier: string));

// Adds static prop/html attribute
withProp((propName: string), (propValue: any));

// Set multiple props e.g. withProps({ alt: 'some alt tag' })
withProps(props);

// Changes HTML tag (default: div)
asTag((htmlTag: string));
```

## Themes

Using React 16.3s new context API, there is a theme API for any components that use BEM classes. Taking our first simple example, we can customise the block names, class names or simply add a prefix for all components, not matter how nested by wrapping in a Theme component.

```jsx
import bem, { Theme } from 'react-bem';

const Header = bem('header', header => ({
  Header: header,
  Menu: header.element('menu'),
  MenuItem: header.element('menu-item').modifier('isSelected'),
  Logo: header.element('logo'),
}));

ReactDOM.render(
  <div>
    <Header.Logo />
    <Theme prefix="custom-">
      <Header.Logo />
    </Theme>
    <Theme blockMap={{ header: 'header-alternate' }}>
      <Header.Logo />
    </Theme>
    <Theme classMap={{ header__logo: 'not-even-bem' }}>
      <Header.Logo />
    </Theme>
    <Theme prefix="custom-" classMap={{ header__logo: 'not-even-bem' }}>
      <Header.Logo />
    </Theme>
  </div>
);
```

This will render:

```html
<div>
  <div class="header__logo"></div>
  <div class="custom-header__logo"></div>
  <div class="header-alternate__logo"></div>
  <div class="not-even-bem"></div>
  <div class="custom-not-even-bem"></div>
</div>
```

You can mix and match as you need. This can be put at the root of your project and all components in your projects will be configured from that Theme. Themes can also be nested, so you can separate individual pieces of your application with its own Themes. This makes BEM a lot more flexible, especially when you want to share components across various projects.

**Copyright 2018 Digirati Limited**

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
