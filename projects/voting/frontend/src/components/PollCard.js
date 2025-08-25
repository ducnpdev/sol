import React, { useState, useEffect } from 'react';

const PollCard = ({ poll, onVote, onEndPoll, account, contract, isOwner }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [winningOption, setWinningOption] = useState(null);
  const [loading, setLoading] = useState(false);

  const now = Math.floor(Date.now() / 1000);
  const isActive = poll.isActive && poll.startTime <= now && poll.endTime >= now;
  const isUpcoming = poll.startTime > now;
  const isEnded = !poll.isActive || poll.endTime < now;

  useEffect(() => {
    if (contract && account) {
      checkVotingStatus();
    }
  }, [contract, account, poll.id]);

  useEffect(() => {
    if (isEnded && contract) {
      getWinningOption();
    }
  }, [isEnded, contract, poll.id]);

  const checkVotingStatus = async () => {
    try {
      const voted = await contract.hasVoted(poll.id, account);
      setHasVoted(voted);
    } catch (error) {
      console.error('Error checking voting status:', error);
    }
  };

  const getWinningOption = async () => {
    try {
      const winning = await contract.getWinningOption(poll.id);
      setWinningOption(winning);
    } catch (error) {
      console.error('Error getting winning option:', error);
    }
  };

  const handleVote = async (optionId) => {
    if (loading) return;
    
    setLoading(true);
    try {
      await onVote(poll.id, optionId);
      setHasVoted(true);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndPoll = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      await onEndPoll(poll.id);
    } catch (error) {
      console.error('Error ending poll:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      );
    } else if (isUpcoming) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Upcoming
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Ended
        </span>
      );
    }
  };

  const getTotalVotes = () => {
    return poll.voteCounts.reduce((sum, count) => sum + count, 0);
  };

  const getPercentage = (votes) => {
    const total = getTotalVotes();
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {poll.title}
          </h3>
          {getStatusBadge()}
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          {poll.description}
        </p>

        <div className="text-xs text-gray-500 mb-4">
          <div>Start: {formatTime(poll.startTime)}</div>
          <div>End: {formatTime(poll.endTime)}</div>
          <div>Total Votes: {getTotalVotes()}</div>
        </div>

        {/* Voting Options */}
        <div className="space-y-3 mb-4">
          {poll.options.map((option, index) => {
            const voteCount = poll.voteCounts[index];
            const percentage = getPercentage(voteCount);
            const isWinning = winningOption !== null && winningOption === index;
            
            return (
              <div key={index} className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {isActive && !hasVoted && (
                      <button
                        onClick={() => handleVote(index)}
                        disabled={loading}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                      >
                        Vote
                      </button>
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {option}
                      {isWinning && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Winner
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {voteCount} votes ({percentage}%)
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      isWinning ? 'bg-yellow-500' : 'bg-primary-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* User voting status */}
        {hasVoted && (
          <div className="text-sm text-green-600 mb-4">
            ✓ You have voted in this poll
          </div>
        )}

        {/* Owner actions */}
        {isOwner && isEnded && poll.isActive && (
          <button
            onClick={handleEndPoll}
            disabled={loading}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Ending...' : 'End Poll'}
          </button>
        )}

        {/* Poll results for ended polls */}
        {isEnded && winningOption !== null && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm font-medium text-gray-900">
              Winning Option: {poll.options[winningOption]}
            </div>
            <div className="text-sm text-gray-500">
              with {poll.voteCounts[winningOption]} votes
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollCard;
