export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return new Response(JSON.stringify({ error: 'Address parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar que sea una dirección Ethereum válida
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return new Response(JSON.stringify({ error: 'Invalid Ethereum address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    
    return new Response(JSON.stringify({
      message: `Message to sign ${new Date().toISOString()}`,
      address: address
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}