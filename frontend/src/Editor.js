import './css/Editor.css';
import { useEffect,useState } from 'react';
import {ReactSession} from 'react-client-session';
import _ from 'lodash';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/keymap/sublime'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/anyword-hint';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import {Controlled as ControlledEditor} from 'react-codemirror2';


function Editor(props) {
  const {
    value,
    onChange
  }=props

  function handleChange(editor,data,value){
    editor.showHint({ completeSingle: false });
    onChange(value);
  }

  return (
    <div className='Editor'>
      <ControlledEditor 
        onBeforeChange={handleChange}
        value={value}
        className="Editor-wrapper"
        options={{
          lineWrapping:true,
          lint:true,
          mode: "javascript",
          theme:"eclipse",
          lineNumbers:true,
          keyMap:"sublime",
          smartIndent: true,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          autoCloseTags: true,
          matchBrackets: true,
          autoCloseBrackets: true,
          extraKeys: {
            'Ctrl-Space': 'autocomplete'
          }
        }}
      />
    </div>
  );
}

export default Editor;
