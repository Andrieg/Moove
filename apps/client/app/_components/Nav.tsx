"use client";

import { useEffect, useState } from "react";
import { getToken, clearToken } from "@moove/api-client";

export default function Nav() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getToken());
  }, []);

  function logout() {
    clearToken();
    window.location.href = "/login";
  }

  return (
    <nav style={{
      padding: "12px 24px",
      borderBottom: "1px solid #e5e5e5",
      display: "flex",
      gap: 16,
      alignItems: "center",
      flexWrap: "wrap",
    }}>
      <a href="/" style={{ fontWeight: "bold", marginRight: "auto" }}>
        Moove
      </a>
      
      {hasToken ? (
        <>
          <a href="/me">Profile</a>
          <a href="/videos">Videos</a>
          <a href="/challenges">Challenges</a>
          <button onClick={logout} style={{ padding: "4px 12px" }}>
            Logout
          </button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
}
