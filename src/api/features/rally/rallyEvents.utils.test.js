import { describe, expect, it } from "vitest";
import { getMostRecentCompletedRally } from "./rallyEvents.utils.js";

describe("getMostRecentCompletedRally", () => {
  const rallies = [
    {
      _id: "6a06bd1bc2a32fc10c4211ab",
      name: "TDCP Cholistan Desert Rally 2022",
      end_date: "2022-10-16T00:00:00.000Z",
    },
    {
      _id: "6a06bd1bc2a32fc10c4211ad",
      name: "TDCP Salt Range Rally 2024",
      end_date: "2024-10-06T00:00:00.000Z",
    },
    {
      _id: "6a06bd1bc2a32fc10c4211ac",
      name: "TDCP Makran Coastal Rally 2023",
      end_date: "2023-11-11T00:00:00.000Z",
    },
  ];

  it("returns the rally with the latest end_date", () => {
    expect(getMostRecentCompletedRally(rallies)).toEqual({
      _id: "6a06bd1bc2a32fc10c4211ad",
      name: "TDCP Salt Range Rally 2024",
      end_date: "2024-10-06T00:00:00.000Z",
    });
  });

  it("returns null when the list is empty", () => {
    expect(getMostRecentCompletedRally([])).toBeNull();
  });
});
