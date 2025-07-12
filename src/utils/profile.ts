import { Profile } from "../types";

export function getTeamId(profile: Profile) {
  if (!profile || !profile.Team) {
    return null;
  }

  return profile.Team.ID;
}
