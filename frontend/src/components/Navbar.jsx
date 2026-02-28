import { useState } from "react";

export default function Navbar({
  walletAddress,
  onConnect,
  onDisconnect,
  onNavigate,
}) {
  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a
          href="#"
          className="navbar-logo"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.("home");
          }}
        >
          <div className="navbar-logo-icon">⚡</div>
          GigBounty
        </a>

        <ul className="navbar-links">
          <li>
            <a
              href="#tasks"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.("tasks");
              }}
            >
              Browse Tasks
            </a>
          </li>
          <li>
            <a
              href="#post"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.("post");
              }}
            >
              Post a Task
            </a>
          </li>
          <li>
            <a
              href="#how"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.("how");
              }}
            >
              How It Works
            </a>
          </li>
        </ul>

        <div className="navbar-actions">
          {walletAddress ? (
            <>
              <div className="navbar-wallet">
                <span className="navbar-wallet-dot"></span>
                {truncateAddress(walletAddress)}
              </div>
              <button
                className="btn btn-secondary"
                onClick={onDisconnect}
                style={{
                  padding: "8px 16px",
                  minHeight: "36px",
                  fontSize: "12px",
                }}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onConnect}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
