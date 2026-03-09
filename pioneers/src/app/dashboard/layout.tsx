import { getCurrentUser } from "@/actions";
import { DashboardLayoutClient } from "@/components/layout/DashboardLayoutClient";
import * as Types from "@/types/action.interfaces";

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user data for the layout
  let user = null;
  try {
    const result = await getCurrentUser();
    if (result.success && result.body) {
      user = result.body;
    }
  } catch (err) {
    // User data not available for layout
  }

  return (
    <DashboardLayoutClient initialUser={user}>{children}</DashboardLayoutClient>
  );
}
