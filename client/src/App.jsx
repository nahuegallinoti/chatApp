import "./App.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";

// const socket = io("http://localhost:4000");
const socket = io();

function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    message !== "" ? sendMessage() : setError(true);
  };

  const sendMessage = () => {
    socket.emit("message", message);

    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([newMessage, ...messages]);
    setMessage("");
    setError(false);
  };

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages([message, ...messages]);
    };

    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <h1 className="text-2xl font-bold my-2 text-center">Chat App</h1>
        <input
          value={message}
          type="text"
          onChange={(e) => {
            setMessage(e.target.value);
            e.target.value != "" ? setError(false) : "";
          }}
          className={`border-2 border-zinc-500 rounded-md p-2 text-black w-full ${
            error ? "bg-red-200" : ""
          }`}
        />
        <ul className="h-80 overflow-y-auto">
          {messages.map((message, i) => (
            <li
              key={i}
              className={`my-2 p-2 table text-sm rounded-md ${
                message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-black"
              }`}
            >
              <p>
                {message.from}: {message.body}
              </p>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;
