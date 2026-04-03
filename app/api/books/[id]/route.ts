import books from "../../db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const bookIndex = books.findIndex((book) => book.id === parseInt(params.id));
  if (bookIndex === -1) {
    return new Response(JSON.stringify({ error: "Book not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const { title, author } = await request.json();
  books[bookIndex] = { ...books[bookIndex], title, author };
  return Response.json(books[bookIndex]);
}
