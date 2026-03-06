import { formatDate, formatRole } from "../lib/utils";
import type { TeamMember } from "../types/types";
import { MemberActionsMenu } from "./MemberActionsMenu";

interface TeamMemberRowProps {
  allMembers: TeamMember[];
  canChangeRole: boolean;
  canRemove: boolean;
  canTransferOwnership: boolean;
  currentUserId: string;
  isLoading?: boolean;
  member: TeamMember;
  onChangeRole: (userId: string, newRole: "admin" | "member") => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
  onTransferOwnership: (newOwnerId: string) => Promise<void>;
  organizationName: string;
}

export function TeamMemberRow({
  member,
  allMembers,
  currentUserId,
  organizationName,
  canChangeRole,
  canRemove,
  canTransferOwnership,
  onChangeRole,
  onRemove,
  onTransferOwnership,
  isLoading = false,
}: TeamMemberRowProps) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <tr className="group border-b hover:bg-muted/50">
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-[10px] text-muted-foreground">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="truncate font-medium text-sm">{member.name}</div>
            <div className="truncate text-muted-foreground text-xs">
              {member.email}
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5 text-muted-foreground text-xs">
        {formatRole(member.role)}
      </td>
      <td className="px-3 py-2.5 text-muted-foreground text-xs">
        {formatDate(member.joined_at)}
      </td>
      <td className="px-3 py-2.5 text-right">
        <div className="opacity-0 transition-opacity group-hover:opacity-100">
          {currentUserId !== member.user_id && (
            <MemberActionsMenu
              allMembers={allMembers}
              canChangeRole={canChangeRole}
              canRemove={canRemove}
              canTransferOwnership={canTransferOwnership}
              currentUserId={currentUserId}
              isLoading={isLoading}
              member={member}
              onChangeRole={onChangeRole}
              onRemove={onRemove}
              onTransferOwnership={onTransferOwnership}
              organizationName={organizationName}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
