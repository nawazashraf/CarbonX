// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/access/Ownable.sol";

contract CarbonX is ERC20,Ownable {
    constructor() ERC20("Carbon Credits","CO2") Ownable(msg.sender){
        
    }

    struct Project {
        uint id;
        string name;
        string location;
        uint creditsRequested;
        uint creditsApproved;
        bool isVerified;
        address projectOwner;
    }

    uint public totalRetiredCredits;
    uint public projectCount;
    uint public totalIssuedCredits;

    event CreditMinted(
        address to,
        uint credits
    );
    event CreditsBurned(
        address from,
        uint amount
    );
    event ProjectCreated(
        uint indexed projectId,
        string name,
        address indexed projectOwner
    );
    event ProjectVerified(
        uint indexed projectId,
        string name,
        address indexed projectOwner,
        uint approvedCredits
    );
        
    mapping (uint => Project) public  projects;

    function createProject(
        string memory name,
        string memory location,
        uint creditsRequested
    ) public {
        require(creditsRequested > 0, "Credits must be greater than zero");

        projectCount++;
        projects[projectCount] = Project({
            id: projectCount,
            name: name,
            location: location,
            creditsRequested: creditsRequested,
            creditsApproved: 0,
            isVerified: false,
            projectOwner: msg.sender
        });

        emit ProjectCreated(
            projectCount, name, msg.sender
        );

    }

    function verifyProject(
        uint id,
        uint approvedCredits
        ) public onlyOwner {
        require(approvedCredits > 0, "Approved credits must be greater than zero");
        require(id > 0 && id <= projectCount, "Invalid project");

        Project storage project = projects[id];

        require(!project.isVerified, "Already verified");
        require(approvedCredits <= project.creditsRequested,"Cannot approve more than requested");



        project.isVerified = true;
        project.creditsApproved = approvedCredits;

        uint mintAmount = approvedCredits * 10**decimals();

        _mint(project.projectOwner, mintAmount);

        emit CreditMinted(
            project.projectOwner,
            approvedCredits
        );
        totalIssuedCredits += approvedCredits;
        emit ProjectVerified(
            project.id,
            project.name,
            project.projectOwner,
            approvedCredits
        );
    }

    function getProject(uint id) public view
        returns (
            uint,
            string memory,
            string memory,
            uint,
            uint,
            bool,
            address
        ) {
        require(id > 0 && id <= projectCount, "Project not found");

        Project memory project = projects[id];

        return (
            project.id,
            project.name,
            project.location,
            project.creditsRequested,
            project.creditsApproved,
            project.isVerified,
            project.projectOwner
        );
    }   



    function activeCredits() public view returns(uint) {
        return totalIssuedCredits - totalRetiredCredits;
    }


    // function mint(address to,uint amount) public onlyOwner {
    //     uint mintAmount = amount * 10**decimals();
    //     _mint(to, mintAmount);
    //     emit CreditMinted(to, mintAmount);
    // }

    function burn(uint amount) public {
        require(amount > 0, "Amount must be greater than zero");
        uint burnAmount = amount * 10**decimals();
        _burn(msg.sender, burnAmount);
        totalRetiredCredits += amount;
        emit CreditsBurned(msg.sender, amount);
    }

    
}