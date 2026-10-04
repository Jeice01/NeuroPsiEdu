import assert from 'node:assert/strict';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { trackingConsentScript } from '../src/lib/tracking-consent.ts';

function browser(consent) {
  const events = new Map(), scripts = [];
  let reloads = 0;
  const window = {
    Cookiebot: consent ? { consent } : undefined,
    location: { reload: () => { reloads++; } },
    addEventListener: (name, callback) => events.set(name, callback),
  };
  const document = { createElement: () => ({}), head: { appendChild: script => scripts.push(script) } };
  runInNewContext(trackingConsentScript, { window, document });
  return { window, scripts, emit: name => events.get(name)(), reloads: () => reloads };
}

test('missing provider, denied and partial consent never start tracking', () => {
  for (const consent of [undefined, {}, { statistics: true }, { marketing: true }, { statistics: 'true', marketing: true }]) {
    const page = browser(consent);
    page.emit('CookiebotOnConsentReady');
    page.emit('CookiebotOnAccept');
    assert.equal(page.scripts.length, 0);
    assert.equal(page.window.dataLayer, undefined);
  }
});

test('both consents load GTM once and withdrawal stops active tags by reloading', () => {
  const page = browser({ statistics: false, marketing: false });
  page.window.Cookiebot.consent = { statistics: true, marketing: true };
  page.emit('CookiebotOnAccept');
  page.emit('CookiebotOnConsentReady');
  assert.equal(page.scripts.length, 1);
  assert.equal(page.scripts[0].src, 'https://www.googletagmanager.com/gtm.js?id=GTM-54TNTKLF');
  assert.equal(page.window.dataLayer.length, 1);
  page.window.Cookiebot.consent.marketing = false;
  page.emit('CookiebotOnDecline');
  assert.equal(page.reloads(), 1);
});

test('previously granted consent is honored on a fresh visit', () => {
  assert.equal(browser({ statistics: true, marketing: true }).scripts.length, 1);
});
