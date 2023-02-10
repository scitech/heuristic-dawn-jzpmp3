import { useState, useEffect } from "react";

/**
 * API types
 */
export interface Planet {
  name: string;
  climate: string;
  url: string;
  residents: string[];
  diameter: string;
  terrain: string;
  surface_water: string;
  population: string;
}

interface GetPlanetsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Planet[];
}

type Result<T> = [T, null] | [null, Error];
const caughtError = (e: unknown): Error => {
  return e instanceof Error ? e : new Error(`non-error in catch block: ${e}`);
};

/**
 * Validation
 */
const isValidPlanet = (data: any): data is Planet => {
  return typeof data.name === "string" && typeof data.climate === "string";
};

const isValidPlanetResponse = (data: any): data is GetPlanetsResponse => {
  const hasResultsArray = data && Array.isArray(data.results);
  if (!hasResultsArray) return false;

  const resultsArePlanets = data.results.reduce(
    (allArePlanets: boolean, current: any) => {
      return allArePlanets && isValidPlanet(current);
    },
    true
  );
  return resultsArePlanets;
};

/**
 * Fetching & response handling
 */
export const getPlanets = async (
  page: string = "1"
): Promise<Result<GetPlanetsResponse>> => {
  let response = null;
  try {
    response = await fetch(`https://swapi.dev/api/planets/?page=${page}`);
  } catch (e) {
    return [null, caughtError(e)];
  }

  if (!response.ok) {
    return [null, new Error("request not successful")];
  }

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    return [null, caughtError(e)];
  }

  if (isValidPlanetResponse(data)) {
    data.results.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (b.name > a.name) return 1;
      return 0;
    });
    return [data, null];
  } else {
    return [null, new Error("received unexpected Get Planets response")];
  }
};

/**
 * React integration
 */
export const usePlanets = (page: string = "1") => {
  const [result, setResult] = useState<Result<GetPlanetsResponse> | null>(null);

  useEffect(() => {
    const makeRequest = async () => {
      setResult(await getPlanets(page));
    };
    makeRequest();
  }, [page]);

  return result
    ? {
        data: result[0],
        error: result[1],
        loading: false,
      }
    : {
        data: null,
        error: null,
        loading: true,
      };
};
