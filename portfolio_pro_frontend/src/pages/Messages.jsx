// src/pages/Messages.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API from "../api/axiosConfig";
import "./Messages.css";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 60);
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await API.get("/api/messages/my");
      setMessages(res.data);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (msg) => {
    setSelected(msg);
    if (!msg.isRead) {
      try {
        await API.put(`/api/messages/${msg.id}/read`);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)),
        );
      } catch {
        /* ignore */
      }
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const formatDate = (str) => {
    if (!str) return "";
    return new Date(str).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="page-root">
      <Sidebar />
      <main className={`page-main ${visible ? "page-visible" : ""}`}>
        <header className="page-header">
          <div>
            <h1 className="page-title">Messages</h1>
            <p className="page-sub">
              {messages.length} total
              {unreadCount > 0 && (
                <span className="unread-pill">{unreadCount} unread</span>
              )}
            </p>
          </div>
        </header>

        {loading ? (
          <div className="page-loading">
            <div className="page-spinner" />
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="msg-empty">
            <span className="msg-empty-icon">✉</span>
            <h2>No messages yet</h2>
            <p>
              When visitors contact you through your published portfolio,
              messages appear here.
            </p>
          </div>
        ) : (
          <div className="msg-layout">
            {/* List panel */}
            <div className="msg-list">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`msg-item ${!msg.isRead ? "unread" : ""} ${selected?.id === msg.id ? "selected" : ""}`}
                  onClick={() => handleSelect(msg)}
                >
                  <div className="msg-avatar">
                    {msg.senderName?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="msg-info">
                    <div className="msg-top">
                      <span className="msg-name">{msg.senderName}</span>
                      <span className="msg-time">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    <span className="msg-email-text">{msg.senderEmail}</span>
                    <p className="msg-preview-text">{msg.message}</p>
                  </div>
                  {!msg.isRead && <div className="msg-dot" />}
                </div>
              ))}
            </div>

            {/* Detail panel */}
            <div className="msg-detail">
              {selected ? (
                <>
                  <div className="msg-detail-top">
                    <div className="msg-detail-av">
                      {selected.senderName?.[0]?.toUpperCase()}
                    </div>
                    <div className="msg-detail-meta">
                      <h3>{selected.senderName}</h3>
                      <a href={`mailto:${selected.senderEmail}`}>
                        {selected.senderEmail}
                      </a>
                    </div>
                    <span className="msg-detail-time">
                      {formatDate(selected.createdAt)}
                    </span>
                  </div>
                  <div className="msg-detail-body">
                    <p>{selected.message}</p>
                  </div>
                  <div className="msg-detail-footer">
                    <a
                      href={`mailto:${selected.senderEmail}?subject=Re: Your Portfolio Pro Message`}
                      className="msg-reply-btn"
                    >
                      ✉ Reply via Email
                    </a>
                  </div>
                </>
              ) : (
                <div className="msg-detail-placeholder">
                  <span>✉</span>
                  <p>Select a message to read</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
