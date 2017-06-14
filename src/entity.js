import React from 'react';
import { render } from 'react-dom';
import {
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  ContentState,
  Editor,
  EditorState
} from 'draft-js';

const styles = {
  root: {
    fontFamily: "'Helvetica', sans-serif",
    padding: 20,
    width: 600
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
  immutable: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    display: 'inline-block',
    padding: '2px',
    border: '1px solid #f00'
  },
  mutable: {
    backgroundColor: 'rgba(204, 204, 255, 1.0)',
    padding: '2px 0'
  },
  segmented: {
    backgroundColor: 'rgba(248, 222, 126, 1.0)',
    padding: '2px 0'
  }
};

const rawContent = {
  blocks: [
    {
      text: 'This is an "immutable" entity: 呵呵. Deleting any ' +
        'characters will delete the entire entity. Adding characters ' +
        'will remove the entity from the range.',
      type: 'unstyled',
      entityRanges: [
        { offset: 31, length: 1, key: 'aaa' },
        { offset: 35, length: 1, key: 'aaa' }
      ]
    }
  ],
  entityMap: {
    aaa: {
      type: 'TOKEN',
      mutability: 'IMMUTABLE'
    }
  }
};

function entityStrategy(contentBlock, callback, contentState) {
  console.log('contentBlock', contentBlock.toJS());
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();

    if (entityKey === null) {
      return false;
    }

    return contentState.getEntity(entityKey).getMutability() === 'IMMUTABLE';
  }, callback);
}

function getDecoratedStyle(mutability) {
  switch (mutability) {
    case 'IMMUTABLE':
      return styles.immutable;

    default:
      return null;
  }
}

const TokenSpan = props => {
  return (
    <span data-offset-key={props.offsetkey} style={styles.immutable}>
      {props.children}
    </span>
  );
};

class EntityEditorExample extends React.Component {
  constructor(props) {
    super(props);

    const decorator = new CompositeDecorator([
      {
        strategy: entityStrategy,
        component: TokenSpan
      }
    ]);

    const blocks = convertFromRaw(rawContent);

    this.state = {
      editorState: EditorState.createWithContent(blocks, decorator)
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = editorState => this.setState({ editorState });
    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };
  }

  render() {
    return (
      <div style={styles.root}>
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            ref="editor"
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

render(<EntityEditorExample />, document.getElementById('target'));
