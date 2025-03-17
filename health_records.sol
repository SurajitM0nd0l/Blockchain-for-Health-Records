// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract HealthRecords {
    struct Record {
        string data;
        address owner;
        uint256 timestamp;
    }
    
    mapping(address => Record[]) private patientRecords;
    mapping(address => mapping(address => bool)) private accessPermissions;

    event RecordAdded(address indexed patient, string data, uint256 timestamp);
    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);

    modifier onlyOwner() {
        require(patientRecords[msg.sender].length > 0, "No records found");
        _;
    }
    
    function addRecord(string memory _data) public {
        patientRecords[msg.sender].push(Record({
            data: _data,
            owner: msg.sender,
            timestamp: block.timestamp
        }));
        emit RecordAdded(msg.sender, _data, block.timestamp);
    }
    
    function grantAccess(address _doctor) public {
        accessPermissions[msg.sender][_doctor] = true;
        emit AccessGranted(msg.sender, _doctor);
    }
    
    function revokeAccess(address _doctor) public {
        accessPermissions[msg.sender][_doctor] = false;
        emit AccessRevoked(msg.sender, _doctor);
    }
    
    function getRecords(address _patient) public view returns (Record[] memory) {
        require(msg.sender == _patient || accessPermissions[_patient][msg.sender], "Access denied");
        return patientRecords[_patient];
    }
}
