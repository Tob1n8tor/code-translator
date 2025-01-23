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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faCopy, faDownload } from '@fortawesome/free-solid-svg-icons';

// Language options for the dropdowns
const language_options = [
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'c++', label: 'C++' },
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

    if (output_language.value === 'java') {
      link.download = 'translated_code.java';
    }
    else if (output_language.value === 'python') {
      link.download = 'translated_code.py';
    }
    else if (output_language.value === 'c++') {
      link.download = 'translated_code.cpp';
    }

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
    set_translated_code(''); // Clear previous translation

    try {
      const response = await fetch('https://backend-code-to-code-translation-kabul-238165955840.europe-west1.run.app/api/translate-code/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          target_language: output_language.value,
          input_language: input_language.value,
        }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        // Decode and append the streamed content
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          set_translated_code((prev) => prev + chunk); // Update the state
        }
      }
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
        <div className="code_section_container left_section">
          <CodeMirror
            value={code}
            height="500px"
            className="code_section"
            extensions={[javascript(),
            EditorView.theme({ '&.cm-editor': { textAlign: 'left' }, })
            ]}
            theme={'dark'}
            basicSetup={{
              lineNumbers: true,
            }}
            onChange={set_code}
            placeholder="Input your code here"
          />
          <div className="section_buttons">
            <div className="tooltip">
              <button onClick={handle_upload_click} className="upload_button">
                <FontAwesomeIcon icon={faUpload} />
              </button>
              <span className="tooltip_text">Upload</span>
            </div>
          </div>
        </div>

        {/* Middle translate button */}
        <div className="translate_button_container">
          <button
            onClick={handle_translate}
            className="translate_button"
            disabled={loading}
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </div>

        {/* Right Section (Translated Code + Copy/Download Buttons) */}
        <div className="code_section_container right_section">
          <CodeMirror
            value={translated_code}
            height="500px"
            className="code_section"
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
          <div className="section_buttons">
            <div className="tooltip">
              <button onClick={handle_copy} className="copy_button">
                <FontAwesomeIcon icon={faCopy} />
              </button>
              <span className="tooltip_text">Copy</span>
            </div>
            <div className="tooltip">
              <button onClick={handle_download} className="download_button">
                <FontAwesomeIcon icon={faDownload} />
              </button>
              <span className="tooltip_text">Download</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={file_input_ref}
        type="file"
        onChange={handle_file_upload}
        style={{ display: 'none' }}
      />
    </div>
  );
}


export default App;
