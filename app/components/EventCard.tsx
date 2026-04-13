import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IEvent } from "@/database/event.model";

interface Props {
  event: IEvent;
}

const EventCard = ({ event }: Props) => {
  return (
    <Link href={`/events/${event.slug}`} id="event-card">
      <Image
        src={event.image}
        alt={event.title}
        width={410}
        height={300}
        className="poster"
      />

      <div className="flex flex-row gap-2">
        <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
        <p className="location">{event.location}</p>
      </div>
      <p className="title">{event.title}</p>

      <div className="datetime">
        <div>
          <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
          <p>{event.date}</p>
        </div>
        <div>
          <Image src="/icons/clock.svg" alt="date" width={14} height={14} />
          <p>{event.time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
