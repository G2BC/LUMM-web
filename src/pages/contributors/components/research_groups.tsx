import { research_groups } from "../data";
import ProfileCard from "./profile_card";

export default function ResearchGroupsSection() {
  return (
    <div className="py-10 grid grid-cols-[repeat(auto-fill,320px)] gap-6 max-sm:justify-center">
      {research_groups.map((c) => (
        <ProfileCard key={c.name} c={c} />
      ))}
    </div>
  );
}
