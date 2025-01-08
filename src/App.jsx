import React, { useContext, useEffect, useRef } from "react";
import "./App.css";
import va from "./assets/ai.png"; // Ensure the path is correct
import { CiMicrophoneOn } from "react-icons/ci";
import { datacontext } from "./context/UserContext";
import speakimg from "./assets/speak.gif"; // Ensure the path is correct
import aigif from "./assets/aiVoice.gif"; // Ensure the path is correct

const App = () => {
  const {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    response,
    setPrompt,
    setResponse,
    setPaused,
  } = useContext(datacontext);
  const scrollRef = useRef(null);

  // Scroll to the bottom when prompt updates
  useEffect(() => {
    // if (scrollRef.current) {
    //   scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    // }
  }, [prompt]);

  const handleStopListening = () => {
    if (recognition && speaking) {
      // Stop speech recognition and synthesis
      recognition.stop();
    }

    // Cancel all ongoing speech synthesis
    window.speechSynthesis.cancel();

    // Reset states
    setSpeaking(false);
    setResponse(false);
    setPaused(false);
    setPrompt(""); // Clear the prompt text
  };

  return (
    <div className="main">
      <img src={va} alt="Aliyah AI" id="aliyah" />
      <span>I'm Faris, Your Advanced Virtual Assistant</span>

      {!speaking && (
        <button
          onClick={() => {
            if (recognition) {
              setPrompt("listening...");
              setSpeaking(true);
              setResponse(false);
              recognition.start();
            } else {
              alert("Speech Recognition is not supported in this browser.");
            }
          }}
        >
          Click here <CiMicrophoneOn />
        </button>
      )}

      {speaking && (
        <div className="response">
          {/* Conditional animations */}
          {response && <img src={aigif} alt="Speaking Animation" id="aigif" />}
          {!response && <img src={speakimg} alt="Listening Animation" id="speak" />}

          {/* Scrollable container for text output */}
          <div className="scroll-container" ref={scrollRef}>
            <p>{prompt}</p>
          </div>

          <div className="response-buttons">
            <button
              onClick={handleStopListening}
              style={{
                backgroundColor: "#E5B8B9", // Light red background
                color: "#721c24", // White text color for contrast
                border: "none", // Soft border for definition
                borderRadius: "20px", // Rounded corners
                padding: "10px 20px", // Add padding
                cursor: "pointer", // Pointer cursor on hover
                fontSize: "16px", // Increase font size
                transition: "background-color 0.3s", // Smooth hover effect
              }}
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
