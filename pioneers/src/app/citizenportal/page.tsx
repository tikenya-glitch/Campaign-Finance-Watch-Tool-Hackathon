"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewStats } from "@/components/citizenportal/OverviewStats";
import { RecentTransactions } from "@/components/citizenportal/RecentTransactions";
import { RiskDistribution } from "@/components/citizenportal/RiskDistribution";
import { ChartsSection } from "@/components/citizenportal/ChartsSection";
import { PartyAnalysisTab } from "@/components/citizenportal/PartyAnalysisTab";
import { RiskAssessmentTab } from "@/components/citizenportal/RiskAssessmentTab";
import { TransactionsTab } from "@/components/citizenportal/TransactionsTab";
import { Header } from "@/components/citizenportal/Header";

// Mock data for demonstration
const overviewStats = {
  totalDonations: 45678901,
  donors: 12847,
  suspiciousTransactions: 23,
  complianceRate: 94.2,
  growthRate: 12.5
};

const recentTransactions = [
  {
    id: 1,
    donor: "John Smith",
    amount: 50000,
    recipient: "National Party",
    date: "2024-01-15",
    status: "verified",
    risk: "low"
  },
  {
    id: 2,
    donor: "ABC Corporation",
    amount: 250000,
    recipient: "Democratic Alliance",
    date: "2024-01-14",
    status: "pending",
    risk: "medium"
  },
  {
    id: 3,
    donor: "Jane Doe",
    amount: 15000,
    recipient: "Progressive Movement",
    date: "2024-01-13",
    status: "verified",
    risk: "low"
  },
  {
    id: 4,
    donor: "XYZ Holdings",
    amount: 750000,
    recipient: "Conservative Party",
    date: "2024-01-12",
    status: "flagged",
    risk: "high"
  }
];

const partyAnalysis = [
  {
    name: "National Party",
    totalFunds: 12500000,
    donors: 3421,
    growth: 8.5,
    compliance: 96.2
  },
  {
    name: "Democratic Alliance",
    totalFunds: 9800000,
    donors: 2847,
    growth: 15.3,
    compliance: 92.8
  },
  {
    name: "Progressive Movement",
    totalFunds: 7600000,
    donors: 1923,
    growth: 22.1,
    compliance: 94.5
  },
  {
    name: "Conservative Party",
    totalFunds: 11200000,
    donors: 3156,
    growth: 5.7,
    compliance: 89.3
  }
];

const riskAnalysis = {
  high: 4,
  medium: 18,
  low: 156,
  total: 178
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'verified': return 'text-green-600 bg-green-50 border-green-200';
    case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'flagged': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export default function CitizenPortal() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <OverviewStats stats={overviewStats} formatCurrency={formatCurrency} />

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="parties">Party Analysis</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentTransactions 
                transactions={recentTransactions}
                formatCurrency={formatCurrency}
                getStatusColor={getStatusColor}
                getRiskColor={getRiskColor}
              />
              <RiskDistribution riskAnalysis={riskAnalysis} />
            </div>
            <ChartsSection partyAnalysis={partyAnalysis} />
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <TransactionsTab 
              transactions={recentTransactions}
              formatCurrency={formatCurrency}
              getStatusColor={getStatusColor}
              getRiskColor={getRiskColor}
            />
          </TabsContent>

          {/* Party Analysis Tab */}
          <TabsContent value="parties" className="space-y-6">
            <PartyAnalysisTab 
              partyAnalysis={partyAnalysis}
              formatCurrency={formatCurrency}
            />
          </TabsContent>

          {/* Risk Assessment Tab */}
          <TabsContent value="risk" className="space-y-6">
            <RiskAssessmentTab 
              highRiskTransactions={[
                { name: "XYZ Holdings", recipient: "Conservative Party", amount: 750000, status: "Flagged" }
              ]}
              mediumRiskTransactions={[
                { name: "ABC Corporation", recipient: "Democratic Alliance", amount: 250000, status: "Pending" }
              ]}
              lowRiskTransactions={[
                { name: "John Smith", recipient: "National Party", amount: 50000, status: "Verified" }
              ]}
              formatCurrency={formatCurrency}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}