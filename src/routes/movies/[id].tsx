import {
  RouteDefinition,
  RouteSectionProps,
  cache,
  createAsync,
} from "@solidjs/router";

type MovieDetail = {
  Title: string;
  Poster: string;
  Plot: string;
};

const getMovieDetail = cache(async (id) => {
  "use server";
  const apiKey = process.env.OMDB_API_KEY;
  const response = await fetch(
    `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${apiKey}`,
  );
  return (await response.json()) as MovieDetail;
}, "movieDetail");

export const route = {
  load({ params }) {
    void getMovieDetail(params.id);
  },
} satisfies RouteDefinition;

export default function Movie(props: RouteSectionProps) {
  const movieDetail = createAsync(() => getMovieDetail(props.params.id));

  return (
    <main class="max-w-screen-lg mx-auto py-10 px-3 sm:px-4 lg:px-0">
      <div class="flex flex-col items-center">
        <h1 class="text-5xl text-gray-900">{movieDetail()?.Title}</h1>

        <div class="flex gap-4 mt-12">
          <div class="relative w-72 h-[432px]">
            <img
              class="w-full h-full object-cover overflow-hidden"
              src={movieDetail()?.Poster}
              alt={movieDetail()?.Title}
            />
          </div>
          <p class="m-0 max-w-[576px]">{movieDetail()?.Plot}</p>
        </div>
      </div>
    </main>
  );
}
