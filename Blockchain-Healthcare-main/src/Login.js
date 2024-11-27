import React, { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [hospitalID, setHospitalID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!hospitalID || !password) {
      setError("Please enter both Hospital ID and Password.");
      return;
    }

    if (typeof window.ethereum === "undefined") {
      setError("MetaMask is not installed. Please install it to proceed.");
      return;
    }

    try {
      // Prompt MetaMask to connect
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Display connected wallet address
      setWalletAddress(address);

      // Example: Generate a signature for login
      const message = `Login request for Hospital ID: ${hospitalID}`;
      const signature = await signer.signMessage(message);

      console.log("Signature:", signature);

      // Verify login credentials (can be extended with backend validation)
      const validHospitalID = "hospital123";
      const validPassword = "password123";

      if (hospitalID === validHospitalID && password === validPassword) {
        // Perform wallet verification (example logic)
        const validWalletAddress = "0xf1dc2201651283704302FeeC20Ec74EAAE47D80E";
        if (address.toLowerCase() === validWalletAddress.toLowerCase()) {
          setError("");
          navigate("/healthcare"); // Redirect on success
        } else {
          setError("Unauthorized wallet address.");
        }
      } else {
        setError("Invalid Hospital ID or Password.");
      }
    } catch (err) {
      console.error("MetaMask Login Error:", err);
      setError("Failed to authenticate with MetaMask.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Hospital Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Hospital ID"
            value={hospitalID}
            onChange={(e) => setHospitalID(e.target.value)}
            className="login-input"
            required
          />
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
