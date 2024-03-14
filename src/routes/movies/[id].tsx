import { useParams } from "@solidjs/router";

export default function Movie() {
  let params = useParams();
  return <h1>Movie detail page for {params.id}</h1>;
}
