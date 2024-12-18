import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

// Replace with your deployed contract address
const contractAddress = "0x14eDA536754d1753590adD974429adD417B50eE1"; 
// Replace with your contract ABI (the JSON output after compilation)
const contractABI =[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "hospital",
				"type": "address"
			}
		],
		"name": "addHospital",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "patientId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "condition",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "treatment",
				"type": "string"
			}
		],
		"name": "addPatientRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "hospital",
				"type": "address"
			}
		],
		"name": "removeHospital",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "patientId",
				"type": "uint256"
			}
		],
		"name": "getPatientRecord",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "condition",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "treatment",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const HealthcareRecords = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientCondition, setPatientCondition] = useState("");
  const [patientTreatment, setPatientTreatment] = useState("");
  const [error, setError] = useState("");
  const [tamperingError, setTamperingError] = useState(""); // Tampering error state
  const [patientRecord, setPatientRecord] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      // Connect to Ethereum
      if (typeof window.ethereum !== "undefined") {
        const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);
        const signer = tempProvider.getSigner();
        const userAddress = await signer.getAddress();
        setWalletAddress(userAddress);
        const tempContract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(tempContract);
      } else {
        setError("Please install MetaMask.");
      }
    };
    initialize();
  }, []);

  // Add patient record function with tampering detection
  const addPatientRecord = async () => {
    try {
      if (!patientId || !patientName || !patientCondition || !patientTreatment) {
        setError("All fields are required.");
        return;
      }

      // Check if the patient already has a record
      const existingRecord = await contract.getPatientRecord(patientId);

      if (existingRecord[0] && existingRecord[0] !== "") {
        setTamperingError("Warning: This patient ID already exists. Record might be tampered!");
        return;
      }

      // Add patient record if it doesn't exist
      const tx = await contract.addPatientRecord(
        patientId,
        patientName,
        patientCondition,
        patientTreatment
      );
      await tx.wait(); // Wait for the transaction to be mined
      setTamperingError(""); // Clear tampering error
      setError("");
      alert("Record added successfully!");
    } catch (err) {
      console.error("Error adding record:", err);
      setError("Error adding record.");
    }
  };

  // Fetch patient record function
  const fetchPatientRecord = async () => {
    try {
      if (!patientId) {
        setError("Patient ID is required.");
        return;
      }

      const record = await contract.getPatientRecord(patientId);
      setPatientRecord(record);
      setError("");
      setTamperingError(""); // Clear tampering error
    } catch (err) {
      console.error("Error fetching record:", err);
      setError("Error fetching record.");
    }
  };

  return (
    <div className="healthcare-container">
      <h1>Healthcare Records Management</h1>
      <div>
        <h2>Add Patient Record</h2>
        <input
          type="number"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Condition"
          value={patientCondition}
          onChange={(e) => setPatientCondition(e.target.value)}
        />
        <input
          type="text"
          placeholder="Treatment"
          value={patientTreatment}
          onChange={(e) => setPatientTreatment(e.target.value)}
        />
        <button onClick={addPatientRecord}>Add Record</button>
      </div>
      <div>
        <h2>Fetch Patient Record</h2>
        <input
          type="number"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <button onClick={fetchPatientRecord}>Fetch Record</button>
      </div>
      {patientRecord && (
        <div>
          <h3>Patient Record</h3>
          <p>Name: {patientRecord[0]}</p>
          <p>Condition: {patientRecord[1]}</p>
          <p>Treatment: {patientRecord[2]}</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {tamperingError && <p className="error tampering">{tamperingError}</p>} {/* Display tampering warning */}
      {walletAddress && <p>Connected Wallet: {walletAddress}</p>}
    </div>
  );
};

export default HealthcareRecords;
