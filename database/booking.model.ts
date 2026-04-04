import {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
  models,
} from "mongoose";
import { Event } from "./event.model";

export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookingDocument = HydratedDocument<IBooking>;

const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => EMAIL_REGEX.test(value),
        message: "Invalid email format.",
      },
    },
  },
  { timestamps: true }
);

bookingSchema.index({ eventId: 1 });

bookingSchema.pre("save", async function (this: BookingDocument) {
  this.email = this.email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(this.email)) {
    throw new Error("Invalid email format.");
  }

  // Ensure each booking references a real event document.
  if (this.isNew || this.isModified("eventId")) {
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error("Referenced event does not exist.");
    }
  }
});

export const Booking: Model<IBooking> =
  (models.Booking as Model<IBooking>) ||
  model<IBooking>("Booking", bookingSchema);

