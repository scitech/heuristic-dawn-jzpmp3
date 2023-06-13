import { Planet } from "../lib/swapi";
import styles from "./PlanetsTable.module.css";

const sphereSurfaceArea = (diameter: number): number => {
  const radius = diameter / 2;
  return 4 * Math.PI * Math.pow(radius, 2);
};

const computeWaterSurfaceArea = (planet: Planet): number => {
  const waterPercentage = parseInt(planet.surface_water) / 100;
  const waterSurfaceArea =
    sphereSurfaceArea(parseInt(planet.diameter)) * waterPercentage;
  return Math.round(waterSurfaceArea);
};

const formatNumber = (value: number): string => {
  return value.toLocaleString("en-US").replaceAll(",", " ");
};

const canDisplayValue = (
  planet: Planet,
  requiredFields: (keyof Planet)[]
): boolean => {
  return requiredFields.every((fieldName) => planet[fieldName] !== "unknown");
};

interface PlanetRowProps {
  planet: Planet;
}
const PlanetRow = ({ planet }: PlanetRowProps) => {
  return (
    <tr key={planet.name}>
      <td>
        <a href={planet.url} target="_blank">
          {planet.name}
        </a>
      </td>
      <td>{canDisplayValue(planet, ["climate"]) ? planet.climate : "?"}</td>
      <td>
        {canDisplayValue(planet, ["residents"]) ? planet.residents.length : "?"}
      </td>
      <td>{canDisplayValue(planet, ["terrain"]) ? planet.terrain : "?"}</td>
      <td>
        {canDisplayValue(planet, ["population"])
          ? formatNumber(parseInt(planet.population))
          : "?"}
      </td>
      <td>
        {canDisplayValue(planet, ["surface_water", "diameter"])
          ? formatNumber(computeWaterSurfaceArea(planet))
          : "?"}
      </td>
    </tr>
  );
};

interface PlanetsTableProps {
  planets: Planet[];
}
export const PlanetsTable = ({ planets }: PlanetsTableProps) => {
  return (
    <table className={styles.container}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Climate</th>
          <th>Residents</th>
          <th>Terrains</th>
          <th>Population</th>
          <th>Surface Water</th>
        </tr>
      </thead>
      <tbody>
        {planets.map((planet) => (
          <PlanetRow key={planet.name} planet={planet} />
        ))}
      </tbody>
    </table>
  );
};
