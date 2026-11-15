async function check() {
  try {
    const res = await fetch('https://flowers-pi-two.vercel.app/');
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('HTML Length:', html.length);
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    console.log('Title:', titleMatch ? titleMatch[1] : 'No title');
    const metaDesc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    console.log('Description:', metaDesc ? metaDesc[1] : 'No desc');
    console.log('Sample text:\n', html.slice(0, 1500));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
check();
