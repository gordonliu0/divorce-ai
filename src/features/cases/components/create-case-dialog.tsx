"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

interface CreateCaseDialogProps {
  onCreated: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  orgId: string;
}

export function CreateCaseDialog({
  open,
  onOpenChange,
  orgId,
  onCreated,
}: CreateCaseDialogProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [opposingPartyName, setOpposingPartyName] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [dateOfMarriage, setDateOfMarriage] = useState("");
  const [dateOfSeparation, setDateOfSeparation] = useState("");
  const [dateOfFiling, setDateOfFiling] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [notes, setNotes] = useState("");

  function resetForm() {
    setName("");
    setClientName("");
    setOpposingPartyName("");
    setJurisdiction("");
    setDateOfMarriage("");
    setDateOfSeparation("");
    setDateOfFiling("");
    setCaseNumber("");
    setNotes("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!(name.trim() && clientName.trim())) {
      toast.error("Case name and client name are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/o/${orgId}/cases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          client_name: clientName.trim(),
          opposing_party_name: opposingPartyName.trim() || undefined,
          jurisdiction: jurisdiction || undefined,
          date_of_marriage: dateOfMarriage || undefined,
          date_of_separation: dateOfSeparation || undefined,
          date_of_filing: dateOfFiling || undefined,
          case_number: caseNumber.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create case");
      }

      toast.success("Case created");
      resetForm();
      onOpenChange(false);
      onCreated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create case");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Case</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="case-name">
              Case Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="case-name"
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Smith v. Smith"
              required
              value={name}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-name">
              Client Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="client-name"
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client's full name"
              required
              value={clientName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="opposing-party">Opposing Party</Label>
            <Input
              id="opposing-party"
              onChange={(e) => setOpposingPartyName(e.target.value)}
              placeholder="Opposing party's full name"
              value={opposingPartyName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jurisdiction">Jurisdiction</Label>
            <Select onValueChange={setJurisdiction} value={jurisdiction}>
              <SelectTrigger id="jurisdiction">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-marriage">Date of Marriage</Label>
              <Input
                id="date-marriage"
                onChange={(e) => setDateOfMarriage(e.target.value)}
                type="date"
                value={dateOfMarriage}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-separation">Date of Separation</Label>
              <Input
                id="date-separation"
                onChange={(e) => setDateOfSeparation(e.target.value)}
                type="date"
                value={dateOfSeparation}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-filing">Date of Filing</Label>
              <Input
                id="date-filing"
                onChange={(e) => setDateOfFiling(e.target.value)}
                type="date"
                value={dateOfFiling}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="case-number">Case Number</Label>
              <Input
                id="case-number"
                onChange={(e) => setCaseNumber(e.target.value)}
                placeholder="Court case number"
                value={caseNumber}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
              value={notes}
            />
          </div>

          <DialogFooter>
            <Button
              disabled={loading}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Case
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
