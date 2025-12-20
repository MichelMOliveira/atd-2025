import http from 'k6/http';
import { check, sleep } from 'k6';

export function fakeEmail(name = 'user') {
  return `${name}.${Math.floor(Math.random() * 10000)}@example.com`;
}

// Robust login with retries. Returns token string or null.
export function login(baseUrl, email, password, attempts = 5, waitSec = 1) {
  const url = `${baseUrl}/auth/login`;
  const payload = JSON.stringify({ email, password });
  const params = { headers: { 'Content-Type': 'application/json' } };

  for (let i = 0; i < attempts; i++) {
    const res = http.post(url, payload, params);
    if (res && res.status === 200) {
      const body = res.json ? res.json() : {};
      const token = body && body.data && body.data.token ? body.data.token : null;
      check(res, { 'login status is 200': r => r.status === 200 });
      return { res, token };
    }

    // if not successful, wait and retry
    sleep(waitSec);
  }

  // final attempt result (to capture response for checks)
  const last = http.post(url, payload, params);
  check(last, { 'login status is 200': r => r.status === 200 });
  try {
    const body = last.json();
    return { res: last, token: body && body.data && body.data.token ? body.data.token : null };
  } catch (e) {
    return { res: last, token: null };
  }
}
