import CountiesTable from "@/components/data/CountiesTable";
import { getCounties } from "@/actions";

export default async function CountiesDashboardPage() {
  // Fetch initial data on server
  let data = null;
  let error = null;

  try {
    const result = await getCounties(1, 10);
    if (result.success && result.body) {
      data = result.body;
    } else {
      error = "Failed to load counties data";
    }
  } catch (err) {
    error = "An error occurred while loading counties data";
  }

  return <CountiesTable initialData={data || undefined} initialError={error} />;
}
