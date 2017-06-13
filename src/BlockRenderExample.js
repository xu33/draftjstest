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
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      showURLInput: false,
      url: '',
      urlType: ''
    };
    this.focus = () => this.refs.editor.focus();
    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };
    this.onChange = editorState => this.setState({ editorState });
    this.onURLChange = e => this.setState({ urlValue: e.target.value });
    this.addImage = this._addImage.bind(this);

    this.confirmMedia = this._confirmMedia.bind(this);
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.onURLInputKeyDown = this._onURLInputKeyDown.bind(this);
  }
  _handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }
  _confirmMedia(e) {
    e.preventDefault();
    const { editorState, urlValue, urlType } = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      urlType,
      'IMMUTABLE',
      { src: urlValue }
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
  }
  _onURLInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmMedia(e);
    }
  }
  _promptForMedia(type) {
    const { editorState } = this.state;
    this.setState(
      {
        showURLInput: true,
        urlValue: '',
        urlType: type
      },
      () => {
        setTimeout(() => this.refs.url.focus(), 0);
      }
    );
  }
  _addImage() {
    this._promptForMedia('image');
  }
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
        </div>
        {urlInput}
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            blockRendererFn={mediaBlockRenderer}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            placeholder="Enter some text..."
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
  return <img src={props.src} style={styles.media} />;
};

const Media = props => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src } = entity.getData();
  const type = entity.getType();
  let media;

  if (type === 'image') {
    media = <Image src={src} />;
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
