"use server";

import { Event } from "@/database";
import connectToDatabase from "../mongodb";
import { IEvent } from "@/database/event.model";

export const getSimilarEvents = async (slug: string) => {
  try {
    await connectToDatabase();
    const event = await Event.findOne({ slug });
    if (!event) {
      throw new Error("Event not found");
    }
    const similar = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).limit(3);

    console.log("Similar found:", similar);
    return JSON.parse(JSON.stringify(similar)) as IEvent[];
  } catch (error) {
    console.error("Error fetching similar events:", error);
    return [];
  }
};
