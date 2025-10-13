const TeamCard = ({ name, role, image, bio }) => (
  <div className="bg-zinc-900 rounded-lg p-4 text-center">
    <img src={image} alt={name} className="w-24 h-24 rounded-full mx-auto mb-3" />
    <h3 className="text-lg font-semibold text-white">{name}</h3>
    <p className="text-sm text-gray-400">{role}</p>
    <p className="mt-2 text-gray-300 text-sm">{bio}</p>
  </div>
);

export default TeamCard;
