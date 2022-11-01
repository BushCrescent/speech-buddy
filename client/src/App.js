import { useState } from "react";
import SpeechReader from "./components/SpeechReader";
import GoogleVision from "./components/GoogleVision";
import Nav from "./components/Nav";

export default function App() {
  const [text, setText] = useState("");

  return (
    <>
      <Nav

      />
      <GoogleVision
        onHandleText={(string) => {
          setText(string);
        }}
      />
      <SpeechReader text={text} />
    </>
  );
}
