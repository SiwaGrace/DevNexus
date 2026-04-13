import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Event } from "@/database";

interface RouteContext {
  params: {
    slug?: string;
  };
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const normalizeAndValidateSlug = (
  rawSlug: string | undefined,
): { isValid: true; value: string } | { isValid: false; message: string } => {
  if (!rawSlug) {
    return { isValid: false, message: "Missing slug parameter." };
  }

  let decodedSlug: string;
  try {
    decodedSlug = decodeURIComponent(rawSlug);
  } catch {
    return { isValid: false, message: "Invalid slug encoding." };
  }

  const normalizedSlug = decodedSlug.trim().toLowerCase();
  if (!normalizedSlug) {
    return { isValid: false, message: "Slug cannot be empty." };
  }

  if (!SLUG_PATTERN.test(normalizedSlug)) {
    return {
      isValid: false,
      message: "Invalid slug format.",
    };
  }

  return { isValid: true, value: normalizedSlug };
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  const slugValidation = normalizeAndValidateSlug(slug);
  if (!slugValidation.isValid) {
    return NextResponse.json(
      { message: slugValidation.message },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();

    // Query by normalized slug to return a single event document.
    const event = await Event.findOne({ slug: slugValidation.value })
      .lean()
      .exec();

    if (!event) {
      return NextResponse.json(
        { message: "Event not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Event retrieved successfully.", event },
      { status: 200 },
    );
  } catch (error) {
    // Convert known query/validation failures into client-facing 400 responses.
    if (
      error instanceof mongoose.Error.ValidationError ||
      error instanceof mongoose.Error.CastError
    ) {
      return NextResponse.json(
        { message: "Invalid request data.", error: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: "Internal server error.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
