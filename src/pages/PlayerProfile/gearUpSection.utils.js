export const DEFAULT_GEAR_UP_SPECS = {
  left: [
    { label: "Model", value: "450 RALLY", top: 30, angle: 8, left: 60 },
    {
      label: "Engine",
      value: "MONOCILINDRICO DE 449.5cc",
      top: 122,
      angle: 4,
      left: 10,
    },
    {
      label: "Frame",
      value: "ACERO CROMO MOLIBDENO",
      top: 214,
      angle: 0,
      left: 5,
    },
    { label: "Power", value: "45", top: 350, angle: -10, left: 46 },
  ],
  right: [
    { label: "Weight", value: "140", top: 30, angle: -8, right: 60 },
    { label: "Length", value: "220", top: 122, angle: 0, right: 12 },
    { label: "Tank capacity", value: "35", top: 214, angle: 0 },
    { label: "Class", value: "Rally GP", top: 350, angle: 10, right: 46 },
  ],
};

function formatSpecValue(value) {
  if (value == null || value === "") return "";
  return String(value).trim();
}

export function mapVehicleToGearUpSpecs(vehicle) {
  if (!vehicle) return DEFAULT_GEAR_UP_SPECS;

  const model = formatSpecValue(vehicle.model);
  const engine = formatSpecValue(vehicle.engine);
  const frame = formatSpecValue(vehicle.frame);
  const power = formatSpecValue(vehicle.power);
  const weight = formatSpecValue(vehicle.weight);
  const length = formatSpecValue(vehicle.length);
  const tankCapacity = formatSpecValue(vehicle.tank_capacity);
  const vehicleClass = formatSpecValue(vehicle.class);

  return {
    left: [
      {
        label: "Model",
        value: model || DEFAULT_GEAR_UP_SPECS.left[0].value,
        top: 30,
        angle: 8,
        left: 60,
      },
      {
        label: "Engine",
        value: engine || DEFAULT_GEAR_UP_SPECS.left[1].value,
        top: 122,
        angle: 4,
        left: 10,
      },
      {
        label: "Frame",
        value: frame || DEFAULT_GEAR_UP_SPECS.left[2].value,
        top: 214,
        angle: 0,
        left: 5,
      },
      {
        label: "Power",
        value: power || DEFAULT_GEAR_UP_SPECS.left[3].value,
        top: 350,
        angle: -10,
        left: 46,
      },
    ],
    right: [
      {
        label: "Weight",
        value: weight || DEFAULT_GEAR_UP_SPECS.right[0].value,
        top: 30,
        angle: -8,
        right: 60,
      },
      {
        label: "Length",
        value: length || DEFAULT_GEAR_UP_SPECS.right[1].value,
        top: 122,
        angle: 0,
        right: 12,
      },
      {
        label: "Tank capacity",
        value: tankCapacity || DEFAULT_GEAR_UP_SPECS.right[2].value,
        top: 214,
        angle: 0,
      },
      {
        label: "Class",
        value: vehicleClass || DEFAULT_GEAR_UP_SPECS.right[3].value,
        top: 350,
        angle: 10,
        right: 46,
      },
    ],
  };
}

export function getRallyTeamId(record) {
  const team = record?.team_id;
  if (!team) return "";
  if (typeof team === "string") return team;
  return team._id || "";
}

export function resolveGearUpEventId({
  eventIdFromQuery = "",
  activeEventId = "",
  profileRecord = null,
} = {}) {
  if (eventIdFromQuery) return eventIdFromQuery;
  if (activeEventId) return activeEventId;
  return profileRecord?.event_id?._id || profileRecord?.event_id || "";
}

export function getRallyEventTitle(rally) {
  if (!rally) return "";
  return String(rally.name ?? rally.title ?? "").trim();
}

export function getRallyEventDescription(rally) {
  if (!rally) return "";
  return String(rally.description ?? "").trim();
}

export function resolveGearUpEvent({
  eventId = "",
  activeEvent = null,
  pastRallies = [],
  profileRecord = null,
} = {}) {
  const profileEvent =
    profileRecord?.event_id && typeof profileRecord.event_id === "object"
      ? profileRecord.event_id
      : null;

  if (eventId && activeEvent?._id === eventId) {
    return activeEvent;
  }

  if (eventId && Array.isArray(pastRallies)) {
    const pastEvent = pastRallies.find((rally) => rally._id === eventId);
    if (pastEvent) return pastEvent;
  }

  if (
    profileEvent &&
    (!eventId || profileEvent._id === eventId || !profileEvent._id)
  ) {
    return profileEvent;
  }

  if (!eventId && activeEvent) {
    return activeEvent;
  }

  return activeEvent ?? profileEvent ?? null;
}
