export async function GET() {
  return new Response(JSON.stringify({ status: 'ok', message: 'API is working' }), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}