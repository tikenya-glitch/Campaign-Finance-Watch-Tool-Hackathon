"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { getCounties } from "@/actions";
import * as Types from "@/types/action.interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CountiesTableProps {
  initialData?: {
    items: Types.County[];
    total: number;
    page: number;
    size: number;
    pages: number;
  };
  initialError?: string | null;
}

export default function CountiesTable({
  initialData,
  initialError,
}: CountiesTableProps) {
  const [data, setData] = useState<{
    items: Types.County[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }>({
    items: initialData?.items || [],
    total: initialData?.total || 0,
    page: initialData?.page || 1,
    size: initialData?.size || 10,
    pages: initialData?.pages || 1,
  });

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");

  const [pagination, setPagination] = useState({
    page: data.page,
    size: data.size,
    total: data.total,
    pages: data.pages,
  });

  const fetchCounties = async (
    page: number,
    size: number,
    search?: string,
    region?: string,
  ) => {
    setLoading(true);
    try {
      const result = await getCounties(page, size, search, region);
      if (result.success && result.body) {
        setData(result.body);
        setPagination({
          page: result.body.page,
          size: result.body.size,
          total: result.body.total,
          pages: result.body.pages,
        });
      }
    } catch (error) {
      console.error("Error fetching counties:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (!initialData && !initialError) {
      fetchCounties(1, 10, search, region);
    }
  }, []);

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    fetchCounties(newPage, pagination.size, search, region);
  };

  const handleSizeChange = (newSize: number) => {
    fetchCounties(1, newSize, search, region);
  };

  // Handle search and filters
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    fetchCounties(1, pagination.size, newSearch, region);
  };

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    fetchCounties(1, pagination.size, search, newRegion);
  };

  const columns = [
    {
      key: "code",
      label: "Code",
      render: (county: Types.County) => (
        <span className="font-mono">{county.code}</span>
      ),
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
      render: (county: Types.County) => (
        <span className="font-medium">{county.name}</span>
      ),
      sortable: true,
      filterable: true,
    },
    {
      key: "region",
      label: "Region",
      render: (county: Types.County) => <span>{county.region}</span>,
      sortable: true,
      filterable: true,
    },
    {
      key: "capital",
      label: "Capital",
      render: (county: Types.County) => <span>{county.capital || "-"}</span>,
      filterable: true,
    },
    {
      key: "area_sq_km",
      label: "Area (km²)",
      render: (county: Types.County) => (
        <span>{county.area_sq_km?.toLocaleString() || "-"}</span>
      ),
    },
    {
      key: "current_population",
      label: "Population",
      render: (county: Types.County) => (
        <span>{county.current_population?.toLocaleString() || "-"}</span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (county: Types.County) => (
        <span>{new Date(county.created_at).toLocaleDateString()}</span>
      ),
    },
  ];

  if (initialError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load counties data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{initialError}</p>
            <div className="mt-4">
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Kenyan Counties</h1>
        <p className="text-muted-foreground">
          Browse and search through Kenya's 47 counties with detailed
          information.
        </p>
      </div>

      <DataTable
        data={data.items}
        columns={columns}
        loading={loading}
        pagination={{
          page: pagination.page,
          size: pagination.size,
          total: pagination.total,
          pages: pagination.pages,
          onPageChange: handlePageChange,
          onSizeChange: handleSizeChange,
        }}
        search={{
          value: search,
          onChange: handleSearchChange,
          placeholder: "Search counties...",
        }}
        filters={{
          region: region,
        }}
        onFiltersChange={(filters) => {
          setRegion(filters.region || "");
        }}
      />
    </div>
  );
}
