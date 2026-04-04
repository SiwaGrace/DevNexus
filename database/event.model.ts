import { HydratedDocument, Model, Schema, model, models } from "mongoose";

export interface IEvent {
  title: string;
  slug?: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

type EventDocument = HydratedDocument<IEvent>;

const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const normalizeDateToIso = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date format.");
  }
  return parsed.toISOString();
};

const normalizeTime = (value: string): string => {
  const input = value.trim().toLowerCase();

  const twelveHourMatch = input.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (twelveHourMatch) {
    const hours = Number.parseInt(twelveHourMatch[1], 10);
    const minutes = Number.parseInt(twelveHourMatch[2] ?? "0", 10);
    const period = twelveHourMatch[3];

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
      throw new Error("Invalid time format.");
    }

    let normalizedHours = hours % 12;
    if (period === "pm") {
      normalizedHours += 12;
    }

    return `${String(normalizedHours).padStart(2, "0")}:${String(
      minutes,
    ).padStart(2, "0")}`;
  }

  const twentyFourHourMatch = input.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const hours = Number.parseInt(twentyFourHourMatch[1], 10);
    const minutes = Number.parseInt(twentyFourHourMatch[2], 10);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error("Invalid time format.");
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}`;
  }

  throw new Error("Invalid time format.");
};

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
  },
  { timestamps: true },
);

eventSchema.pre("save", async function (this: EventDocument) {
  const requiredStringFields: Array<
    keyof Pick<
      IEvent,
      | "title"
      | "description"
      | "overview"
      | "image"
      | "venue"
      | "location"
      | "date"
      | "time"
      | "mode"
      | "audience"
      | "organizer"
    >
  > = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];

  // Keep required strings non-empty after trimming.
  for (const field of requiredStringFields) {
    const value = this[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`${field} is required.`);
    }
    this[field] = value.trim();
  }

  // Ensure list fields are present and contain non-empty items.
  if (
    !Array.isArray(this.agenda) ||
    this.agenda.length === 0 ||
    this.agenda.some((item) => item.trim().length === 0)
  ) {
    throw new Error("agenda must contain at least one item.");
  }

  if (
    !Array.isArray(this.tags) ||
    this.tags.length === 0 ||
    this.tags.some((item) => item.trim().length === 0)
  ) {
    throw new Error("tags must contain at least one item.");
  }

  this.agenda = this.agenda.map((item) => item.trim());
  this.tags = this.tags.map((item) => item.trim());

  // Regenerate slug only when title changes.
  if (this.isModified("title")) {
    const generatedSlug = slugify(this.title);
    if (!generatedSlug) {
      throw new Error("title must produce a valid slug.");
    }

    const EventModel = models.Event || model<IEvent>("Event", eventSchema);
    let candidateSlug = generatedSlug;
    let counter = 1;
    const excludeCurrentId = this.isNew ? {} : { _id: { $ne: this._id } };

    while (
      await EventModel.exists({ slug: candidateSlug, ...excludeCurrentId })
    ) {
      candidateSlug = `${generatedSlug}-${counter}`;
      counter += 1;
    }

    this.slug = candidateSlug;
  }

  // Normalize date/time formats for consistent storage.
  if (this.isModified("date")) {
    this.date = normalizeDateToIso(this.date);
  }

  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }
});

export const Event: Model<IEvent> =
  (models.Event as Model<IEvent>) || model<IEvent>("Event", eventSchema);
