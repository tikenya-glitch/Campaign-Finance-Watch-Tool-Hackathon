import { useState } from "react";
import { CheckCircle } from "lucide-react";

interface Observation {
  assetType: string;
  entityType: string;
  name: string;
  county: string;
  constituency: string;
  ward: string;
  quantity: string;
  duration: string;
  confidence: string;
  description: string;
}

const ASSET_TYPES = ["Billboard", "Vehicle", "Rally/Event", "Merchandise", "Social Media Ad", "Print Media", "Radio/TV Ad", "Other"];
const CONFIDENCE_LEVELS = ["High", "Medium", "Low"];

export function ObservationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<Observation>({
    assetType: "", entityType: "", name: "", county: "",
    constituency: "", ward: "", quantity: "", duration: "",
    confidence: "", description: "",
  });

  const update = (field: keyof Observation, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-card border rounded-lg p-12 text-center">
        <CheckCircle className="h-12 w-12 text-risk-green mx-auto mb-4" />
        <h3 className="font-display text-xl font-bold text-card-foreground mb-2">Observation Submitted</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Thank you for contributing to public accountability. Your observation has been recorded.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ assetType: "", entityType: "", name: "", county: "", constituency: "", ward: "", quantity: "", duration: "", confidence: "", description: "" }); }}
          className="rounded-md bg-primary text-primary-foreground px-6 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Submit Another
        </button>
      </div>
    );
  }

  const inputClass = "w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  const selectClass = "w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "block text-sm font-medium text-card-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Asset Type</label>
          <select value={form.assetType} onChange={(e) => update("assetType", e.target.value)} className={selectClass} required>
            <option value="">Select asset type…</option>
            {ASSET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Entity Type</label>
          <select value={form.entityType} onChange={(e) => update("entityType", e.target.value)} className={selectClass} required>
            <option value="">Select entity type…</option>
            <option value="candidate">Candidate</option>
            <option value="party">Party</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Candidate / Party Name</label>
          <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Enter name" className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>County</label>
          <input value={form.county} onChange={(e) => update("county", e.target.value)} placeholder="County" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Constituency</label>
          <input value={form.constituency} onChange={(e) => update("constituency", e.target.value)} placeholder="Constituency" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Ward</label>
          <input value={form.ward} onChange={(e) => update("ward", e.target.value)} placeholder="Ward" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Quantity</label>
          <input type="number" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} placeholder="e.g. 5" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Duration</label>
          <input value={form.duration} onChange={(e) => update("duration", e.target.value)} placeholder="e.g. 2 weeks" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Confidence</label>
          <select value={form.confidence} onChange={(e) => update("confidence", e.target.value)} className={selectClass}>
            <option value="">Select confidence…</option>
            {CONFIDENCE_LEVELS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Photo Upload</label>
          <input type="file" accept="image/*" className={inputClass} />
          <p className="text-xs text-muted-foreground mt-1">Optional — photo evidence strengthens observations.</p>
        </div>
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
          placeholder="Describe what you observed…"
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-primary text-primary-foreground px-8 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Submit Observation
      </button>
    </form>
  );
}
