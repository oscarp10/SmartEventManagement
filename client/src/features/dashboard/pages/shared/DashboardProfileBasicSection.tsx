import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shared/components";
import type { DashboardSection } from "@/app-types";
import type { AuthProfile } from "@/features/auth/types";

export function DashboardProfileBasicSection({
  section,
  profile
}: {
  section: DashboardSection;
  profile: AuthProfile;
}) {
  if (section !== "profile") return null;
  return (
    <Card className="border-slate-200/80 shadow-md ring-1 ring-slate-100/80">
      <CardHeader>
        <CardTitle>Your account</CardTitle>
        <CardDescription>Signed-in profile used for EventHub roles and recommendations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-0 text-sm text-slate-700">
        <p>
          <span className="font-semibold text-slate-900">Name:</span> {profile.fullName}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Email:</span> {profile.email}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Role:</span> {profile.role}
        </p>
      </CardContent>
    </Card>
  );
}

