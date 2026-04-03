import LeaderboardFilters from '../../components/LeaderboardFilters';

export default function LeaderboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Transparency Leaderboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
          Compare candidates by funds raised, spending behavior, compliance with legal limits, and transparency scores. Filter by national, county, or constituency.
        </p>
      </div>
      <LeaderboardFilters />
    </div>
  );
}
