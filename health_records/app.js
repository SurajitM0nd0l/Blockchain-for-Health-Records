// SPDX-License-Identifier: MIT
// Ensure you replace with your actual deployed contract address and ABI

const contractAddress = "0xaa5e4c931672c87973bc1efa0d30b93b8102c8ea"; // Replace with your contract address
const contractABI = [
    {
        "inputs": [{"internalType": "string","name": "_data","type": "string"}],
        "name": "addRecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address","name": "_doctor","type": "address"}],
        "name": "grantAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address","name": "_doctor","type": "address"}],
        "name": "revokeAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address","name": "_patient","type": "address"}],
        "name": "getRecords",
        "outputs": [{"internalType": "struct HealthRecords.Record[]","name":"","type": "tuple[]"}],
        "stateMutability": "view",
        "type": "function"
    }
];

let provider, signer, contract;

// Function to connect wallet
async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        alert("Wallet connected!");
    } else {
        alert("Please install MetaMask!");
    }
}

// Function to add a health record
async function addRecord() {
    const data = document.getElementById("recordData").value;
    if (!data) {
        alert("Please enter health data!");
        return;
    }

    try {
        const tx = await contract.addRecord(data);
        await tx.wait();
        alert("Record added successfully!");
    } catch (error) {
        alert("Error adding record: " + error.message);
    }
}

// Function to grant access
async function grantAccess() {
    const doctor = document.getElementById("doctorAddress").value;
    if (!ethers.utils.isAddress(doctor)) {
        alert("Invalid doctor address!");
        return;
    }

    try {
        const tx = await contract.grantAccess(doctor);
        await tx.wait();
        alert("Access granted!");
    } catch (error) {
        alert("Error granting access: " + error.message);
    }
}

// Function to revoke access
async function revokeAccess() {
    const doctor = document.getElementById("revokeAddress").value;
    if (!ethers.utils.isAddress(doctor)) {
        alert("Invalid doctor address!");
        return;
    }

    try {
        const tx = await contract.revokeAccess(doctor);
        await tx.wait();
        alert("Access revoked!");
    } catch (error) {
        alert("Error revoking access: " + error.message);
    }
}

// Function to fetch health records
async function getRecords() {
    const patient = document.getElementById("patientAddress").value;
    if (!ethers.utils.isAddress(patient)) {
        alert("Invalid patient address!");
        return;
    }

    try {
        const records = await contract.getRecords(patient);
        let output = "Health Records:\n";
        records.forEach((record, index) => {
            output += `${index + 1}. ${record.data} (Timestamp: ${new Date(record.timestamp * 1000).toLocaleString()})\n`;
        });
        document.getElementById("output").innerText = output;
    } catch (error) {
        alert("Error fetching records: " + error.message);
    }
}
