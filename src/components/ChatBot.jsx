import React, { useEffect, useRef, useState } from "react";
import "../styles/chatbot.scss";

const ChatBot = () => {
  const [chatInput, setChatInput] = useState("");
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const handleSubmit = () => {
    if (!chatInput.trim()) return;
    const userMsg = { type: "user", text: chatInput };
    setHistory((prev) => [...prev, userMsg]);
    getResponse();
    setChatInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // stop form submit / new line
      handleSubmit();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const getResponse = async () => {
    if (!chatInput.trim()) return; // don't send empty
    try {
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: chatInput }),
      });

      const data = await response.json();
      const botMsg = {
        type: "bot",
        text: data.error ? "Chat limit is over" : data.response,
      };
      setHistory((prev) => [...prev, botMsg]);
      console.log(data);
    } catch (error) {
      console.error("Fetch error:", error?.error);
    }
  };

  return (
    <>
      <h1 className="heading">Chatbot</h1>
      <div className="container">
        <div className="chatbot_card">
          <div className="chatbot_history">
            {history.map((message, index) => {
              return (
                <div className={`chatbot_message_${message.type}`} key={index}>
                  {message.text}
                </div>
              );
            })}
            <div ref={messagesEndRef}></div>
          </div>
          <div className="chatbot_input">
            <input
              placeholder="Write your message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button type="submit" onClick={handleSubmit}>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
