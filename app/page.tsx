"use client";
import { Page } from "../components/Page";
import { PlanetsTable } from "../components/PlanetsTable";
import { usePlanets } from "../lib/swapi";

export default function Home() {
  const { data, error, loading } = usePlanets("5");

  return (
    <Page heading="The planets of Star Wars">
      {loading ? (
        <p role="alert">Loading...</p>
      ) : error ? (
        <p role="alert">Sorry, there was an issue loading planets.</p>
      ) : data ? (
        <PlanetsTable planets={data.results} />
      ) : (
        <div role="alert">Sorry, an unexpected error occurred.</div>
      )}
    </Page>
  );
}
