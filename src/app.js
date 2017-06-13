import React from 'react';
import ReactDOM from 'react-dom';
import {
  Editor,
  EditorState,
  RichUtils,
  CompositeDecorator,
  convertToRaw,
  ContentState
} from 'draft-js';

class MyEditor extends React.Component {
  state = { editorState: EditorState.createEmpty() };
  onChange = editorState => this.setState({ editorState });

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  };

  undo = () => {
    console.log(this.state.editorState.getCurrentContent().toJS());
  };

  redo = () => {
    EditorState.redo();
  };

  render() {
    return (
      <div>
        <button onClick={this.onBoldClick}>加粗</button>
        <button onClick={this.undo}>撤销</button>
        <button onClick={this.redo}>重做</button>
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
      </div>
    );
  }
}

ReactDOM.render(<MyEditor />, document.getElementById('container'));
