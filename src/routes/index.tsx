import {
  A,
  RouteDefinition,
  RouteSectionProps,
  Location,
  cache,
  createAsync,
} from "@solidjs/router";
import { createEffect } from "solid-js";

type Movie = {
  imdbID: string;
  Title: string;
  Poster: string;
};

const getMovies = cache(async (location) => {
  "use server";
  const searchParams = new URLSearchParams(location?.search);
  const search = searchParams.get("search");
  if (!search) return [];

  const apiKey = process.env.OMDB_API_KEY;
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${apiKey}&s=${search}`,
  );
  const data = await response.json();
  return data.Search as Movie[];
}, "movies");

const getSearch = cache(async (location: Location<unknown>) => {
  const search = new URLSearchParams(location.search).get("search");
  return search;
}, "search");

export const route = {
  load({ location }) {
    void getMovies(location);
  },
} satisfies RouteDefinition;

export default function Home(props: RouteSectionProps) {
  const movies = createAsync(() => getMovies(props.location));
  const search = createAsync(() => getSearch(props.location));

  let searchInputEl!: HTMLInputElement;

  createEffect(() => {
    if (searchInputEl) {
      searchInputEl.value = search() ?? "";
    }
  });

  return (
    <main class="max-w-screen-lg mx-auto py-10 px-3 sm:px-4 lg:px-0">
      <section class="flex flex-col items-center text-gray-900">
        <h1 class="text-5xl sm:text-6xl font-bold tracking-wide">
          Movie Search
        </h1>
        <p class="max-w-prose text-lg text-center text-gray-700 mt-6">
          Find more about the movie you are interested in using the search.
        </p>
        <form class="w-72 mt-4" id="search-form" role="search">
          <input
            ref={searchInputEl}
            class="mt-2 shadow-sm w-full rounded-md border-0 p-2 px-4 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-gray-500 sm:text-sm sm:leading-6"
            aria-label="Search movies"
            id="search"
            name="search"
            placeholder="Search"
            type="search"
            autofocus
          />
        </form>
        <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pt-8 w-full">
          {movies() &&
            movies()!.map((movie) => (
              <li>
                <MovieLink movie={movie} />
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}

function MovieLink({ movie }: { movie: Movie }) {
  return (
    <A
      href={`/movies/${movie.imdbID}`}
      class="flex flex-col h-72 border-2 border-gray-100 rounded-md transition-transform transform hover:scale-105 focus:scale-105 hover:shadow-md focus:shadow-md focus:ring-2 focus:ring-inset focus:outline-none focus:ring-gray-500"
    >
      <h2 class="p-2 text-base text-gray-700">{movie.Title}</h2>
      <img
        src={movie.Poster}
        alt={`Poster of ${movie.Title}.`}
        class="w-full h-full object-cover overflow-hidden p-0.5"
      />
    </A>
  );
}
