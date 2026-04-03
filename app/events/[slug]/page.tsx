import React from "react";

const EventPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  return (
    <div>
      <p>
        Details about the event will go here. This page is for the event with
        slug: {slug}
      </p>
    </div>
  );
};

export default EventPage;
