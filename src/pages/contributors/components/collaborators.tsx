import { contributors } from "../data";
import ProfileCard from "./profile_card";

export default function CollaboratorsSection() {
  return (
    <div className="py-10 grid grid-cols-[repeat(auto-fill,320px)] gap-6 max-sm:justify-center">
      {contributors.map((c) => (
        <ProfileCard key={c.name} c={c} />
      ))}
    </div>
  );
}
