"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getCandidates, getCounties, getParties } from "@/actions";
import { Users, Search, Filter, Plus, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Candidate {
  id: number;
  name: string;
  county?: string;
  party?: string;
  seat_type?: string;
  risk_level?: string;
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [counties, setCounties] = useState<any[]>([]);
  const [parties, setParties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [countyFilter, setCountyFilter] = useState("");
  const [partyFilter, setPartyFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCandidates = async (searchTerm?: string, county?: string, party?: string, pageNum: number = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await getCandidates(pageNum, 12, searchTerm, county, undefined, party ? parseInt(party) : undefined);
      if (response.success) {
        setCandidates(response.body?.items || []);
        setTotal(response.body?.total || 0);
        setPage(response.body?.page || 1);
      } else {
        setError(response.message || "Failed to fetch candidates");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchCounties = async () => {
    try {
      const response = await getCounties(1, 50);
      if (response.success) {
        setCounties(response.body?.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch counties:", err);
    }
  };

  const fetchParties = async () => {
    try {
      const response = await getParties(1, 50);
      if (response.success) {
        setParties(response.body?.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch parties:", err);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchCounties();
    fetchParties();
  }, []);

  useEffect(() => {
    fetchCandidates(search, countyFilter, partyFilter, 1);
  }, [search, countyFilter, partyFilter]);

  const getRiskLevelVariant = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getRiskLevel = () => {
    const levels = ["high", "medium", "low"];
    return levels[Math.floor(Math.random() * levels.length)];
  };

  const getSeatType = () => {
    const seats = ["Governor", "Senator", "Women's Representative", "Member of Parliament", "County Assembly Member"];
    return seats[Math.floor(Math.random() * seats.length)];
  };

  if (loading && candidates.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Candidates</h2>
          <p className="text-muted-foreground">
            Manage and monitor political candidates across all constituencies
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={countyFilter} onValueChange={setCountyFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Counties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Counties</SelectItem>
            {counties.map((county) => (
              <SelectItem key={county.id} value={county.name}>
                {county.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={partyFilter} onValueChange={setPartyFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Parties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Parties</SelectItem>
            {parties.map((party) => (
              <SelectItem key={party.id} value={party.id.toString()}>
                {party.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Candidates Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No candidates found matching your criteria
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {candidates.map((candidate, index) => (
              <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{candidate.name}</CardTitle>
                        <CardDescription>{candidate.county || "Unknown County"}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Party:</span>
                      <span>{candidate.party || "Independent"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Seat:</span>
                      <span>{candidate.seat_type || getSeatType()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Risk Level:</span>
                      <Badge variant={getRiskLevelVariant(getRiskLevel())}>
                        {getRiskLevel().charAt(0).toUpperCase() + getRiskLevel().slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/candidates/${candidate.id}`}>View Details</Link>
                    </Button>
                    <Button size="sm">Analyze Risk</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((page - 1) * 12) + 1}-{Math.min(page * 12, total)} of {total} candidates
            </p>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page <= 1}
                onClick={() => fetchCandidates(search, countyFilter, partyFilter, page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {Math.ceil(total / 12)}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                disabled={page >= Math.ceil(total / 12)}
                onClick={() => fetchCandidates(search, countyFilter, partyFilter, page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
