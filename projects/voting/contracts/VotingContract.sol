// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract VotingContract is Ownable, ReentrancyGuard {
    constructor() Ownable(msg.sender) {}
    struct Poll {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 totalVotes;
        mapping(address => bool) hasVoted;
        mapping(uint256 => uint256) optionVotes; // optionId => voteCount
        string[] options;
    }

    struct PollInfo {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 totalVotes;
        string[] options;
        uint256[] voteCounts;
    }

    uint256 public pollCount;
    mapping(uint256 => Poll) public polls;
    
    event PollCreated(uint256 indexed pollId, string title, uint256 startTime, uint256 endTime);
    event VoteCast(uint256 indexed pollId, address indexed voter, uint256 optionId);
    event PollEnded(uint256 indexed pollId, uint256 winningOption);

    modifier pollExists(uint256 _pollId) {
        require(_pollId > 0 && _pollId <= pollCount, "Poll does not exist");
        _;
    }

    modifier pollActive(uint256 _pollId) {
        require(polls[_pollId].isActive, "Poll is not active");
        require(block.timestamp >= polls[_pollId].startTime, "Poll has not started");
        require(block.timestamp <= polls[_pollId].endTime, "Poll has ended");
        _;
    }

    modifier hasNotVoted(uint256 _pollId) {
        require(!polls[_pollId].hasVoted[msg.sender], "Already voted in this poll");
        _;
    }

    function createPoll(
        string memory _title,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime,
        string[] memory _options
    ) external onlyOwner {
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        require(_options.length >= 2, "Must have at least 2 options");

        pollCount++;
        Poll storage newPoll = polls[pollCount];
        newPoll.id = pollCount;
        newPoll.title = _title;
        newPoll.description = _description;
        newPoll.startTime = _startTime;
        newPoll.endTime = _endTime;
        newPoll.isActive = true;
        newPoll.totalVotes = 0;

        for (uint256 i = 0; i < _options.length; i++) {
            newPoll.options.push(_options[i]);
            newPoll.optionVotes[i] = 0;
        }

        emit PollCreated(pollCount, _title, _startTime, _endTime);
    }

    function vote(uint256 _pollId, uint256 _optionId) 
        external 
        pollExists(_pollId) 
        pollActive(_pollId) 
        hasNotVoted(_pollId) 
        nonReentrant 
    {
        require(_optionId < polls[_pollId].options.length, "Invalid option");
        
        polls[_pollId].hasVoted[msg.sender] = true;
        polls[_pollId].optionVotes[_optionId]++;
        polls[_pollId].totalVotes++;

        emit VoteCast(_pollId, msg.sender, _optionId);
    }

    function endPoll(uint256 _pollId) external onlyOwner pollExists(_pollId) {
        require(polls[_pollId].isActive, "Poll is already ended");
        require(block.timestamp > polls[_pollId].endTime, "Poll has not ended yet");

        polls[_pollId].isActive = false;
        
        uint256 winningOption = 0;
        uint256 maxVotes = 0;
        
        for (uint256 i = 0; i < polls[_pollId].options.length; i++) {
            if (polls[_pollId].optionVotes[i] > maxVotes) {
                maxVotes = polls[_pollId].optionVotes[i];
                winningOption = i;
            }
        }

        emit PollEnded(_pollId, winningOption);
    }

    function getPollInfo(uint256 _pollId) external view pollExists(_pollId) returns (PollInfo memory) {
        Poll storage poll = polls[_pollId];
        uint256[] memory voteCounts = new uint256[](poll.options.length);
        
        for (uint256 i = 0; i < poll.options.length; i++) {
            voteCounts[i] = poll.optionVotes[i];
        }

        return PollInfo({
            id: poll.id,
            title: poll.title,
            description: poll.description,
            startTime: poll.startTime,
            endTime: poll.endTime,
            isActive: poll.isActive,
            totalVotes: poll.totalVotes,
            options: poll.options,
            voteCounts: voteCounts
        });
    }

    function hasVoted(uint256 _pollId, address _voter) external view pollExists(_pollId) returns (bool) {
        return polls[_pollId].hasVoted[_voter];
    }

    function getActivePolls() external view returns (uint256[] memory) {
        uint256[] memory activePolls = new uint256[](pollCount);
        uint256 activeCount = 0;

        for (uint256 i = 1; i <= pollCount; i++) {
            if (polls[i].isActive && 
                block.timestamp >= polls[i].startTime && 
                block.timestamp <= polls[i].endTime) {
                activePolls[activeCount] = i;
                activeCount++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activePolls[i];
        }

        return result;
    }

    function getWinningOption(uint256 _pollId) external view pollExists(_pollId) returns (uint256) {
        require(!polls[_pollId].isActive, "Poll is still active");
        
        uint256 winningOption = 0;
        uint256 maxVotes = 0;
        
        for (uint256 i = 0; i < polls[_pollId].options.length; i++) {
            if (polls[_pollId].optionVotes[i] > maxVotes) {
                maxVotes = polls[_pollId].optionVotes[i];
                winningOption = i;
            }
        }

        return winningOption;
    }
}

