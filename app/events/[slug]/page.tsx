import BookEvent from "@/app/components/BookEvent";
import EventCard from "@/app/components/EventCard";
import { IEvent } from "@/database/event.model";
import { getSimilarEvents } from "@/lib/actions/event.actions";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

const EventDetails = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const AgendaItem = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="flex-col-gap-2">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row-gap-2 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

const EventPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`,
  );
  const data = await response.json();
  const event = data.event;

  if (!event) return notFound();
  console.log(data.event);
  const {
    description,
    title,
    image,
    date,
    time,
    location,
    mode,
    audience,
    organizer,
    tags,
    agenda,
    overview,
  } = data.event;

  const bookings = 10;

  const similarEvents: IEvent[] = (await getSimilarEvents(slug)) ?? [];
  console.log("Similar events:", similarEvents);
  return (
    <section id="event">
      <div className="header">
        <h1>Event description</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        {/* left: content */}
        <div className="content">
          <img
            src={image}
            alt="Event Banner"
            height={800}
            width={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetails
              icon="/icons/calendar.svg"
              alt="calendar icon"
              label={date}
            />
            <EventDetails
              icon="/icons/clock.svg"
              alt="clock icon"
              label={time}
            />
            <EventDetails
              icon="/icons/pin.svg"
              alt="location icon"
              label={location}
            />
            <EventDetails icon="/icons/mode.svg" alt="mode icon" label={mode} />
            <EventDetails
              icon="/icons/audience.svg"
              alt="person icon"
              label={audience}
            />
          </section>

          <AgendaItem agendaItems={agenda} />

          <section className="">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        {/* right side: booking form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book your slot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                slots available. join the {bookings} people who have already
                booked!
              </p>
            ) : (
              <p>Be the first to book a spot</p>
            )}

            <BookEvent />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.map((event) => (
            <EventCard event={event} key={event.title} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventPage;
