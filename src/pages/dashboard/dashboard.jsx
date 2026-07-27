import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import {auth,onAuthStateChanged } from "../../firebaseConfig";

const conversations = [];
const messages = [];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(null);
  const activeChat = conversations.find((c) => c.id === activeId) || null;

  // checking if user exist or not
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signup");
      }
    });
    return () => unsubscribe();
  }, [navigate]);
 

  return (
    <div className="dashboard">
      {/* ---------- Left: chat list panel ---------- */}
      <aside className="chatlist-panel">
        <div className="glow glow-a"></div>
        <div className="glow glow-b"></div>

        <div className="chatlist-inner">
          <div className="brand-row">
            <span className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 5.5C4 4.67157 4.67157 4 5.5 4H18.5C19.3284 4 20 4.67157 20 5.5V15.5C20 16.3284 19.3284 17 18.5 17H9L5 20.5V17H5.5C4.67157 17 4 16.3284 4 15.5V5.5Z"
                  fill="url(#brandGradDash)"
                />
                <defs>
                  <linearGradient id="brandGradDash" x1="4" y1="4" x2="20" y2="20">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="brand-word">NexaChat</span>
          </div>

          <div className="search-shell">
            <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9 3a6 6 0 104.47 10.03l3.75 3.75a1 1 0 001.41-1.41l-3.75-3.75A6 6 0 009 3zm-4 6a4 4 0 118 0 4 4 0 01-8 0z"
                clipRule="evenodd"
              />
            </svg>
            <input type="text" placeholder="Search conversations" />
          </div>

          <div className="chat-list">
            {conversations.length === 0 ? (
              <div className="list-empty-state">
                <div className="empty-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M2 5.5A2.5 2.5 0 014.5 3h11A2.5 2.5 0 0118 5.5v6A2.5 2.5 0 0115.5 14H9l-4 3.5V14H4.5A2.5 2.5 0 012 11.5v-6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  className={`chat-item ${c.id === activeId ? "chat-item-active" : ""}`}
                  onClick={() => setActiveId(c.id)}
                >
                  <div className="avatar">
                    {c.initials}
                    {c.online && <span className="status-dot"></span>}
                  </div>
                  <div className="chat-item-body">
                    <div className="chat-item-top">
                      <span className="chat-item-name">{c.name}</span>
                      <span className="chat-item-time">{c.time}</span>
                    </div>
                    <div className="chat-item-bottom">
                      <span className="chat-item-preview">{c.lastMessage}</span>
                      {c.unread > 0 && <span className="unread-badge">{c.unread}</span>}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="profile-card">
            <div className="avatar avatar-self">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 9a4 4 0 100-8 4 4 0 000 8zM10 11c-4.42 0-8 2.24-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.76-3.58-5-8-5z" />
              </svg>
            </div>
            <div className="profile-info">
              <span className="profile-name">My Profile</span>
            </div>
            <button className="icon-btn" aria-label="Settings" onClick={()=> navigate("/settings")}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17a1 1 0 00-2.98 0l-.16.9a6.97 6.97 0 00-1.62.94l-.85-.33a1 1 0 00-1.22.45l-1 1.73a1 1 0 00.24 1.3l.7.58a7.03 7.03 0 000 1.86l-.7.58a1 1 0 00-.24 1.3l1 1.73a1 1 0 001.22.45l.85-.33c.49.4 1.04.72 1.62.94l.16.9a1 1 0 002.98 0l.16-.9c.58-.22 1.13-.54 1.62-.94l.85.33a1 1 0 001.22-.45l1-1.73a1 1 0 00-.24-1.3l-.7-.58a7.03 7.03 0 000-1.86l.7-.58a1 1 0 00.24-1.3l-1-1.73a1 1 0 00-1.22-.45l-.85.33a6.97 6.97 0 00-1.62-.94l-.16-.9zM10 13a3 3 0 110-6 3 3 0 010 6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ---------- Right: active chat panel ---------- */}
      <main className="chat-panel">
        {activeChat ? (
          <>
            <header className="chat-header">
              <div className="chat-header-left">
                <div className="avatar">
                  {activeChat.initials}
                  {activeChat.online && <span className="status-dot"></span>}
                </div>
                <div>
                  <div className="chat-header-name">{activeChat.name}</div>
                  <div className="chat-header-status">
                    {activeChat.online ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
              <div className="chat-header-actions">
                <button className="icon-btn" aria-label="Voice call">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3.5 3A1.5 1.5 0 002 4.5v.5c0 8.28 6.72 15 15 15h.5a1.5 1.5 0 001.5-1.5v-2.29a1.5 1.5 0 00-1.06-1.43l-3.02-.94a1.5 1.5 0 00-1.55.38l-.9.9a11.05 11.05 0 01-5.09-5.09l.9-.9a1.5 1.5 0 00.38-1.55l-.94-3.02A1.5 1.5 0 006.79 3H4.5z" />
                  </svg>
                </button>
                <button className="icon-btn" aria-label="Video call">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6.5A1.5 1.5 0 013.5 5h7A1.5 1.5 0 0112 6.5v7A1.5 1.5 0 0110.5 15h-7A1.5 1.5 0 012 13.5v-7zM13.5 8.4l3.13-2.09A.75.75 0 0118 6.94v6.12a.75.75 0 01-1.37.62L13.5 11.6V8.4z" />
                  </svg>
                </button>
                <button className="icon-btn" aria-label="Chat info">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-4a1.15 1.15 0 100 2.3A1.15 1.15 0 0010 5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </header>

            <section className="messages-area">
              {messages.length === 0 ? (
                <div className="messages-empty-state">
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`message-row ${m.from === "me" ? "message-row-me" : ""}`}>
                    <div className={`message-bubble ${m.from === "me" ? "bubble-me" : "bubble-them"}`}>
                      {m.text}
                      <span className="message-time">{m.time}</span>
                    </div>
                  </div>
                ))
              )}
            </section>

            <footer className="composer">
              <button className="icon-btn" aria-label="Attach file">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M14.5 6.5l-6.36 6.36a2 2 0 102.83 2.83l6.01-6.01a3.5 3.5 0 10-4.95-4.95L5.5 11.26a5 5 0 007.07 7.07l6.01-6.01" />
                </svg>
              </button>
              <div className="composer-input-shell">
                <input type="text" placeholder="Type a message..." />
              </div>
              <button className="send-btn" aria-label="Send message">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3.4 2.4a1 1 0 00-1.36 1.28L4.5 10l-2.46 6.32A1 1 0 003.4 17.6l14-7a1 1 0 000-1.8l-14-7z" />
                </svg>
              </button>
            </footer>
          </>
        ) : (
          <div className="chat-empty-state">
            <div className="empty-icon empty-icon-lg">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M2 5.5A2.5 2.5 0 014.5 3h11A2.5 2.5 0 0118 5.5v6A2.5 2.5 0 0115.5 14H9l-4 3.5V14H4.5A2.5 2.5 0 012 11.5v-6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;