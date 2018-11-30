import React, { Component } from 'react';
import { render } from 'react-dom';

import bem, { Theme } from '../../src/index';

const TestElement = bem(
  'test-element',
  block => ({
    Test: block,
    TestLeft: block.element('left'),
    TestRight: block.element('right').modifier('isOpen'),
  }),
  ({ Test, TestLeft, TestRight }, { renderLeft, isOpen }) => {
    return (
      <Test>
        <TestLeft>{renderLeft()}</TestLeft>
        <TestRight tagName="span" isOpen={isOpen}>
          Right side
        </TestRight>
      </Test>
    );
  }
);

const TestElement2 = bem('test-element-2', block => ({
  Test2: block,
  Left: block.element('left'),
  Right: block.element('right'),
}));

const TestForm = bem(
  'test-form',
  block => ({
    Form: block,
    TextBox: block
      .element('text-box')
      .asTag('input')
      .withProp('type', 'text'),
    TextArea: block.element('text-area').asTag('textarea'),
  }),
  ({ Form, TextBox, TextArea }, props) => (
    <Form>
      <TextBox />
      <TextArea />
    </Form>
  )
);

class ReallyNestedExample extends Component {
  render() {
    return (
      <div>
        <TestElement isOpen={true} renderLeft={() => <div>Left side</div>} />
      </div>
    );
  }
}

class Demo extends Component {
  render() {
    return (
      <div>
        <style>{`
        .test-element__right--isOpen {
          background: green;
        }
        .my-prefix-test-element__right--isOpen {
          background: blue;
        }
        .my-nested-prefix-test-element__right--isOpen {
          background: orange;
        }
        .my-really-nested-prefix-test-element__right--isOpen {
          background: pink;
        }
        .my-really-nested-prefix-completely-different {
          background: #000;
          color: #fff;
        }
        .renamed-block__right--isOpen {
          background:purple;
        }
      `}</style>
        <TestElement isOpen={true} renderLeft={() => <div>Left side</div>} />
        <Theme prefix="my-prefix-">
          <TestElement2>
            <TestElement2.Left>Left 2</TestElement2.Left>
            <TestElement2.Right>Right 2</TestElement2.Right>
          </TestElement2>
          <TestElement isOpen={true} renderLeft={() => <div>Left side</div>} />
          <Theme prefix="my-nested-prefix-">
            <TestElement
              isOpen={true}
              renderLeft={() => <div>Left side</div>}
            />
          </Theme>
          <Theme
            prefix="my-really-nested-prefix-"
            cssClassMap={{ 'test-element__left': 'completely-different' }}
          >
            <ReallyNestedExample />
          </Theme>
        </Theme>
        <Theme blockMap={{ 'test-element': 'renamed-block' }}>
          <TestElement isOpen={true} renderLeft={() => <div>Left side</div>} />
        </Theme>
        <TestForm />
      </div>
    );
  }
}

render(<Demo />, document.querySelector('#demo'));
