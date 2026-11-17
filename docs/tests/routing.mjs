// Run against a production server: node docs/tests/routing.mjs [origin]
import assert from 'node:assert/strict';
import { test } from 'node:test';

const origin = process.argv[2] ?? 'http://localhost:3000';
const request = (path, userAgent = 'Mozilla/5.0') =>
  fetch(new URL(path, origin), {
    redirect: 'manual',
    headers: { 'user-agent': userAgent }
  });

for (const userAgent of ['Mozilla/5.0', 'Googlebot']) {
  test(`routing and metadata for ${userAgent}`, async () => {
    for (const [path, status] of [
      ['/', 200],
      ['/nl', 200],
      ['/guides', 200],
      ['/ja', 404],
      ['/hoge', 404],
      ['/nonexistent.png', 404],
      ['/favicon.ico', 404],
      ['/robots.txt', 200],
      ['/sitemap.xml', 200]
    ]) {
      assert.equal((await request(path, userAgent)).status, status, path);
    }
    for (const [path, target] of [
      ['/en', '/'],
      ['/en/', '/'],
      ['/en?foo=bar', '/?foo=bar'],
      [
        '/en/guides/filter-null-and-undefined?foo=bar',
        '/guides/filter-null-and-undefined?foo=bar'
      ]
    ]) {
      const response = await request(path, userAgent);
      assert.equal(response.status, 308, path);
      assert.equal(
        new URL(response.headers.get('location'), origin).href,
        new URL(target, origin).href,
        path
      );
    }
    for (const [path, lang, canonical] of [
      ['/', 'en', 'https://is-kit.dev/'],
      ['/nl', 'nl', 'https://is-kit.dev/nl']
    ]) {
      const html = await (await request(path, userAgent)).text();
      assert.match(html, new RegExp(`<html[^>]*lang="${lang}"`));
      for (const tag of [
        `<link rel="canonical" href="${canonical}"`,
        '<link rel="alternate" hrefLang="en" href="https://is-kit.dev/"',
        '<link rel="alternate" hrefLang="nl" href="https://is-kit.dev/nl"',
        '<link rel="alternate" hrefLang="x-default" href="https://is-kit.dev/"',
        `<meta property="og:url" content="${canonical}"`,
        '<link rel="icon" href="/iskit_favicon.png" type="image/png" sizes="192x192"'
      ])
        assert.ok(html.includes(tag), `${path}: ${tag}`);
    }
    const icon = await request('/iskit_favicon.png', userAgent);
    assert.equal(icon.status, 200);
    assert.match(icon.headers.get('content-type'), /^image\/png/);
  });

  test(`sitemap and legacy destinations for ${userAgent}`, async () => {
    const xml = await (await request('/sitemap.xml', userAgent)).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => match[1]
    );
    assert.ok(urls.length > 2);
    for (const url of urls) {
      const path = new URL(url).pathname;
      assert.ok(!path.startsWith('/en/'));
      assert.notEqual(path, '/en');
      assert.equal((await request(path, userAgent)).status, 200, path);
      if (path !== '/nl') {
        const legacy = await request(
          `/en${path === '/' ? '' : path}`,
          userAgent
        );
        assert.equal(legacy.status, 308, path);
        assert.equal(
          new URL(legacy.headers.get('location'), origin).pathname,
          path
        );
      }
    }
  });
}
