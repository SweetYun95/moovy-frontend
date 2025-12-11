// moovy-frontend/src/pages/auth/TestAuthPage.tsx
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  test_loginThunk,
  test_joinThunk,
  test_logoutThunk,
  test_hydrateAuthThunk,
} from "@/features/auth/test_authSlice";

export default function TestAuthPage() {
  const dispatch = useAppDispatch();
  // rootReducer에 testAuth를 추가해야 함. 아직 추가 안했으면 에러 날 수 있음.
  // @ts-ignore
  const { user, isAuthenticated, loading, error, provider } = useAppSelector(
    (state) => state.testAuth || {},
  );

  const [mode, setMode] = useState<"LOGIN" | "JOIN">("LOGIN");

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // 페이지 진입 시 세션 체크
    dispatch(test_hydrateAuthThunk());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "LOGIN") {
      await dispatch(test_loginThunk({ email, password }));
    } else {
      const res = await dispatch(
        test_joinThunk({ email, password, name }),
      );
      if (test_joinThunk.fulfilled.match(res)) {
        alert("회원가입 성공! 로그인해주세요.");
        setMode("LOGIN");
      }
    }
  };

  const handleLogout = () => {
    dispatch(test_logoutThunk());
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Test Auth Page</h1>

      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3>Current State</h3>
        <pre style={{ background: "#f4f4f4", padding: "1rem" }}>
          {JSON.stringify(
            { isAuthenticated, user, loading, error, provider },
            null,
            2,
          )}
        </pre>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              background: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </div>

      {!isAuthenticated && (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "2rem",
            borderRadius: "8px",
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <button
              onClick={() => setMode("LOGIN")}
              style={{
                marginRight: "1rem",
                fontWeight: mode === "LOGIN" ? "bold" : "normal",
              }}
            >
              Login
            </button>
            <button
              onClick={() => setMode("JOIN")}
              style={{ fontWeight: mode === "JOIN" ? "bold" : "normal" }}
            >
              Join
            </button>
          </div>

          <h2>{mode === "LOGIN" ? "Login" : "Join"}</h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label>Email: </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <div>
              <label>Password: </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>

            {mode === "JOIN" && (
              <>
                <div>
                  <label>Name: </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ width: "100%", padding: "0.5rem" }}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem",
                background: "blue",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              {loading ? "Processing..." : mode === "LOGIN" ? "Login" : "Join"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
