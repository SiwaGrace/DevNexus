"use client";
import React from "react";

const BookEvent = () => {
  const [email, setEmail] = React.useState("");
  const [isBooking, setIsBooking] = React.useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setIsBooking(true);
    }, 1000);
  };
  return (
    <div id="book-event">
      {isBooking ? (
        <p className="text-sm">Thank you for booking!</p>
      ) : (
        <>
          <form onSubmit={handleBooking} className="flex-col-gap-4">
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <button type="submit" className="button-submit">
              Book Now
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default BookEvent;
