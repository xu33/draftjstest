/**
 * Decorator
 * 扫描contentBlock的内容
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { CompositeDecorator, Editor, EditorState } from 'draft-js';
class TweetEditorExample extends React.Component {
  constructor() {
    super();
    const compositeDecorator = new CompositeDecorator([
      {
        strategy: handleStrategy,
        component: HandleSpan
      },
      {
        strategy: hashtagStrategy,
        component: HashtagSpan
      },
      {
        strategy: percentStrategy,
        component: PercentSpan
      }
    ]);
    this.state = {
      editorState: EditorState.createEmpty(compositeDecorator)
    };
    this.focus = () => this.refs.editor.focus();
    this.onChange = editorState => this.setState({ editorState });
    this.logState = () => console.log(this.state.editorState.toJS());
  }
  render() {
    return (
      <div style={styles.root}>
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            ref="editor"
            spellCheck={true}
          />
        </div>
        <input
          onClick={this.logState}
          style={styles.button}
          type="button"
          value="Log State"
        />
      </div>
    );
  }
}

const HANDLE_REGEX = /\@[\w]+/g;
const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;
const PERCENT_REGEX = /\%[\w]+/g;
function handleStrategy(contentBlock, callback, contentState) {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
}
function hashtagStrategy(contentBlock, callback, contentState) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}
function percentStrategy(contentBlock, callback, contentState) {
  findWithRegex(PERCENT_REGEX, contentBlock, callback);
}
function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}
const HandleSpan = props => {
  return (
    <span style={styles.handle} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
};
const HashtagSpan = props => {
  return (
    <span style={styles.hashtag} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
};
const PercentSpan = props => {
  return (
    <span style={styles.percent} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
};
const styles = {
  root: {
    fontFamily: "'Helvetica', sans-serif",
    padding: 20,
    width: 600
  },
  editor: {
    border: '1px solid #ddd',
    cursor: 'text',
    fontSize: 16,
    minHeight: 40,
    padding: 10
  },
  button: {
    marginTop: 10,
    textAlign: 'center'
  },
  handle: {
    color: 'rgba(98, 177, 254, 1.0)',
    direction: 'ltr',
    unicodeBidi: 'bidi-override'
  },
  hashtag: {
    color: 'rgba(95, 184, 138, 1.0)'
  },
  percent: {
    color: '#FF0000'
  }
};
ReactDOM.render(<TweetEditorExample />, document.getElementById('target'));
