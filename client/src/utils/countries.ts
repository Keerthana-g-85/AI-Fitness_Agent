import countries from "world-countries";

export const COUNTRY_OPTIONS: readonly string[] = countries
  .map((country) => country.name.common)
  .sort((firstCountry, secondCountry) =>
    firstCountry.localeCompare(secondCountry),
  );
