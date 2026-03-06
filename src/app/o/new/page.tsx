"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export default function CreateOrganization() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/o/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create organization");
      }

      toast.success("Organization created successfully");
      router.push(`/o/${data.organization.id}`);
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("Failed to create organization", {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-start p-6">
      <div className="flex max-w-lg flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="font-medium text-lg">Your Organizations</div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              disabled={loading}
              id="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter organization name"
              required
              value={name}
            />
          </div>

          <Button disabled={loading || !name.trim()} type="submit">
            {loading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Organization"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
