import React from 'react';

const TeamMember = ({ name, role, bio }) => {
  return (
    <div className="bg-card-light dark:bg-card rounded-lg p-6 text-center shadow-md border dark:border-zinc-900">
      <h3 className="text-xl font-semibold text-zinc-700 dark:text-white">{name}</h3>
      <p className="text-green-400 mb-4">{role}</p>
      <p className="text-sm text-zinc-400 dark:text-white">{bio}</p>
    </div>
  );
};

export default TeamMember;