import { client } from '@motis-project/motis-client';
import { browser } from '$app/environment';
import type { QuerySerializerOptions } from '@hey-api/client-fetch';

export const prerender = true;

// Patched: always use api.transitous.org as the MOTIS backend
const MOTIS_API = 'https://api.transitous.org';

if (browser) {
  const params = new URL(window.location.href).searchParams;
  const motisParam = params.get('motis');
  let baseUrl = MOTIS_API;

  // Allow overriding via ?motis= query param
  if (motisParam) {
    const defaultProtocol = window.location.protocol;
    const defaultPort = '8080';
    if (/^[0-9]+$/.test(motisParam)) {
      baseUrl = defaultProtocol + '//' + window.location.hostname + ':' + motisParam;
    } else if (!motisParam.includes(':')) {
      baseUrl = defaultProtocol + '//' + motisParam + ':' + defaultPort;
    } else if (!motisParam.startsWith('http:') && !motisParam.startsWith('https:')) {
      baseUrl = defaultProtocol + '//' + motisParam;
    } else {
      baseUrl = motisParam;
    }
  }

  const querySerializer = { array: { explode: false } } as QuerySerializerOptions;
  client.setConfig({ baseUrl, querySerializer });
}
