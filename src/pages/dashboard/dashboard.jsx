import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import {
  db,
  auth,
  onAuthStateChanged,
  query,
  where,
  getDocs,
  collection,
  addDoc,
  serverTimestamp
} from "../../firebaseConfig";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [contacts, setContacts] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [globalSearchInputValue, setGlobalSearchInputValue] = useState("");

  // Controls the "3 dots" more-options menu next to the global search icon
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef(null);

  // Controls the standalone "Requests" page opened from the "3 dots" menu
  const [isRequestsPageOpen, setIsRequestsPageOpen] = useState(false);
  const [requestsTab, setRequestsTab] = useState("received"); // "received" | "sent"

  const activeChat = contacts.find((c) => c.id === activeId) || null;
  const navigate = useNavigate();
  const uid = window.localStorage.getItem("uid");

  // Derive matching accounts starting with the entered search term
  const searchPrefix = globalSearchInputValue.trim().toLowerCase();
  let matchingAccounts = [];
  if (searchPrefix) {
    matchingAccounts = contacts?.filter((contact) => {
      return contact.email && contact.email.toLowerCase().startsWith(searchPrefix);
    }) || [];
  } else {
    matchingAccounts = [];
  }

  // Check user auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signup");
      } else {
        setUserEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat) return;

    const getMessages = async () => {
      try {
        const sentQuery = query(
          collection(db, "messages"),
          where("from", "==", uid),
          where("to", "==", activeChat.id)
        );
        const receivedQuery = query(
          collection(db, "messages"),
          where("from", "==", activeChat.id),
          where("to", "==", uid)
        );

        const [sentSnap, receivedSnap] = await Promise.all([
          getDocs(sentQuery),
          getDocs(receivedQuery),
        ]);

        const list = [];
        sentSnap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
        receivedSnap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));

        // Sort messages chronologically
        list.sort((a, b) => {
          const aTime = a.Time?.toMillis ? a.Time.toMillis() : 0;
          const bTime = b.Time?.toMillis ? b.Time.toMillis() : 0;
          return aTime - bTime;
        });

        setMessages(list);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    getMessages();
  }, [activeChat, uid]);

  // Fetch contact users list
  useEffect(() => {
    const getContact = async () => {
      try {
        const q = query(collection(db, "users"), where("UID", "!=", uid));
        const querySnapshot = await getDocs(q);
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setContacts(list);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    if (uid) {
      getContact();
    }
  }, [uid]);

  // Close the "more options" menu whenever the user clicks outside of it
  useEffect(() => {
    if (!isMoreMenuOpen) return;

    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMoreMenuOpen]);

  // Opens the standalone Requests page from the "Request" menu option
  const handleOpenRequestFromMenu = () => {
    setIsMoreMenuOpen(false);
    setIsRequestsPageOpen(true);
  };

  // Closes the Requests page and returns to the main dashboard
  const handleCloseRequestsPage = () => {
    setIsRequestsPageOpen(false);
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChat) return;
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        text: messageText,
        to: activeChat.id,
        from: uid,
        Time: serverTimestamp()
      });
      console.log("Document written with ID: ", docRef.id);
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //working on requesting 
  const handleSendRequest = async (account) => {
    if (!account || !uid) return;

    try {
      const requestData = {
        from: uid,             
        to: account.id,          
        status: "pending",       
        createdAt: serverTimestamp() 
      };
      // Store in Firestore collection named 'requests'
      const docRef = await addDoc(collection(db, "requests"), requestData);
      console.log("Request created with ID:", docRef.id)
      alert(`your request to ${account.username} sended successfully`);
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <div className="dashboard">
      {isRequestsPageOpen ? (
        // request page
        <div className="requests-page">
          <header className="requests-page-header">
            <button
              className="requests-back"
              aria-label="Back to dashboard"
              onClick={handleCloseRequestsPage}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.7 4.3a1 1 0 010 1.4L8.42 10l4.3 4.3a1 1 0 01-1.42 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <h1 className="requests-page-title">Requests</h1>

            <div className="requests-tabs">
              <button
                className={`requests-tab ${requestsTab === "received" ? "requests-tab-active" : ""}`}
                onClick={() => setRequestsTab("received")}
              >
                Received
              </button>
              <button
                className={`requests-tab ${requestsTab === "sent" ? "requests-tab-active" : ""}`}
                onClick={() => setRequestsTab("sent")}
              >
                Sent
              </button>
            </div>
          </header>

          {/* <section className="requests-page-body">
            <div className="requests-list">
              {(requestsTab === "received" ? receivedRequests : sentRequests).map((request) => (
                <div key={request.id} className="request-card">
                  <div className="request-user-info">
                    <div className="avatar">{request.name.charAt(0).toUpperCase()}</div>
                    <div className="request-details">
                      <span className="request-name">{request.name}</span>
                      <span className="request-email">{request.email}</span>
                    </div>
                  </div>

                  {requestsTab === "received" && request.status === "pending" ? (
                    <div className="request-actions">
                      <button className="request-accept-btn">Accept</button>
                      <button className="request-decline-btn">Decline</button>
                    </div>
                  ) : (
                    <span className={`request-status request-status-${request.status}`}>
                      {request.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section> */}
        </div>
      ) : isGlobalSearchOpen ? (
        /* ---------- GLOBAL SEARCH PAGE VIEW ---------- */
        <div className="global-search-page">
          <header className="global-search-page-header">
            <button
              className="global-search-back"
              aria-label="Back to dashboard"
              onClick={() => {
                setIsGlobalSearchOpen(false);
                setGlobalSearchInputValue("");
              }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.7 4.3a1 1 0 010 1.4L8.42 10l4.3 4.3a1 1 0 01-1.42 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="global-search-page-field">
              <svg className="global-search-field-icon" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9 3a6 6 0 104.47 10.03l3.75 3.75a1 1 0 001.41-1.41l-3.75-3.75A6 6 0 009 3zm-4 6a4 4 0 118 0 4 4 0 01-8 0z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                className="global-search-page-input"
                placeholder="Search accounts by email..."
                value={globalSearchInputValue}
                onChange={(e) => setGlobalSearchInputValue(e.target.value)}
                autoFocus
              />
            </div>
          </header>

          <section className="global-search-page-body">
            {!searchPrefix ? (
              <div className="global-search-placeholder">
                <div className="empty-icon empty-icon-lg">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M9 3a6 6 0 104.47 10.03l3.75 3.75a1 1 0 001.41-1.41l-3.75-3.75A6 6 0 009 3zm-4 6a4 4 0 118 0 4 4 0 01-8 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p>Start typing to search accounts across NexaChat</p>
                <span className="global-search-hint">
                  Results will appear here as you type
                </span>
              </div>
            ) : matchingAccounts.length === 0 ? (
              <div className="global-search-placeholder">
                <div className="empty-icon empty-icon-lg">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2zm-7.5 4a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 015.5 13z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p>No accounts matching "{globalSearchInputValue}"</p>
                <span className="global-search-hint">
                  Try typing a different email prefix
                </span>
              </div>
            ) : (
              <div className="global-search-results-container">
                <div className="global-search-results-header">
                  <span>Found {matchingAccounts.length} matching account{matchingAccounts.length > 1 ? "s" : ""}</span>
                </div>
                <div className="global-search-results-list">
                  {matchingAccounts.map((account) => (
                    <div key={account.id} className="global-search-card">
                      <div className="global-search-user-info">
                        <div className="avatar">
                          {(account.name || account.email || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="global-search-details">
                          <span className="global-search-name">
                            {account.username || "NexaChat User"}
                          </span>
                          <span className="global-search-email">{account.email}</span>
                        </div>
                      </div>
                      <button
                        className="request-btn"
                        onClick={() => handleSendRequest(account)}
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 00-6 6h12a6 6 0 00-6-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                        <span>Request</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      ) : (
        /* ---------- MAIN DASHBOARD LAYOUT ---------- */
        <>
          {/* Left: Chat List Panel */}
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

                <div
                  className="more-menu-wrapper"
                  ref={moreMenuRef}
                  onMouseEnter={() => setIsMoreMenuOpen(true)}
                >
                  <button
                    className="more-menu-btn"
                    aria-label="More options"
                    aria-haspopup="true"
                    aria-expanded={isMoreMenuOpen}
                    onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 100-4 2 2 0 000 4zM10 12a2 2 0 100-4 2 2 0 000 4zM10 18a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>

                  {isMoreMenuOpen && (
                    <div className="more-menu-dropdown">
                      <button
                        className="more-menu-item"
                        onClick={handleOpenRequestFromMenu}
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 00-6 6h12a6 6 0 00-6-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                        <span>Request</span>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  className="global-search-trigger"
                  aria-label="Global Search"
                  onClick={() => setIsGlobalSearchOpen(true)}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M9 3a6 6 0 104.47 10.03l3.75 3.75a1 1 0 001.41-1.41l-3.75-3.75A6 6 0 009 3zm-4 6a4 4 0 118 0 4 4 0 01-8 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
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
                {contacts.length === 0 ? (
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
                  contacts.map((c) => (
                    <button
                      key={c.id}
                      className={`chat-item ${c.id === activeId ? "chat-item-active" : ""}`}
                      onClick={() => setActiveId(c.id)}
                    >
                      <div className="avatar">
                        {(c.name || c.email || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="chat-item-body">
                        <div className="chat-item-top">
                          <span className="chat-item-name">{c.name || c.email}</span>
                        </div>
                        {c.name && c.email && (
                          <div className="chat-item-bottom">
                            <span className="chat-item-preview">{c.email}</span>
                          </div>
                        )}
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
                  <span className="profile-email">{userEmail}</span>
                </div>
                <button
                  className="icon-btn"
                  aria-label="Settings"
                  onClick={() => navigate("/settings")}
                >
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

          {/* Right: Active Chat Panel */}
          <main className="chat-panel">
            {activeChat ? (
              <>
                <header className="chat-header">
                  <div className="chat-header-left">
                    <div className="avatar">
                      {(activeChat.name || activeChat.email || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="chat-header-name">{activeChat.name || activeChat.email}</div>
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
                      <div
                        key={m.id}
                        className={`message-row ${m.from === uid ? "message-row-me" : ""}`}
                      >
                        <div className={`message-bubble ${m.from === uid ? "bubble-me" : "bubble-them"}`}>
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
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                  </div>
                  <button
                    className="send-btn"
                    aria-label="Send message"
                    onClick={handleSendMessage}
                  >
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
        </>
      )}
    </div>
  );
};

export default Dashboard;