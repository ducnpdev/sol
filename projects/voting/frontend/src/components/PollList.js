import React, { useState, useEffect } from 'react';
import PollCard from './PollCard';

const PollList = ({ contract, account, isOwner }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (contract) {
      loadPolls();
    }
  }, [contract]);

  const loadPolls = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test contract connection first
      try {
        await contract.owner();
      } catch (error) {
        throw new Error("Contract connection failed. Please check your network connection.");
      }

      // Get all polls (we'll need to iterate through pollCount)
      const pollCount = await contract.pollCount();
      const allPolls = [];

      for (let i = 1; i <= pollCount; i++) {
        try {
          const pollInfo = await contract.getPollInfo(i);
          allPolls.push(pollInfo);
        } catch (error) {
          console.error(`Error loading poll ${i}:`, error);
        }
      }

      // Sort polls by creation time (newest first)
      allPolls.sort((a, b) => b.id - a.id);
      setPolls(allPolls);
    } catch (error) {
      console.error('Error loading polls:', error);
      setError(error.message || 'Failed to load polls. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      const tx = await contract.vote(pollId, optionId);
      await tx.wait();
      
      // Reload polls to show updated results
      await loadPolls();
      
      alert('Vote cast successfully!');
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('Failed to cast vote. Please try again.');
    }
  };

  const handleEndPoll = async (pollId) => {
    try {
      const tx = await contract.endPoll(pollId);
      await tx.wait();
      
      // Reload polls to show updated status
      await loadPolls();
      
      alert('Poll ended successfully!');
    } catch (error) {
      console.error('Error ending poll:', error);
      alert('Failed to end poll. Please try again.');
    }
  };

  const getActivePolls = () => {
    const now = Math.floor(Date.now() / 1000);
    return polls.filter(poll => 
      poll.isActive && 
      poll.startTime <= now && 
      poll.endTime >= now
    );
  };

  const getUpcomingPolls = () => {
    const now = Math.floor(Date.now() / 1000);
    return polls.filter(poll => poll.startTime > now);
  };

  const getEndedPolls = () => {
    const now = Math.floor(Date.now() / 1000);
    return polls.filter(poll => 
      !poll.isActive || poll.endTime < now
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadPolls}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const activePolls = getActivePolls();
  const upcomingPolls = getUpcomingPolls();
  const endedPolls = getEndedPolls();

  return (
    <div className="space-y-8">
      {/* Active Polls */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Polls</h2>
        {activePolls.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No active polls</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no active polls to vote on.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activePolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={handleVote}
                onEndPoll={isOwner ? handleEndPoll : null}
                account={account}
                contract={contract}
                isOwner={isOwner}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Polls */}
      {upcomingPolls.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Polls</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={handleVote}
                onEndPoll={isOwner ? handleEndPoll : null}
                account={account}
                contract={contract}
                isOwner={isOwner}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ended Polls */}
      {endedPolls.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ended Polls</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {endedPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={handleVote}
                onEndPoll={isOwner ? handleEndPoll : null}
                account={account}
                contract={contract}
                isOwner={isOwner}
              />
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={loadPolls}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh Polls
        </button>
      </div>
    </div>
  );
};

export default PollList;
