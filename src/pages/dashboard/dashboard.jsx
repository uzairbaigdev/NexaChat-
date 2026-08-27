import React, { useState, useEffect, useRef } from "react";
import { data, useNavigate } from "react-router-dom";
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
  serverTimestamp,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  setDoc,
  and,
  or,
} from "../../firebaseConfig";
import RequestList from "./RequestList";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [myImageURL, setMyImageURL] = useState("");
  const [contacts, setContacts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [globalSearchInputValue, setGlobalSearchInputValue] = useState("");
  const [recivedReq, setRecivedReq] = useState([]);
  const [sentReq, setSentReq] = useState([]); // requests the logged-in user has sent to others
  const [matchingAccounts, setMatchingAccounts] = useState([]);
  const [searchContacts, setSearchContacts] = useState("");
  let searchPrefix = globalSearchInputValue.trim().toLowerCase();
  let [showList, setShowList] = useState(false);

  // Controls the "3 dots" more-options menu next to the global search icon
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef(null);

  // Controls the standalone "Requests" page opened from the "3 dots" menu
  const [isRequestsPageOpen, setIsRequestsPageOpen] = useState(false);
  const [requestsTab, setRequestsTab] = useState("received"); // "received" | "sent"

  // Controls the full-screen message UI opened from a public account's "message" button

  const [isPublicMessageOpen, setIsPublicMessageOpen] = useState(false);
  const [publicMessageAccount, setPublicMessageAccount] = useState(null);
  const [publicMessages, setPublicMessages] = useState([]);
  const [publicMessageText, setPublicMessageText] = useState("");

  const uid = window.localStorage.getItem("uid");
  const navigate = useNavigate();

  // Image message upload state (base64, same approach as chat.js)
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef(null);

  //handle message delete
  const [messageDeleteID, setMessageDeleteID] = useState(null);
  const [editingMessageID, setEditingMessageID] = useState(null);

  const activeChat = contacts.find((c) => c.id === activeId) || null;
  // Filters the sidebar contacts list locally as the user types in "Search conversations"
  const fetchContactsLocally = () => {
    const search = searchContacts.trim().toLowerCase();
    if (!search) return contacts;

    return contacts.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(search) ||
        (c.email || "").toLowerCase().includes(search),
    );
  };

  //working on global search filtering accounts
  useEffect(() => {
    const search = globalSearchInputValue.trim().toLowerCase();

    if (!search) {
      setMatchingAccounts([]);
      return;
    }

    const filtered = allUsers.filter((user) =>
      user.email?.toLowerCase().startsWith(search),
    );

    setMatchingAccounts(filtered);
  }, [globalSearchInputValue, allUsers]);

  // Check user auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/signup");
      } else {
        setUserEmail(user.email);

        // Load the logged-in user's own profile image (shown in the sidebar)
        try {
          const userSnap = await getDoc(doc(db, "users", user.uid));
          if (userSnap.exists()) {
            setMyImageURL(userSnap.data().imageURL || "");
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Listen for messages in the active chat in real time
  useEffect(() => {
    if (!activeChat) return;

    const sentQuery = query(
      collection(db, "messages"),
      where("from", "==", uid),
      where("to", "==", activeChat.id),
    );
    const receivedQuery = query(
      collection(db, "messages"),
      where("from", "==", activeChat.id),
      where("to", "==", uid),
    );

    let sentMessages = [];
    let receivedMessages = [];

    const mergeAndSetMessages = () => {
      const list = [...sentMessages, ...receivedMessages];

      // Sort messages chronologically
      list.sort((a, b) => {
        const aTime = a.Time?.toMillis ? a.Time.toMillis() : 0;
        const bTime = b.Time?.toMillis ? b.Time.toMillis() : 0;
        return aTime - bTime;
      });

      setMessages(list);
    };

    const unsubscribeSent = onSnapshot(
      sentQuery,
      (snapshot) => {
        sentMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        mergeAndSetMessages();
      },
      (error) => {
        console.error("Error listening to sent messages:", error);
      },
    );

    const unsubscribeReceived = onSnapshot(
      receivedQuery,
      (snapshot) => {
        receivedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        mergeAndSetMessages();
      },
      (error) => {
        console.error("Error listening to received messages:", error);
      },
    );

    return () => {
      unsubscribeSent();
      unsubscribeReceived();
    };
  }, [activeChat, uid]);

  // Listen for messages between the logged-in user and a public account in
  // real time, for the full-screen message UI opened from global search.
  useEffect(() => {
    if (!publicMessageAccount) return;

    const sentQuery = query(
      collection(db, "messages"),
      where("from", "==", uid),
      where("to", "==", publicMessageAccount.id),
    );
    const receivedQuery = query(
      collection(db, "messages"),
      where("from", "==", publicMessageAccount.id),
      where("to", "==", uid),
    );

    let sentMessages = [];
    let receivedMessages = [];

    const mergeAndSetPublicMessages = () => {
      const list = [...sentMessages, ...receivedMessages];

      list.sort((a, b) => {
        const aTime = a.Time?.toMillis ? a.Time.toMillis() : 0;
        const bTime = b.Time?.toMillis ? b.Time.toMillis() : 0;
        return aTime - bTime;
      });

      setPublicMessages(list);
    };

    const unsubscribeSent = onSnapshot(
      sentQuery,
      (snapshot) => {
        sentMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        mergeAndSetPublicMessages();
      },
      (error) => {
        console.error("Error listening to sent messages:", error);
      },
    );

    const unsubscribeReceived = onSnapshot(
      receivedQuery,
      (snapshot) => {
        receivedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        mergeAndSetPublicMessages();
      },
      (error) => {
        console.error("Error listening to received messages:", error);
      },
    );

    return () => {
      unsubscribeSent();
      unsubscribeReceived();
    };
  }, [publicMessageAccount, uid]);

  // get requests

  const receivedRequests = async () => {
    try {
      const q = query(
        collection(db, "requests"),
        where("status", "==", "pending"),
        where("to", "==", uid),
      );

      const querySnapshot = await getDocs(q);

      let list = [];

      if (querySnapshot.empty) {
        console.log("no one has send request");
        setRecivedReq([]);
      } else {
        console.log(querySnapshot);
        for (const requestDoc of querySnapshot.docs) {
          const requestData = requestDoc.data();

          //get sender data
          const userRef = doc(db, "users", requestData.from);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();

            list.push({
              id: requestDoc.id,
              ...requestData,
              name: userData.username,
              email: userData.email,
            });
          }
        }

        setRecivedReq(list);
      }
    } catch (error) {
      console.error(error);
    }

    setShowList(true);
  };

  // Fetch requests that the logged-in user has SENT to other people.
  // The recipient's name/email were already saved on the request document
  // when it was created (toName/toEmail), so we don't need an extra
  // Firestore read per request like receivedRequests() does.
  const sentRequests = async () => {
    try {
      const q = query(
        collection(db, "requests"),
        where("from", "==", uid),
        where("status", "==", "pending"),
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("no requests sent yet");
        setSentReq([]);
      } else {
        const list = querySnapshot.docs.map((requestDoc) => {
          const requestData = requestDoc.data();
          return {
            id: requestDoc.id,
            ...requestData,
            name: requestData.toName,
            email: requestData.toEmail,
          };
        });

        setSentReq(list);
      }
    } catch (error) {
      console.error(error);
    }

    setShowList(true);
  };

  // Fetch sidebar contact list — only users whose request is accepted
  const getAcceptedContacts = async () => {
    try {
      const sentQuery = query(
        collection(db, "requests"),
        and(
          where("Visibility", "==", "public"),
          or(where("from", "==", uid), where("to", "==", uid)),
        ),
      );

      const receivedQuery = query(
        collection(db, "requests"),
        and(
          where("status", "==", "accepted"),
          or(where("from", "==", uid), where("to", "==", uid)),
        ),
      );

      const [sentSnap, receivedSnap] = await Promise.all([
        getDocs(sentQuery),
        getDocs(receivedQuery),
      ]);
      const requestDocs = [...sentSnap.docs, ...receivedSnap.docs];
      if (requestDocs.length === 0) {
        setContacts([]);
        return;
      }

      const users = [];

      await Promise.all(
        requestDocs.map(async (requestDoc) => {
          const requestData = requestDoc.data();
          // console.log(requestData)
          // Find the other user in the conversation
          const targetUID =
            requestData.from === uid ? requestData.to : requestData.from;

          // Look up the other user directly by their document ID
          console.log(targetUID);
          const userRef = doc(db, "users", targetUID);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            // Prevent duplicate contacts
            if (!users.some((u) => u.id === userSnap.id)) {
              users.push({
                id: userSnap.id,
                ...userSnap.data(),
              });
            }
          }
        }),
      );

      setContacts(users);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    if (uid) {
      getAcceptedContacts();
    }
  }, [uid]);

  // Fetch every user in the "users" collection so global search has data to
  // filter against locally. Without this, `allUsers` stays empty forever and
  // global search can never find anyone.
  const fetchAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));

      const users = querySnapshot.docs
        .map((userDoc) => ({
          id: userDoc.id,
          ...userDoc.data(),
        }))
        // Don't show the logged-in user in their own search results
        .filter((user) => user.id !== uid);

      setAllUsers(users);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchAllUsers();
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
    setRequestsTab("received");
    receivedRequests(); // load data immediately so the page isn't blank
  };

  // Closes the Requests page and returns to the main dashboard
  const handleCloseRequestsPage = () => {
    setIsRequestsPageOpen(false);
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChat) return;

    try {
      // Agar message edit ho raha hai
      if (editingMessageID) {
        await updateDoc(doc(db, "messages", editingMessageID), {
          text: messageText.trim(),
          edited: true,
        });

        console.log("Message updated successfully");

        setMessageText("");
        setEditingMessageID(null);
        setMessageDeleteID(null);

        return;
      }

      // Naya message send hoga
      const docRef = await addDoc(collection(db, "messages"), {
        text: messageText.trim(),
        to: activeChat.id,
        from: uid,
        Time: serverTimestamp(),
        seen: false,
      });

      console.log("Document written with ID:", docRef.id);

      setMessageText("");
    } catch (error) {
      console.error("Error sending/updating message:", error);
    }
  };

  // Message database s aa rhe hn 
  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "messages"),
      where("to", "==", uid),
      where("seen", "==", false)
    );

    const markMessagesAsSeen = async (senderId) => {
      try {
        const q = query(
          collection(db, "messages"),
          where("from", "==", senderId),
          where("to", "==", uid),
          where("seen", "==", false)
        );

        const snapshot = await getDocs(q);

        const updates = snapshot.docs.map((message) =>
          updateDoc(message.ref, {
            seen: true,
          })
        );

        await Promise.all(updates);
      } catch (error) {
        console.error("Error marking messages as seen:", error);
      }
    };

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts = {};

      snapshot.docs.forEach((doc) => {
        const message = doc.data();

        counts[message.from] = (counts[message.from] || 0) + 1;
      });

      setUnreadCounts(counts);
    });

    return () => unsubscribe();
  }, [uid]);

  // Opens the hidden file picker when the attach/image icon is clicked
  const handleImageIconClick = () => {
    if (isUploadingImage) return;
    imageInputRef.current?.click();
  };

  // Firestore rejects any single field over ~1,048,487 bytes, so the image is
  // resized (canvas) and re-encoded as JPEG, shrinking dimensions/quality
  // step by step until it comfortably fits.
  const MAX_IMAGE_FIELD_BYTES = 700000; // leaves headroom for the rest of the doc

  const compressImageToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        let { width, height } = img;
        let maxDimension = 1280;
        let quality = 0.8;

        const render = () => {
          const scale = Math.min(1, maxDimension / Math.max(width, height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(width * scale));
          canvas.height = Math.max(1, Math.round(height * scale));

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          return canvas.toDataURL("image/jpeg", quality);
        };

        let dataUrl = render();

        // Shrink further if still too big, alternating between lowering
        // quality and lowering max dimension so we converge quickly.
        let attempts = 0;
        while (dataUrl.length > MAX_IMAGE_FIELD_BYTES && attempts < 8) {
          if (quality > 0.4) {
            quality -= 0.15;
          } else {
            maxDimension = Math.round(maxDimension * 0.75);
          }
          dataUrl = render();
          attempts += 1;
        }

        if (dataUrl.length > MAX_IMAGE_FIELD_BYTES) {
          reject(
            new Error("Image is too large to send even after compression."),
          );
          return;
        }

        resolve(dataUrl);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not read the selected image file."));
      };

      img.src = objectUrl;
    });

  // Reads the selected image, compresses it to fit Firestore's field size
  // limit, and saves it into the same "messages" collection as text
  // messages so it shows up in the chat thread automatically.
  const handleImageFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // reset so picking the same file again still fires onChange
    if (!file || !activeChat) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setIsUploadingImage(true);
    try {
      const base64Image = await compressImageToBase64(file);

      const docRef = await addDoc(collection(db, "messages"), {
        text: "",
        imageUrl: base64Image, // base64 JPEG data URL, stored directly in Firestore
        to: activeChat.id,
        from: uid,
        Time: serverTimestamp(),
      });
      console.log("Image message written with ID:", docRef.id);
    } catch (error) {
      console.error("Error sending image message:", error);
      alert(error.message || "Failed to send image message.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  //working on requesting
  const handleSendRequest = async (account) => {
    if (!account || !uid) return;

    try {
      // Current logged-in user ka data
      const currentUserRef = doc(db, "users", uid);
      const currentUserSnap = await getDoc(currentUserRef);

      if (!currentUserSnap.exists()) {
        alert("Current user data not found!");
        return;
      }

      const currentUser = currentUserSnap.data();

      const requestData = {
        // Sender
        from: uid,
        fromName: currentUser.username,
        fromEmail: currentUser.email,

        // Receiver
        to: account.id,
        toName: account.username,
        toEmail: account.email,

        // Request Info
        status: "pending",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "requests"), requestData);

      console.log("Request created with ID:", docRef.id);
      alert(`Your request has been sent to ${account.username}`);
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  // Opens the full-screen message UI for a public account from global search
  const handleOpenPublicMessage = (account) => {
    setPublicMessageAccount(account);
    setIsPublicMessageOpen(true);
  };

  // Closes the full-screen message UI
  const handleClosePublicMessage = () => {
    setIsPublicMessageOpen(false);
    setPublicMessageAccount(null);
    setPublicMessages([]);
    setPublicMessageText("");
  };

  // Sends a message from the full-screen public message UI
  const handleSendPublicMessage = async () => {
    if (!publicMessageText.trim() || !publicMessageAccount) return;

    try {
      const docRef = await addDoc(collection(db, "messages"), {
        text: publicMessageText.trim(),
        to: publicMessageAccount.id,
        from: uid,
        Time: serverTimestamp(),
      });
      // Add this account to local contacts if it isn't already there
      setContacts([...contacts, publicMessageAccount]);

      console.log("Document written with ID:", docRef.id);
      setPublicMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  ///accept request work ///

  const handleAccept = async (request) => {
    try {
      const requestRef = doc(db, "requests", request.id);

      await updateDoc(requestRef, {
        status: "accepted",
      });

      console.log("Request Accepted");

      // refresh received requests list
      receivedRequests();

      // refresh sidebar contacts so the newly accepted user shows up
      getAcceptedContacts();
    } catch (error) {
      console.error(error);
    }
  };

  const setPublicUserInDb = async (account) => {
    let docRef = collection(db, "requests");
    let setData = await addDoc(docRef, {
      ...account,
      to: uid,
      from: account.UID,
    });
    console.log(setData.id);
  };

  return (
    <div className="dashboard">
      {isPublicMessageOpen ? (
        // full-screen message UI for a public account (from global search)
        <div className="public-message-page">
          <header className="public-message-page-header">
            <button
              className="requests-back"
              aria-label="Back to dashboard"
              onClick={handleClosePublicMessage}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.7 4.3a1 1 0 010 1.4L8.42 10l4.3 4.3a1 1 0 01-1.42 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="chat-header-left">
              <div className="avatar">
                {publicMessageAccount?.imageURL ? (
                  <img
                    src={publicMessageAccount.imageURL}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  (
                    publicMessageAccount?.username ||
                    publicMessageAccount?.email ||
                    "?"
                  )
                    .charAt(0)
                    .toUpperCase()
                )}
              </div>
              <div className="chat-header-name">
                {publicMessageAccount?.username || publicMessageAccount?.email}
              </div>
            </div>
          </header>

          <section className="messages-area">
            {publicMessages.length === 0 ? (
              <div className="messages-empty-state">
                <p>No messages yet</p>
              </div>
            ) : (
              publicMessages.map((m) => (
                <div
                  key={m.id}
                  className={`message-row ${m.from === uid ? "message-row-me" : ""}`}
                >
                  <div className="message-crud">
                    <div
                      className={`message-bubble ${m.from === uid ? "bubble-me" : "bubble-them"
                        }`}
                    >
                      {m.imageUrl ? (
                        <img
                          src={m.imageUrl}
                          alt="Sent"
                          style={{
                            maxWidth: "220px",
                            borderRadius: "8px",
                            display: "block",
                          }}
                        />
                      ) : (
                        m.text
                      )}

                      <span className="message-time">{m.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

          <footer className="composer">
            <div className="composer-input-shell">
              <input
                type="text"
                placeholder="Type a message..."
                value={publicMessageText}
                onChange={(e) => setPublicMessageText(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSendPublicMessage()
                }
              />
            </div>
            <button
              className="send-btn"
              aria-label="Send message"
              onClick={handleSendPublicMessage}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M3.4 2.4a1 1 0 00-1.36 1.28L4.5 10l-2.46 6.32A1 1 0 003.4 17.6l14-7a1 1 0 000-1.8l-14-7z" />
              </svg>
            </button>
          </footer>
        </div>
      ) : isRequestsPageOpen ? (
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
                onClick={() => {
                  setRequestsTab("received");
                  receivedRequests();
                }}
              >
                Received
              </button>
              <button
                className={`requests-tab ${requestsTab === "sent" ? "requests-tab-active" : ""}`}
                onClick={() => {
                  setRequestsTab("sent");
                  sentRequests();
                }}
              >
                Sent
              </button>
            </div>
          </header>

          {/* list of request */}

          {showList && (
            <RequestList
              request={(requestsTab === "sent" ? sentReq : recivedReq) || []}
              requestsTab={requestsTab}
              handleAccept={handleAccept}
            />
          )}
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
              <svg
                className="global-search-field-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
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
                  <span>
                    Found {matchingAccounts.length} matching account
                  </span>
                </div>
                <div className="global-search-results-list">
                  {matchingAccounts.map((account) => (
                    <div key={account.id} className="global-search-card">
                      <div className="global-search-user-info">
                        <div className="avatar">
                          {account.imageURL ? (
                            <img
                              src={account.imageURL}
                              alt="Profile"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            (account.name || account.email || "?")
                              .charAt(0)
                              .toUpperCase()
                          )}
                        </div>
                        <div className="global-search-details">
                          <span className="global-search-name">
                            {account.username || "NexaChat User"}
                          </span>
                          <span className="global-search-email">
                            {account.email}
                          </span>
                        </div>
                      </div>
                      {account.Visibility === "public" ? (
                        <button
                          className="request-btn"
                          onClick={() => {
                            setPublicUserInDb(account);
                            handleOpenPublicMessage(account);
                          }}
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M2 5.5A2.5 2.5 0 014.5 3h11A2.5 2.5 0 0118 5.5v6A2.5 2.5 0 0115.5 14H9l-4 3.5V14H4.5A2.5 2.5 0 012 11.5v-6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>message</span>
                        </button>
                      ) : (
                        <button
                          className="request-btn"
                          onClick={() => handleSendRequest(account)}
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 00-6 6h12a6 6 0 00-6-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                          </svg>
                          <span>Request</span>
                        </button>
                      )}
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
                      <linearGradient
                        id="brandGradDash"
                        x1="4"
                        y1="4"
                        x2="20"
                        y2="20"
                      >
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
                <svg
                  className="search-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3a6 6 0 104.47 10.03l3.75 3.75a1 1 0 001.41-1.41l-3.75-3.75A6 6 0 009 3zm-4 6a4 4 0 118 0 4 4 0 01-8 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search conversations"
                  value={searchContacts}
                  onChange={(e) => setSearchContacts(e.target.value)}
                />
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
                ) : fetchContactsLocally().length === 0 ? (
                  <div className="list-empty-state">
                    <div className="empty-icon">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M9 3a6 6 0 104.47 10.03l3.75 3.75a1 1 0 001.41-1.41l-3.75-3.75A6 6 0 009 3zm-4 6a4 4 0 118 0 4 4 0 01-8 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p>No contacts matching "{searchContacts}"</p>
                  </div>
                ) : (
                  fetchContactsLocally().map((c) => (
                    <button
                      key={c.id}
                      className={`chat-item ${c.id === activeId ? "chat-item-active" : ""}`}
                      onClick={() => {
                        setActiveId(c.id);
                        markMessagesAsSeen(c.id);
                      }}
                    >
                      <div className="avatar">
                        {c.imageURL ? (
                          <img
                            src={c.imageURL}
                            alt="Profile"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          (c.name || c.email || "?").charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="chat-item-body">
                        <div className="chat-item-top">
                          <span className="chat-item-name">
                            {c.name || c.email}
                          </span>

                          {unreadCounts[c.id] > 0 && (
                            <span className="unread-badge">
                              {unreadCounts[c.id]}
                            </span>
                          )}
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
                  {myImageURL ? (
                    <img
                      src={myImageURL}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 9a4 4 0 100-8 4 4 0 000 8zM10 11c-4.42 0-8 2.24-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.76-3.58-5-8-5z" />
                    </svg>
                  )}
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
                      {activeChat.imageURL ? (
                        <img
                          src={activeChat.imageURL}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        (activeChat.name || activeChat.email || "?")
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="chat-header-name">
                        {activeChat.name || activeChat.email}
                      </div>
                    </div>
                  </div>
                  <div className="chat-header-actions">
                    <button
                      className="icon-btn icon-btn-delete"
                      aria-label="Delete message"
                      style={{
                        display: messageDeleteID ? "inline-flex" : "none",
                      }}
                      onClick={async () => {
                        if (messageDeleteID) {
                          try {
                            await deleteDoc(
                              doc(db, "messages", messageDeleteID),
                            );

                            setMessageDeleteID(null);
                            setEditingMessageID(null);

                            console.log("Message deleted successfully");
                          } catch (error) {
                            console.error("Error deleting message:", error);
                          }
                        }
                      }}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M8.5 2a1 1 0 00-.894.553L7.191 3.5H4a1 1 0 000 2h.106l.732 9.15A2 2 0 006.832 16.5h6.336a2 2 0 001.994-1.85l.732-9.15H16a1 1 0 100-2h-3.191l-.415-.947A1 1 0 0011.5 2h-3zm-.5 5a1 1 0 011 1v5a1 1 0 11-2 0V8a1 1 0 011-1zm4 0a1 1 0 011 1v5a1 1 0 11-2 0V8a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* EDIT BUTTON */}
                    <button
                      className="icon-btn icon-btn-edit"
                      aria-label="Edit message"
                      style={{
                        display: messageDeleteID ? "inline-flex" : "none",
                      }}
                      onClick={() => {
                        const selectedMessage = messages.find(
                          (message) => message.id === messageDeleteID,
                        );

                        if (!selectedMessage) return;

                        if (selectedMessage.imageUrl) {
                          alert("Image message cannot be edited.");
                          return;
                        }

                        setMessageText(selectedMessage.text || "");
                        setEditingMessageID(selectedMessage.id);
                        setMessageDeleteID(null);

                        document
                          .querySelector(".composer input[type='text']")
                          ?.focus();
                      }}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.69 3.31a1.5 1.5 0 012.12 0l.88.88a1.5 1.5 0 010 2.12l-8.5 8.5-3.8.76.76-3.8 8.54-8.46zM4.3 16.7l4.6-.92 8.32-8.32-3.68-3.68-8.32 8.32-.92 4.6z" />
                      </svg>
                    </button>

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
                        onClick={() => {
                          if (m.from === uid) {
                            setMessageDeleteID(m.id);
                          } else {
                            setMessageDeleteID(null);
                          }
                        }}
                      >
                        <div className="message-crud">
                          <div
                            className={`message-bubble ${m.from === uid ? "bubble-me" : "bubble-them"
                              }`}
                          >
                            {m.imageUrl ? (
                              <img
                                src={m.imageUrl}
                                alt="Sent"
                                style={{
                                  maxWidth: "220px",
                                  borderRadius: "8px",
                                  display: "block",
                                }}
                              />
                            ) : (
                              m.text
                            )}

                            <span className="message-time">{m.time}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </section>

                <footer className="composer">
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    onChange={handleImageFileChange}
                    style={{ display: "none" }}
                  />
                  <button
                    className="icon-btn"
                    aria-label="Attach file"
                    onClick={handleImageIconClick}
                    disabled={isUploadingImage}
                  >
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
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
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
