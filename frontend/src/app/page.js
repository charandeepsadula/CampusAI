"use client";

import { useState } from "react";

const API_URL = "https://campusai-backend-9hmf.onrender.com";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("campusai_token", data.token);
      setToken(data.token);
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const askQuestion = async (e) => {
    e.preventDefault();

    if (!question.trim() || !token) {
      return;
    }

    const currentQuestion = question;

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text: currentQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: currentQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get answer");
      }

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text: data.answer,
          sources: data.sources,
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text: `Error: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("campusai_token");
    setToken(null);
    setMessages([]);
    setEmail("");
    setPassword("");
  };

  if (!token) {
    return (
      <main className="login-page">
        <div className="login-card">
          <h1>CampusAI</h1>

          <p className="subtitle">
            College AI Assistant
          </p>

          <form onSubmit={login}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">
              Login
            </button>
          </form>

          {loginError && (
            <p className="error">
              {loginError}
            </p>
          )}

          <p className="hint">
            CampusAI College Knowledge Assistant
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="chat-page">
      <header className="chat-header">
        <div>
          <h1>CampusAI</h1>

          <p>
            College Knowledge Assistant
          </p>
        </div>

        <div>
          <button
            className="admin-button"
            onClick={() => {
              window.location.href = "/admin";
            }}
          >
            Admin
          </button>

          <button
            className="logout"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="chat-container">
        {messages.length === 0 && (
          <div className="welcome">
            <h2>
              Welcome to CampusAI 👋
            </h2>

            <p>
              Ask questions about your college,
              library, hostel, admissions, fees,
              academics, and more.
            </p>

            <div className="examples">
              <button
                onClick={() =>
                  setQuestion(
                    "What are the library timings?"
                  )
                }
              >
                Library timings
              </button>

              <button
                onClick={() =>
                  setQuestion(
                    "What are the hostel dinner timings?"
                  )
                }
              >
                Hostel timings
              </button>

              <button
                onClick={() =>
                  setQuestion(
                    "What is the tuition fee?"
                  )
                }
              >
                Tuition fee
              </button>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.type === "user"
                ? "user-message"
                : "ai-message"
            }`}
          >
            <strong>
              {message.type === "user"
                ? "You"
                : "CampusAI"}
            </strong>

            <p>{message.text}</p>

            {message.sources &&
              message.sources.length > 0 && (
                <small>
                  Source:{" "}
                  {message.sources[0].filename ||
                    "College Knowledge Base"}
                </small>
              )}
          </div>
        ))}

        {loading && (
          <div className="message ai-message">
            <strong>CampusAI</strong>

            <p>
              Thinking...
            </p>
          </div>
        )}
      </section>

      <form
        className="question-form"
        onSubmit={askQuestion}
      >
        <input
          type="text"
          placeholder="Ask something about your college..."
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </main>
  );
}