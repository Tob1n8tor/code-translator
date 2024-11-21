import './App.css';
import Select from "react-select";
import { useState, useRef } from 'react';
import 'prismjs';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript'; // For JS highlighting
import 'prismjs/components/prism-javascript'; // Import language support
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism.css'; // Optional: import Prism theme
import { EditorView } from '@codemirror/view';


const language_options = [
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'c#', label: 'C#' },
  { value: 'c++', label: 'C++' },
  { value: 'c', label: 'C' },
];

function App() {
  const [input_language, set_input_language] = useState(language_options[0]);
  const [output_language, set_output_language] = useState(language_options[1]);
  const [code, set_code] = useState('');
  const [translated_code, set_translated_code] = useState('');

  const fileInputRef = useRef(null);

  const handle_input_language_change = (selected_option) => {
    set_input_language(selected_option);
    // Create a ref to the hidden file input
  }

  const handle_output_language_change = (selected_option) => {
    set_output_language(selected_option);
  };

  const handle_switch_languages = () => {
    const temp = input_language;
    set_input_language(output_language);
    set_output_language(temp);
  };

  const handle_file_upload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => set_code(e.target.result);
      reader.readAsText(file);
    }
  };

  const handle_copy = () => {
    navigator.clipboard.writeText(translated_code).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const handle_download = () => {
    const blob = new Blob([translated_code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'translated_code.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handle_translate = () => {
    //set_translated_code(`${code}`);
    set_translated_code(`${code}`)
  };

  // Trigger file input when the upload button is clicked
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="app">
      <h2>Code Translator</h2>

      <div className="language_selection">
        <Select
          options={language_options}
          value={input_language}
          onChange={handle_input_language_change}
          placeholder="Select input language"
          className="language_dropdown"
        />
        <button onClick={handle_switch_languages} className="switch_button">⇄</button>
        <Select
          options={language_options}
          value={output_language}
          onChange={handle_output_language_change}
          placeholder="Select output language"
          className="language_dropdown"
        />
      </div>

      <div className="container">
        {/* Left Section (Code Input + Upload Button) */}
        <div className="code_section left_section">
          <CodeMirror
            value={code}
            height="500px"
            width='100'
            extensions={[javascript(),
            EditorView.theme({ '&.cm-editor': { textAlign: 'left' }, })
            ]}
            theme={'dark'}
            basicSetup={{ lineNumbers: true }}
            onChange={set_code}
            placeholder="Input your code here"
          />
          <div className="button_group">
            <button onClick={handleUploadClick} className="upload_button">Upload</button>
          </div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handle_file_upload}
            style={{ display: 'none' }}  // Hide the input
          />

        </div>

        {/* Right Section (Translated Code + Copy/Download Buttons) */}
        <div className="code_section right_section">
          <CodeMirror
            value={translated_code}
            height="500px"
            width='100'
            extensions={[javascript(),
            EditorView.theme({ '&.cm-editor': { textAlign: 'left' }, })
            ]}
            theme={'dark'}
            options={{
              lineNumbers: true,
            }}
            readOnly={true}
            placeholder="Translated code will appear here"

          />
          <div className="button_group">
            <button onClick={handle_copy} className="copy_button">Copy</button>
            <button onClick={handle_download} className="download_button">Download</button>
          </div>
        </div>

      </div>

      <button onClick={handle_translate} className="translate_button">Translate</button>
    </div>
  );
}


export default App;
