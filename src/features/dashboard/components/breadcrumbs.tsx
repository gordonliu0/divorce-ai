"use client";

import { Box, ChevronDown, Package, Plus, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";

interface Organization {
  id: string;
  name: string;
}

interface Application {
  id: string;
  name: string;
}

interface Tool {
  icon: React.ReactNode;
  name: string;
}

interface BreadcrumbsProps {
  applications?: Application[];
  organizations?: Organization[];
  selectedApplication?: Application;
  selectedOrg?: Organization;
  selectedTool?: Tool;
}

function BreadcrumbSeparator() {
  // return <div className="text-muted-foreground">{">"}</div>;
  return <span className="mr-4 font-light text-muted-foreground">/</span>;
}

export function Breadcrumbs({
  organizations = [],
  selectedOrg,
  applications = [],
  selectedApplication,
  selectedTool,
}: BreadcrumbsProps) {
  const [orgSearchTerm, setOrgSearchTerm] = useState("");
  const [applicationSearchTerm, setApplicationSearchTerm] = useState("");

  const handleOrgChange = (newOrgId: string) => {
    redirect(`/o/${newOrgId}`);
  };

  const handleApplicationChange = (newApplicationId: string) => {
    if (!selectedOrg) {
      return;
    }
    redirect(`/o/${selectedOrg.id}/${newApplicationId}`);
  };

  const filteredOrganizations = organizations
    .filter((org) =>
      org.name.toLowerCase().includes(orgSearchTerm.toLowerCase())
    )
    .slice(0, 5);

  const filteredApplications = applications
    .filter((application) =>
      application.name
        .toLowerCase()
        .includes(applicationSearchTerm.toLowerCase())
    )
    .slice(0, 5);

  return (
    <div className="flex w-full max-w-4xl items-center gap-3 text-sm">
      {/* Logo - Links to Organizations */}
      <Link className="mr-2 hover:opacity-80" href="/o">
        {/* <Package size={18} /> */}
        speedyghost.ai
      </Link>

      <BreadcrumbSeparator />

      <div className="flex items-center gap-2">
        <Link className="hover:opacity-80" href={`/o/${selectedOrg?.id}`}>
          <Package size={18} />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-9 cursor-pointer px-3 transition-colors hover:bg-accent/50"
              size="sm"
              variant="ghost"
            >
              <span className="font-medium text-foreground">
                {selectedOrg?.name || "Select Organization"}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80">
            <div className="p-1">
              <div className="relative">
                <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  className="h-9 pl-8"
                  onChange={(e) => setOrgSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="Find organization..."
                  value={orgSearchTerm}
                />
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-1.5 font-medium text-muted-foreground text-xs">
                Organizations
              </DropdownMenuLabel>
              {filteredOrganizations.length > 0 ? (
                filteredOrganizations.map((org) => (
                  <DropdownMenuItem
                    className="cursor-pointer px-3 py-2 hover:bg-accent"
                    key={org.id}
                    onClick={() => handleOrgChange(org.id)}
                  >
                    <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                    {org.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="text-muted-foreground" disabled>
                  No organizations found
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Link href="/o/new">
              <DropdownMenuItem className="cursor-pointer px-3 py-2 hover:bg-accent">
                <Plus className="mr-2 h-4 w-4" />
                Create Organization
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Organization Selector */}
      {/* Organization Selector - placeholder for future implementation */}

      {/* Application Selector */}
      {applications.length > 0 && selectedOrg && (
        <>
          <BreadcrumbSeparator />

          <div className="flex items-center gap-2">
            {selectedTool ? (
              <>
                {selectedTool.icon}
                <span className="ml-3 font-medium text-foreground text-xs">
                  {selectedTool.name || "Select Tool"}
                </span>
              </>
            ) : (
              <>
                <Link
                  className="hover:opacity-80"
                  href={`/o/${selectedOrg.id}/projects/${selectedApplication?.id}`}
                >
                  <Box size={18} />
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="h-9 cursor-pointer px-3 transition-colors hover:bg-accent/50"
                      size="sm"
                      variant="ghost"
                    >
                      <span className="font-medium text-foreground">
                        {selectedApplication?.name || "Select Application"}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-80">
                    <div className="p-1">
                      <div className="relative">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          autoFocus
                          className="h-9 pl-8"
                          onChange={(e) =>
                            setApplicationSearchTerm(e.target.value)
                          }
                          onKeyDown={(e) => e.stopPropagation()}
                          placeholder="Find application..."
                          value={applicationSearchTerm}
                        />
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="px-2 py-1.5 font-medium text-muted-foreground text-xs">
                        Applications
                      </DropdownMenuLabel>
                      {filteredApplications.length > 0 ? (
                        filteredApplications.map((application) => (
                          <DropdownMenuItem
                            className="cursor-pointer px-3 py-2 hover:bg-accent"
                            key={application.id}
                            onClick={() =>
                              handleApplicationChange(application.id)
                            }
                          >
                            <Box className="mr-2 h-4 w-4 text-muted-foreground" />
                            {application.name}
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem
                          className="text-muted-foreground"
                          disabled
                        >
                          No applications found
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
