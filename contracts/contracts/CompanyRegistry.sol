// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CompanyRegistry {
    struct CompanyRecord {
        string company_id;
        string name;
        string registration_number;
        string contact;
        string ipfs_hash;
        uint256 verification_timestamp;
        string previous_hash;
        string status;
    }

    mapping(string => CompanyRecord[]) public companyHistory;
    mapping(string => string) public latestHash;

    event RecordAdded(
        string indexed company_id,
        string ipfs_hash,
        uint256 verification_timestamp
    );

    function addRecord(
        string memory _company_id,
        string memory _name,
        string memory _registration_number,
        string memory _contact,
        string memory _ipfs_hash,
        string memory _status
    ) public {
        string memory previousHash = latestHash[_company_id];

        CompanyRecord memory newRecord = CompanyRecord({
            company_id: _company_id,
            name: _name,
            registration_number: _registration_number,
            contact: _contact,
            ipfs_hash: _ipfs_hash,
            verification_timestamp: block.timestamp,
            previous_hash: previousHash,
            status: _status
        });

        companyHistory[_company_id].push(newRecord);

        // For the PoC, we'll use the IPFS hash as the "hash" of the current state.
        latestHash[_company_id] = _ipfs_hash;

        emit RecordAdded(_company_id, _ipfs_hash, block.timestamp);
    }

    function getCompanyHistory(string memory _company_id) public view returns (CompanyRecord[] memory) {
        return companyHistory[_company_id];
    }
}
