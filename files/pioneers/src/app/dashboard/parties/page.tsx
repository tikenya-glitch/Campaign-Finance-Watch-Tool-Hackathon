"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getParties, getCandidates } from "@/actions";
import { Building2, Search, Filter, Plus, Users, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PartiesPage() {
  const [parties, setParties] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [ideologyFilter, setIdeologyFilter] = useState("");

  const fetchParties = async (searchTerm?: string, ideology?: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await getParties(1, 50, searchTerm, ideology);
      if (response.success) {
        setParties(response.body?.items || []);
      } else {
        setError(response.message || "Failed to fetch parties");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await getCandidates(1, 100);
      if (response.success) {
        setCandidates(response.body?.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
    }
  };

  useEffect(() => {
    fetchParties();
    fetchCandidates();
  }, []);

  useEffect(() => {
    fetchParties(search, ideologyFilter);
  }, [search, ideologyFilter]);

  // Count candidates per party
  const getCandidateCount = (partyId: number) => {
    return candidates.filter(candidate => candidate.party_id === partyId).length;
  };

  const getIdeologyColor = (ideology: string) => {
    switch (ideology?.toLowerCase()) {
      case "center": return "default";
      case "center-left": return "secondary";
      case "center-right": return "destructive";
      case "left": return "secondary";
      case "right": return "destructive";
      default: return "outline";
    }
  };

  if (loading && parties.length === 0) {
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
          <h2 className="text-3xl font-bold tracking-tight">Political Parties</h2>
          <p className="text-muted-foreground">
            Overview of registered political parties and their candidates
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Party
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
            placeholder="Search parties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={ideologyFilter} onValueChange={setIdeologyFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Ideologies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Ideologies</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="center-left">Center-Left</SelectItem>
            <SelectItem value="center-right">Center-Right</SelectItem>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Parties Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : parties.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No parties found matching your criteria
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {parties.map((party) => (
              <Card key={party.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{party.name}</CardTitle>
                        <CardDescription>{party.abbreviation || party.name} • Founded {party.founded_year || "Unknown"}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={getIdeologyColor(party.ideology)}>{party.ideology || "Unknown"}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Candidates</span>
                      </div>
                      <span className="font-semibold">{getCandidateCount(party.id)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Headquarters</span>
                      <span className="text-sm">{party.headquarters || "Nairobi"}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Registration</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/parties/${party.id}`}>View Details</Link>
                    </Button>
                    <Button size="sm">View Candidates</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{parties.length}</div>
                <p className="text-xs text-muted-foreground">Registered Parties</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{candidates.length}</div>
                <p className="text-xs text-muted-foreground">Total Candidates</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {[...new Set(parties.map(p => p.ideology).filter(Boolean))].length}
                </div>
                <p className="text-xs text-muted-foreground">Ideologies</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {parties.length > 0 
                    ? Math.min(...parties.map(p => p.founded_year).filter(year => year && year > 0)) 
                    : "N/A"
                  }
                </div>
                <p className="text-xs text-muted-foreground">Oldest Party</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
