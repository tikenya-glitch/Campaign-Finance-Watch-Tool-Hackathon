import Link from "next/link";

interface BreadcrumbItem {
  href: string;
  label: string;
  isLast: boolean;
}

interface DashboardBreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
}

export function DashboardBreadcrumbs({ breadcrumbs }: DashboardBreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-muted-foreground">/</span>
          )}
          {breadcrumb.isLast ? (
            <span className="text-sm text-foreground">{breadcrumb.label}</span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
