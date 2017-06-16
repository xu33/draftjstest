import React from 'react';
import ReactDOM from 'react-dom';
import {
  AtomicBlockUtils,
  Editor,
  EditorState,
  RichUtils,
  convertToRaw
} from 'draft-js';

class MediaEditorExample extends React.Component {
  state = {
    editorState: EditorState.createEmpty(),
    showURLInput: false,
    url: '',
    urlType: ''
  };

  focus = () => {
    this.refs.editor.focus();
  };

  logState = () => {
    const content = this.state.editorState.getCurrentContent();
    console.log(convertToRaw(content));
  };

  onChange = editorState => this.setState({ editorState });

  onURLChange = e => this.setState({ urlValue: e.target.value });

  addImage = () => {
    const { editorState, urlValue, urlType } = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      {
        src: 'https://pic3.zhimg.com/v2-f34265d5530a9861a3a02ff33d2aed46_r.jpg'
      }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });
    this.setState(
      {
        editorState: AtomicBlockUtils.insertAtomicBlock(
          newEditorState,
          entityKey,
          ' '
        ),
        showURLInput: false,
        urlValue: ''
      },
      () => {
        setTimeout(() => this.focus(), 0);
      }
    );
  };

  addDiv = e => {
    e.preventDefault();

    const { editorState } = this.state;
    // 获取contentState
    const contentState = editorState.getCurrentContent();
    // 创建新的entity
    const contentStateWithEntity = contentState.createEntity(
      'div',
      'IMMUTABLE',
      {
        style: {
          backgroundColor: '#EEE',
          width: 100,
          height: 100
        }
      }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });

    this.setState(
      {
        editorState: AtomicBlockUtils.insertAtomicBlock(
          newEditorState,
          entityKey,
          ' '
        )
      },
      () => {
        setTimeout(() => this.focus(), 0);
      }
    );
  };

  handleKeyCommand = command => {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  };

  onURLInputKeyDown = e => {
    if (e.which === 13) {
      this._confirmMedia(e);
    }
  };

  render() {
    let urlInput;
    if (this.state.showURLInput) {
      urlInput = (
        <div style={styles.urlInputContainer}>
          <input
            onChange={this.onURLChange}
            ref="url"
            style={styles.urlInput}
            type="text"
            value={this.state.urlValue}
            onKeyDown={this.onURLInputKeyDown}
          />
          <button onMouseDown={this.confirmMedia}>
            Confirm
          </button>
        </div>
      );
    }
    return (
      <div style={styles.root}>
        <div style={styles.buttons}>
          <button onMouseDown={this.addImage} style={{ marginRight: 10 }}>
            插入图片
          </button>
          <button style={{ marginRight: 10 }} onMouseDown={this.addDiv}>
            插入div
          </button>
        </div>
        {urlInput}
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            blockRendererFn={mediaBlockRenderer}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            ref="editor"
          />
        </div>
        <input
          onClick={this.logState}
          style={styles.button}
          type="button"
          value="打印contentState"
        />
      </div>
    );
  }
}

function mediaBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false
    };
  }
  return null;
}

const Image = props => {
  return (
    <div
      style={{
        border: '1px solid #eee',
        padding: 4
      }}
    >
      <img src={props.src} style={styles.media} />
    </div>
  );
};

const Media = props => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src, style } = entity.getData();
  const type = entity.getType();
  let media;

  if (type === 'image') {
    media = <Image src={src} />;
  } else if (type === 'div') {
    media = <div style={{ ...style }} />;
  }

  return media;
};

const styles = {
  root: {
    fontFamily: "'Georgia', serif",
    padding: 20,
    width: 600
  },
  buttons: {
    marginBottom: 10
  },
  urlInputContainer: {
    marginBottom: 10
  },
  urlInput: {
    fontFamily: "'Georgia', serif",
    marginRight: 10,
    padding: 3
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10
  },
  button: {
    marginTop: 10,
    textAlign: 'center'
  },
  media: {
    width: '100%'
  }
};

ReactDOM.render(<MediaEditorExample />, document.getElementById('target'));
