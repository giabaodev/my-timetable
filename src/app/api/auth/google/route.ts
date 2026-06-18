export async function GET() {
  return Response.redirect(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/google/login`
  );
}
