import { useState, useEffect } from "react";

export default function SpeechReader({ text }) {
  const [input, setInput] = useState("");

  const convertText = () => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = input;
    speech.pitch = 1;
    speech.volume = 1;
    speech.lang = "en-US"; //"ko-KR";
    speech.rate = 0.7;

    speechSynthesis.speak(speech);
  };

  const handleSpeechReader = () => {
    convertText();
  };

  useEffect(() => {
    if (text) {
      setInput(text);
    }
  }, [text]);

  return (
    <>
      <div className="h1">
        <h1>Text-to-Speech</h1>
      </div>

      <div className="text-container">
        <textarea
          placeholder="Enter here"
          className="form-control my-2 textarea"
          id="mybox"
          rows="10"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        ></textarea>
        <div className="convert-to-speech">
          <button
            className="btn btn-primary my-4 convert"
            onClick={handleSpeechReader}
          >
            Convert to Speech
          </button>
        </div>
      </div>
    </>
  );
}
