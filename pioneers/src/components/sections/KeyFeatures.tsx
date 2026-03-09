export default function KeyFeatures() {
  const features = [
    {
      image: "https://i.pinimg.com/736x/b5/13/ca/b513ca2b15a7be74d0ba081179c992d4.jpg",
      title: "Analyze Political Donations",
      description: "Advanced financial analytics provide insights into donation patterns, trends, and anomalies across all political entities.",
      linkText: "Explore Analytics"
    },
    {
      image: "https://i.pinimg.com/736x/57/b4/fe/57b4fef1ad63a4c9b3a2a0395ca69cb4.jpg",
      title: "Report Suspicious Activity",
      description: "Secure platform for uploading documents and submitting evidence of potentially illegal or unethical financial activities.",
      linkText: "Submit Report"
    },
    {
      image: "https://i.pinimg.com/1200x/8d/3e/f4/8d3ef40998b6543c4fb3208c9f61958e.jpg",
      title: "Promote Transparency",
      description: "Public access to political finance data ensures accountability and fosters trust in democratic processes and institutions.",
      linkText: "View Public Data"
    }
  ];

  return (
    <section id="features" className="py-24  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Powerful Tools for Financial Transparency
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Advanced analytics, real-time monitoring, and comprehensive reporting tools designed to ensure accountability in political financing.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    <span>{feature.linkText}</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
