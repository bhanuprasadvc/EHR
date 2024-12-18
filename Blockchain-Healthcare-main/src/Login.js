import React, { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [activeTab, setActiveTab] = useState("hospital"); // Manage active tab state
  const [hospitalID, setHospitalID] = useState("");
  const [doctorID, setDoctorID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(""); // Clear error when switching tabs
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (typeof window.ethereum === "undefined") {
      setError("MetaMask is not installed. Please install it to proceed.");
      return;
    }

    try {
      // Connect to MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      // Generate a message for signing
      let id = "";
      if (activeTab === "hospital") id = hospitalID;
      if (activeTab === "doctor") id = doctorID;

      const message = `Login request for ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ID: ${id}`;
      const signature = await signer.signMessage(message);

      console.log("Signature:", signature);

      // Example validation
      const validID = "123";
      const validPassword = "password123";
      const validWalletAddress = "0x5a3108b2496447CB97aaDD0707150c988C35684d";

      console.log("Connected Wallet Address:", address);
      console.log("Expected Wallet Address:", validWalletAddress);

      if (id === validID && password === validPassword) {
        if (ethers.utils.getAddress(address) === ethers.utils.getAddress(validWalletAddress)) {
          setError("");
          navigate("/healthcare"); // Navigate to the healthcare dashboard
        } else {
          setError("Unauthorized wallet address.");
        }
      } else {
        setError("Invalid ID or Password.");
      }
    } catch (err) {
      console.error("MetaMask Login Error:", err);
      setError("Failed to authenticate with MetaMask.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "hospital" ? "active" : ""}`}
            onClick={() => handleTabChange("hospital")}
          >
            Hospital
          </button>
          <button
            className={`tab-button ${activeTab === "doctor" ? "active" : ""}`}
            onClick={() => handleTabChange("doctor")}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleLogin}>
          {activeTab === "hospital" && (
            <>
              <h1>Hospital Login</h1>
              <input
                type="text"
                placeholder="Hospital ID"
                value={hospitalID}
                onChange={(e) => setHospitalID(e.target.value)}
                className="login-input"
                required
              />
            </>
          )}
          {activeTab === "doctor" && (
            <>
              <h1>Doctor Login</h1>
              <input
                type="text"
                placeholder="Doctor ID"
                value={doctorID}
                onChange={(e) => setDoctorID(e.target.value)}
                className="login-input"
                required
              />
            </>
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {walletAddress && <p>Connected Wallet: {walletAddress}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
