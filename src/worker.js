export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    if (pathname === '/') {
      pathname = '/index.html';
    }

    if (!pathname.endsWith('.html') && !pathname.includes('.')) {
      pathname = pathname + '/index.html';
    }

    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) {
        return response;
      }
    } catch (e) {
    }

    try {
      const indexResponse = await env.ASSETS.fetch(new URL('/index.html', request.url));
      return indexResponse;
    } catch (e2) {
      return new Response('Not Found', { status: 404 });
    }
  },
};
