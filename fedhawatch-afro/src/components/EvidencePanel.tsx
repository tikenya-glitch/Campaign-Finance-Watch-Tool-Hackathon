import { Source } from "@/lib/data";
import { ExternalLink, FileText } from "lucide-react";

interface EvidencePanelProps {
  sources: Source[];
}

export function EvidencePanel({ sources }: EvidencePanelProps) {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-display text-lg font-bold mb-4 text-card-foreground">Evidence Sources</h3>
      {sources.length === 0 ? (
        <p className="text-sm text-muted-foreground">No source documentation available.</p>
      ) : (
        <div className="space-y-3">
          {sources.map((source, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-md border bg-muted/30">
              <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-foreground">{source.source_org ?? "Unknown Source"}</p>
                {source.doc_id && (
                  <p className="text-xs text-muted-foreground font-mono">Doc: {source.doc_id}</p>
                )}
                {source.page_number !== null && (
                  <p className="text-xs text-muted-foreground">Page {source.page_number}</p>
                )}
                {source.source_url && (
                  <a
                    href={source.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                  >
                    View Source <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
