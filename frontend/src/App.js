import './App.css';
import Select from "react-select";
import { useState, useRef } from 'react';
import axios from 'axios';
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
  const [loading, set_loading] = useState(false);
  const [input_language, set_input_language] = useState(language_options[0]);
  const [output_language, set_output_language] = useState(language_options[1]);
  const [code, set_code] = useState('');
  const [translated_code, set_translated_code] = useState('');

  // Create a ref to the hidden file input
  const file_input_ref = useRef(null);

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

  // Trigger file input when the upload button is clicked
  const handle_upload_click = () => {
    file_input_ref.current.click();
  };

  const handle_translate = async () => {
    if (!input_language) {
      alert('Please select a input language!');
      return;
    }
    if (!output_language) {
      alert('Please select a output language!');
      return;
    }
    if (!code) {
      alert('Please provide code to translate!');
      return;
    }

    set_loading(true); // Show loading state
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/translate-code/', {
        code: code,
        target_language: output_language.value,
      });

      set_translated_code(response.data.translated_code);
    } catch (error) {
      console.error('Error during translation:', error);
      alert('An error occurred while translating the code.');
    } finally {
      set_loading(false); // Hide loading state
    }
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
            <button onClick={handle_upload_click} className="upload_button">Upload</button>
          </div>
          {/* Hidden file input */}
          <input
            ref={file_input_ref}
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

      <button onClick={handle_translate}
        className="translate_button"
        disabled={loading}
      >
        {loading ? 'Translating...' : 'Translate'}
      </button>

    </div>
  );
}


export default App;
