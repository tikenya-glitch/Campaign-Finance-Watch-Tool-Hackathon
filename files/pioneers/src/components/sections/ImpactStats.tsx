export default function ImpactStats() {
  const stats = [
    {
      value: "$2.5B+",
      label: "Total Donations Tracked",
      description: "Across all political entities"
    },
    {
      value: "1,247",
      label: "Suspicious Reports Submitted",
      description: "This year alone"
    },
    {
      value: "487",
      label: "Campaigns Monitored",
      description: "Active tracking"
    },
    {
      value: "94.2%",
      label: "Transparency Score",
      description: "Industry leading"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Making an Impact Together
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our platform is transforming political finance transparency across the nation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-lg font-medium text-blue-100">
                {stat.label}
              </div>
              <div className="text-sm text-blue-200 mt-2">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-xl text-blue-100 mb-6">
            Join thousands of citizens and organizations committed to financial transparency
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-medium shadow-lg hover:shadow-xl">
              Start Monitoring Today
            </button>
            <button className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-all font-medium">
              Download Report
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
