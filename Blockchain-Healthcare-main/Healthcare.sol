// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthcareRecords {
    address public owner;

    struct Record {
        uint256 recordID;
        uint256 patientID;
        string patientName;
        string diagnosis;
        string treatment;
        uint256 timestamp;
    }

    mapping(uint256 => Record[]) private patientRecords; // Mapping patientID to their records
    mapping(address => bool) private authorizedProviders; // Mapping of authorized healthcare providers

    event RecordAdded(uint256 indexed patientID, uint256 recordID, address indexed provider, uint256 timestamp);
    event ProviderAuthorized(address indexed provider, address indexed authorizedBy, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    modifier onlyAuthorizedProvider() {
        require(authorizedProviders[msg.sender], "You are not an authorized provider.");
        _;
    }

    constructor() {
        owner = msg.sender; // Set the owner as the contract deployer
    }

    // Function to authorize a healthcare provider
    function authorizeProvider(address provider) public onlyOwner {
        authorizedProviders[provider] = true;
        emit ProviderAuthorized(provider, msg.sender, block.timestamp);
    }

    // Function to add a patient record
    function addRecord(
        uint256 patientID,
        string memory patientName,
        string memory diagnosis,
        string memory treatment
    ) public onlyAuthorizedProvider {
        uint256 recordID = patientRecords[patientID].length + 1;
        patientRecords[patientID].push(
            Record(recordID, patientID, patientName, diagnosis, treatment, block.timestamp)
        );
        emit RecordAdded(patientID, recordID, msg.sender, block.timestamp);
    }

    // Function to get all records for a patient
    function getPatientRecords(uint256 patientID) public view returns (Record[] memory) {
        return patientRecords[patientID];
    }

    // Function to check if a provider is authorized
    function isAuthorized(address provider) public view returns (bool) {
        return authorizedProviders[provider];
    }
}
