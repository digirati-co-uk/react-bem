import React, { Component } from 'react';
import createReactContext from 'create-react-context';

const defaultContext = {
  prefix: '',
  cssClassMap: {},
  blockMap: {},
};

const BemContext = createReactContext(defaultContext);

export class Theme extends Component {
  static defaultProps = Object.assign({}, defaultContext);

  render() {
    const { children, prefix, cssClassMap, blockMap } = this.props;
    return (
      <BemContext.Provider
        value={{
          prefix,
          cssClassMap,
          blockMap,
        }}
      >
        {children}
      </BemContext.Provider>
    );
  }
}

class BaseBem {
  modifier(modifier) {
    this.modifiers.push(modifier);
    return this;
  }

  getModifiers(bemCtx, filter) {
    return this.modifiers
      .filter(filter)
      .map(m => `${this.getName(bemCtx)}--${m}`);
  }

  getSingleClass = ({ cssClassMap, prefix }, className) => {
    const newClass = cssClassMap[className]
      ? cssClassMap[className]
      : className;

    return prefix + newClass;
  };

  getName(bemCtx) {
    const blockMap = bemCtx.blockMap || {};
    return blockMap[this.name] ? blockMap[this.name] : this.name;
  }

  getClasses(bemCtx, modifierClasses) {
    return [
      this.getSingleClass(bemCtx, this.getName(bemCtx)),
      ...modifierClasses.map(className =>
        this.getSingleClass(bemCtx, className)
      ),
      ,
    ];
  }

  asTag(name) {
    this.tagName = name;
    return this;
  }

  withProp(name, value) {
    this.defaultProps[name] = value;
    return this;
  }

  withProps(props) {
    Object.assign(this.defaultProps, props);
  }
}

class Element extends BaseBem {
  constructor(blockName, name) {
    super();
    this.name = blockName;
    this.elementName = name;
    this.modifiers = [];
    this.defaultProps = {};
    this.tagName = 'div';
  }

  getName(bemCtx) {
    const blockName = super.getName(bemCtx);
    return `${blockName}__${this.elementName}`;
  }
}

class Block extends BaseBem {
  constructor(name) {
    super();
    this.name = name;
    this.modifiers = [];
    this.defaultProps = {};
    this.tagName = 'div';
  }

  element(elementName) {
    return new Element(this.name, elementName);
  }
}

function componentFactory(blockOrElement) {
  return class ComponentFromFactory extends Component {
    render() {
      const { children, tagName, ...props } = this.props;
      return (
        <BemContext.Consumer>
          {bemCtx =>
            React.createElement(
              tagName || blockOrElement.tagName || 'div',
              {
                className: blockOrElement
                  .getClasses(
                    {
                      blockMap: bemCtx.blockMap || {},
                      cssClassMap: bemCtx.cssClassMap || {},
                      prefix: bemCtx.prefix || '',
                    },
                    blockOrElement.getModifiers(
                      bemCtx,
                      modifierName => props[modifierName]
                    )
                  )
                  .join(' '),
                ...blockOrElement.defaultProps,
                ...Object.keys(props).reduce((extraProps, propKey) => {
                  if (!blockOrElement.modifiers.indexOf(propKey) === -1) {
                    extraProps[propKey] = props[propKey];
                  }
                  return extraProps;
                }, {}),
              },
              children
            )
          }
        </BemContext.Consumer>
      );
    }
  };
}

function bem(blockName, creator, render) {
  const customBlock = new Block(blockName);
  const createdElements = creator(customBlock);
  const rootBlockName = Object.keys(createdElements)
    .filter(t => createdElements[t] instanceof Block)
    .pop();
  if (!rootBlockName) {
    throw new Error('You must pass the block into the creator.');
  }
  const createdElementComponents = Object.keys(createdElements).reduce(
    (acc, name) => {
      acc[name] = componentFactory(createdElements[name]);
      return acc;
    },
    {}
  );
  const MainComponent = render
    ? class WrappedMainComponent extends Component {
        render() {
          return render(createdElementComponents, this.props);
        }
      }
    : createdElementComponents[rootBlockName];
  return Object.keys(createdElementComponents).reduce(
    (MainComponentAcc, elementName) => {
      MainComponentAcc[elementName] = createdElementComponents[elementName];
      return MainComponentAcc;
    },
    MainComponent
  );
}

export default bem;
