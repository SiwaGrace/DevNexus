import books from "../db";

export async function GET() {
  return Response.json(books);
}

export async function POST(request: Request) {
  const { title, author } = await request.json();
  const newBook = {
    id: books.length + 1,
    title,
    author,
  };
  books.push(newBook);
  return Response.json(newBook);
}
