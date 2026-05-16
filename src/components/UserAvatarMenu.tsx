import { useState } from "react";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { useUser } from "@/lib/user-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutDialog } from "./LogoutDialog";

export function UserAvatarMenu({ firstName }: { firstName?: string }) {
  const { userId, setUserId } = useUser();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const initial = (firstName ?? "U").slice(0, 1).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1.5 rounded-full border border-border bg-card pr-2 transition-colors hover:bg-accent">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
              {initial}
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Mock user</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={userId} onValueChange={(v) => setUserId(v as "u1" | "u2")}>
            <DropdownMenuRadioItem value="u1">
              <UserIcon className="mr-2 h-3.5 w-3.5" />
              u1 — empty state
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="u2">
              <UserIcon className="mr-2 h-3.5 w-3.5" />
              u2 — with data
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setLogoutOpen(true)}>
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  );
}
