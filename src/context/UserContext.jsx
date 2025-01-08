import React, { createContext, useState, useEffect } from "react";
import run from "../Gemini"; // Ensure the path to `Gemini` is correct

export const datacontext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [prompt, setPrompt] = useState("listening...");
  const [response, setResponse] = useState(false);

  useEffect(() => {
    // Reset speaking state and clear speech synthesis queue on mount
    setSpeaking(false);
    window.speechSynthesis.cancel();
  }, []);

  function speak(text) {
    const speaker = window.speechSynthesis;
    let text_speak = new SpeechSynthesisUtterance(text);
    const voices = speaker.getVoices();
    text_speak.voice = voices[1];
    text_speak.volume = 1;
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.lang = "hi-GB";

    text_speak.onstart = () => setSpeaking(true);
    text_speak.onend = () => setSpeaking(false);

    window.speechSynthesis.speak(text_speak);
  }

  async function aiResponse(inputPrompt) {
    try {
      const aiName =
        "Mohammad Kasim student of Aryabhatta Knowledge University Patna and a software engineer from Artifact Solution Private Limited";
      let promptText = inputPrompt.includes("your name")
        ? `What is your name?`
        : inputPrompt;
      const text = await run(promptText);

      let newText = text
        .replaceAll("**", "")
        .replaceAll("*", "")
        .replaceAll("google", aiName)
        .replaceAll("Google", aiName);

      setPrompt(newText);
      speak(newText);
      setResponse(true);
    } catch (error) {
      console.error("Error in AI response:", error);
      setPrompt("Something went wrong!");
      setResponse(false);
    }
  }

  let speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = speechRecognition ? new speechRecognition() : null;

  if (recognition) {
    recognition.onresult = (e) => {
      const transcript = e.results[e.resultIndex][0].transcript;
      setPrompt(transcript);
      takeCommand(transcript.toLowerCase());
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognition.onnomatch = () => {
      setPrompt("I didn't catch that. Please try again.");
      speak("I didn't catch that. Please try again.");
    };

    recognition.onerror = (event) => {
      setPrompt(`Error occurred in recognition: ${event.error}`);
      speak(`Error occurred in recognition: ${event.error}`);
    };
  } else {
    console.error("Speech Recognition API is not supported in this browser.");
  }

  function takeCommand(command) {
    if (command.includes("open")) {
      const website = command.replace("open", "").trim();
      const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})([\/\w.-]*)*\/?$/;
      if (urlRegex.test(website)) {
        // Ensure the URL has a protocol
        const url = website.startsWith("http")
          ? website
          : `https://${website}`;
        window.open(url, "_blank");
        speak(`Opening ${website}`);
        setResponse(true);
        setPrompt(`Opening ${website}...`);
      } else {
        const searchURL = `https://www.google.com/search?q=${encodeURIComponent(
          website
        )}`;
        window.open(searchURL, "_blank");
        speak(`Searching for ${website}`);
        setResponse(true);
        setPrompt(`Searching for ${website}...`);
      }
      return;
    }

    // Additional commands
    if (command.includes("time")) {
      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      speak(`The current time is ${currentTime}`);
      setResponse(true);
      setPrompt(`The current time is ${currentTime}`);
      return;
    }

    aiResponse(command);
  }

  const value = {
    recognition,
    speaking,
    setSpeaking,
    paused,
    setPaused,
    prompt,
    setPrompt,
    response,
    setResponse,
  };

  return <datacontext.Provider value={value}>{children}</datacontext.Provider>;
}

export default UserContext;
