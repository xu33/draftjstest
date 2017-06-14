import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState, RichUtils } from 'draft-js';

const styles = {
  editor: {
    padding: '2px',
    border: '1px solid #ccc'
  }
};

class AddListExample extends React.Component {
  state = {
    editorState: EditorState.createEmpty()
  };

  onChange = editorState => this.setState({ editorState });

  addList = () => {
    const newState = RichUtils.toggleBlockType(
      this.state.editorState,
      'unordered-list-item'
    );
    this.setState({
      editorState: newState
    });
  };

  addOrderList = () => {
    const newState = RichUtils.toggleBlockType(
      this.state.editorState,
      'ordered-list-item'
    );

    this.setState({
      editorState: newState
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.addList}>无序列表</button>
        <button onClick={this.addOrderList}>有序列表</button>
        <div style={styles.editor}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<AddListExample />, document.getElementById('target'));
