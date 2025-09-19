import { useParams } from "react-router";

export default function SpeciesPage() {
  const params = useParams();

  return <div className="container mx-auto px-4 my-10">Espécie: {params.species}</div>;
}
