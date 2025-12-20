import http from 'k6/http';
import { check, group } from 'k6';
import { Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import { login, fakeEmail } from './helpers.js';

const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';
const email = __ENV.LOGIN_EMAIL || 'john@example.com';
const password = __ENV.LOGIN_PASS || 'password123';

const checkoutData = new SharedArray('checkoutData', function() {
  return JSON.parse(open('./data/checkoutData.json'));
});

const checkoutTrend = new Trend('checkout_duration');

export const options = {
  vus: 10,
  duration: '15s',
  thresholds: {
    'http_req_duration': ['p(95)<2000']
  }
};

// Perform login once in setup and return token for all VUs
export function setup() {
  // wait/try login until success (helper handles retries)
  const result = login(baseUrl, email, password, 5, 1);
  const token = result.token;

  // final health check to ensure server reachable
  const h = http.get(`${baseUrl}/health`);
  check(h, { 'health is 200': r => r.status === 200 });

  return { token };
}

export default function (data) {
  const token = data.token;

  group('Checkout Flow', function () {
    const payloadBase = checkoutData[__ITER % checkoutData.length];
    const payload = Object.assign({}, payloadBase, { clientRef: fakeEmail('client') });
    const params = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Simulate': 'true'
      }
    };

    const res = http.post(`${baseUrl}/checkout`, JSON.stringify(payload), params);

    check(res, {
      'checkout status is 200': r => r.status === 200
    });

    checkoutTrend.add(res.timings ? res.timings.duration : 0);
  });
}
