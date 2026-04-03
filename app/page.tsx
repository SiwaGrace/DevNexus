import Link from "next/link";
import React from "react";
import ExploreBtn from "./components/ExploreBtn";
import EventCard from "./components/EventCard";
import { events } from "../lib/constants";

const Home = () => {
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
          {events.map((event) => (
            <li key={event.title} className="event-card">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
