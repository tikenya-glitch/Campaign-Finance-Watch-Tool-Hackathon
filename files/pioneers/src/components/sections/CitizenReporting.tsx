export default function CitizenReporting() {
  return (
    <section id="portal" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            What Would You Like to Report?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help maintain political finance transparency by reporting suspicious activities or violations. Your voice matters in ensuring accountability.
          </p>
        </div>

        {/* Report Options - Creative Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-red-50 to-pink-50 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200 to-pink-200 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative">
              <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full mb-4">
                HIGH PRIORITY
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Suspicious Donations</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">Unusual contribution patterns, questionable donor sources, or potentially illegal campaign financing activities that warrant investigation.</p>
                          </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-orange-50 to-amber-50 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative">
              <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full mb-4">
                FINANCIAL IRREGULARITIES
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Hidden Assets</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">Undeclared income streams, concealed financial holdings, or missing disclosure statements that violate transparency requirements.</p>
                          </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-yellow-50 to-amber-50 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative">
              <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full mb-4">
                LEGAL VIOLATIONS
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Compliance Issues</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">Campaign finance law violations, regulatory breaches, or ethical guideline infractions that compromise electoral integrity.</p>
              
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-purple-50 to-indigo-50 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative">
              <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-4">
                OTHER CONCERNS
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Transparency Issues</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">Any other political finance irregularities, transparency gaps, or accountability concerns that threaten democratic processes.</p>
              
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Make a Report?</h3>
            <p className="text-blue-100 mb-6 max-w-lg mx-auto">
              Your report helps ensure political accountability and transparency. All submissions are reviewed by our expert team.
            </p>
            <button 
              onClick={() => window.location.href = '/report'}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Submit Your Report
            </button>
            
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Secure & Confidential</h4>
            <p className="text-gray-600 text-sm">256-bit encryption protection</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Quick Review</h4>
            <p className="text-gray-600 text-sm">24-48 hour response time</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Expert Analysis</h4>
            <p className="text-gray-600 text-sm">Professional review team</p>
          </div>
        </div>
      </div>
    </section>
  );
}
