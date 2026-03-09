import Dashboard from '../components/Dashboard';
import Leaderboard from '../components/Leaderboard';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          NuruLens
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Kenya&apos;s campaign finance transparency platform. Track funding, monitor compliance, and strengthen public trust in the electoral process.
        </p>
      </div>

      <Dashboard />
      <Leaderboard />
    </div>
  );
}
