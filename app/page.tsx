import Link from "next/link";
import React from "react";
import ExploreBtn from "./components/ExploreBtn";
import EventCard from "./components/EventCard";
// import { events } from "../lib/constants";
import { IEvent } from "@/database/event.model";
import { cacheLife } from "next/cache";

const Home = async () => {
  "use cache";
  cacheLife("hours");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`,
    {
      cache: "no-store",
    },
  );

  const events_json = await response.json();
  const { events } = events_json;
  console.log(events);
  return (
    <section>
      <h1 className="text-center">
        The Dev Nexus <br />
        Events you can't miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, meetings, and conferences, all in one place
      </p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events list-none">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title} className="event-card">
                <EventCard event={event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
