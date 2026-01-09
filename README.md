# E-commerce REST API

A simple e-commerce REST API built with JavaScript and Express.js that allows users to register, login with JWT authentication, and perform checkouts with cash or credit card payments.

## Description

This API provides a complete e-commerce backend solution with the following features:
- User registration and authentication using JWT tokens
- Secure checkout process with payment method validation
- Cash payments with 10% discount
- Credit card payments with no discount
- Health check endpoint for monitoring
- Complete API documentation with Swagger UI

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd atd-2025
```

2. Install dependencies:
```bash
npm install
```

## How to Run

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## Rules

### Checkout Rules
- **Payment Methods**: Only cash and credit card are accepted
- **Cash Discount**: Cash payments receive a 10% discount
- **Authentication**: Only authenticated users can perform checkout
- **Product Validation**: Products must exist and have sufficient stock

### API Rules
- **Endpoints**: Only 4 endpoints are available (login, register, checkout, healthcheck)
- **Data Storage**: Everything runs in memory (no database)
- **JWT Authentication**: Required for checkout endpoint
- **Input Validation**: All inputs are validated for security

## Data Already Existent

### Users (3 default users)
| ID | Email | Password | Name |
|----|-------|----------|------|
| 1 | john@example.com | password123 | John Doe |
| 2 | jane@example.com | password456 | Jane Smith |
| 3 | bob@example.com | password789 | Bob Johnson |

### Products (3 default products)
| ID | Name | Description | Price | Stock |
|----|------|-------------|-------|-------|
| 1 | Laptop | High-performance laptop for work and gaming | $999.99 | 50 |
| 2 | Smartphone | Latest model smartphone with advanced features | $699.99 | 30 |
| 3 | Headphones | Wireless noise-canceling headphones | $199.99 | 100 |

## How to Use the REST API

### Base URL
```
http://localhost:3000
```

### API Documentation
Visit `http://localhost:3000/api-docs` for interactive Swagger documentation.

### Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 4,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### 3. Checkout
**POST** `/checkout`

Process a checkout with items and payment method. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ],
  "paymentMethod": "cash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Checkout completed successfully",
  "data": {
    "id": 1640995200000,
    "userId": 1,
    "items": [
      {
        "productId": 1,
        "productName": "Laptop",
        "quantity": 2,
        "unitPrice": 999.99,
        "total": 1999.98
      },
      {
        "productId": 3,
        "productName": "Headphones",
        "quantity": 1,
        "unitPrice": 199.99,
        "total": 199.99
      }
    ],
    "paymentMethod": "cash",
    "subtotal": 2199.97,
    "discount": 219.997,
    "total": 1979.973,
    "status": "completed",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 4. Health Check
**GET** `/health`

Check the health status of the API.

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.45,
    "memory": {
      "rss": 12345678,
      "heapTotal": 12345678,
      "heapUsed": 12345678,
      "external": 12345678
    },
    "environment": "development",
    "data": {
      "totalUsers": 3,
      "totalProducts": 3
    }
  }
}
```

#### 5. Get All Products
**GET** `/products`

Returns a list of all products. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop for work and gaming",
      "price": 999.99,
      "stock": 50,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Smartphone",
      "description": "Latest model smartphone with advanced features",
      "price": 699.99,
      "stock": 30,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Headphones",
      "description": "Wireless noise-canceling headphones",
      "price": 199.99,
      "stock": 100,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 6. Create Product
**POST** `/products`

Creates a new product. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "name": "Tablet",
  "description": "Portable tablet device",
  "price": 299.99,
  "stock": 20
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Tablet",
    "description": "Portable tablet device",
    "price": 299.99,
    "stock": 20,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Example Usage with cURL

#### Register a new user:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Checkout (replace TOKEN with actual JWT token):
```bash
curl -X POST http://localhost:3000/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 1
      }
    ],
    "paymentMethod": "cash"
  }'
```

#### Health check:
```bash
curl -X GET http://localhost:3000/health
```

#### Get all products (replace TOKEN with actual JWT token):
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer TOKEN"
```

#### Create a new product (replace TOKEN with actual JWT token):
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "Tablet",
    "description": "Portable tablet device",
    "price": 299.99,
    "stock": 20
  }'
```

### Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (invalid token)
- `404` - Not Found (endpoint not found)
- `500` - Internal Server Error

## Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── AuthController.js
│   ├── CheckoutController.js
│   └── HealthController.js
├── middleware/           # Custom middleware
│   └── auth.js
├── models/              # Data models
│   ├── User.js
│   └── Product.js
├── routes/              # Route definitions
│   ├── auth.js
│   ├── checkout.js
│   ├── health.js
│   └── index.js
├── services/            # Business logic
│   ├── UserService.js
│   └── CheckoutService.js
└── app.js              # Main application file
```

## Technologies Used


## License

ISC License

## Testes de Performance (K6)

### Conceitos Utilizados no Projeto

#### 1. **Groups**
O código abaixo está armazenado no arquivo `test/k6/checkout.test.js` e demonstra o uso do conceito de Groups, que agrupa testes relacionados:

```javascript
group('Checkout Flow', function () {
  const payloadBase = checkoutData[__ITER % checkoutData.length];
  const payload = Object.assign({}, payloadBase, { clientRef: fakeEmail('client') });
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const res = http.post(`${baseUrl}/checkout`, JSON.stringify(payload), params);
});
```

#### 2. **Helpers**
As funções auxiliares estão definidas no arquivo `test/k6/helpers.js` e são importadas e reutilizadas no teste:

```javascript
import { login, fakeEmail } from './helpers.js';

// Usando helper de login
export function setup() {
  const result = login(baseUrl, email, password, 5, 1);
  const token = result.token;
  return { token };
}

// Usando helper de fake email
const payload = Object.assign({}, payloadBase, { clientRef: fakeEmail('client') });
```

A função `login` é definida em `test/k6/helpers.js`:
```javascript
export function login(baseUrl, email, password, attempts = 5, waitSec = 1) {
  const url = `${baseUrl}/auth/login`;
  const payload = JSON.stringify({ email, password });
  const params = { headers: { 'Content-Type': 'application/json' } };
  // ... implementação com retries
}
```

#### 3. **Variáveis de Ambiente**
Variáveis de ambiente são utilizadas para configurar a base URL e credenciais de login em `test/k6/checkout.test.js`:

```javascript
const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';
const email = __ENV.LOGIN_EMAIL || 'john@example.com';
const password = __ENV.LOGIN_PASS || 'password123';
```

#### 4. **Thresholds**
Limites de desempenho estão definidos no arquivo `test/k6/checkout.test.js`, estabelecendo que 95% das requisições devem ser respondidas em menos de 2 segundos:

```javascript
export const options = {
  vus: 10,
  duration: '15s',
  thresholds: {
    'http_req_duration': ['p(95)<2000']
  }
};
```

#### 5. **Checks**
Verificações são feitas para validar as respostas das requisições em `test/k6/checkout.test.js` e em `test/k6/helpers.js`:

```javascript
// No checkout.test.js
check(h, { 'health is 200': r => r.status === 200 });

check(res, {
  'checkout status is 200': r => r.status === 200
});

// No helpers.js - dentro da função login
check(res, { 'login status is 200': r => r.status === 200 });
```

#### 6. **Trends**
Métrica de tendência para rastrear a duração das requisições de checkout em `test/k6/checkout.test.js`:

```javascript
import { Trend } from 'k6/metrics';

const checkoutTrend = new Trend('checkout_duration');

// Dentro do grupo de checkout
checkoutTrend.add(res.timings ? res.timings.duration : 0);
```

#### 7. **Faker**
Dados aleatórios são gerados usando a função `fakeEmail` em `test/k6/helpers.js`:

```javascript
export function fakeEmail(name = 'user') {
  return `${name}.${Math.floor(Math.random() * 10000)}@example.com`;
}

// Usado em test/k6/checkout.test.js
const payload = Object.assign({}, payloadBase, { clientRef: fakeEmail('client') });
```

#### 8. **Data-Driven Testing**
Os dados de teste são carregados de um arquivo JSON externo em `test/k6/checkout.test.js`:

```javascript
import { SharedArray } from 'k6/data';

const checkoutData = new SharedArray('checkoutData', function() {
  return JSON.parse(open('./data/checkoutData.json'));
});

// Dentro do default function
const payloadBase = checkoutData[__ITER % checkoutData.length];
```

Arquivo `test/k6/data/checkoutData.json` contém os cenários de teste:
```json
[
  {
    "items": [
      { "productId": 1, "quantity": 1 },
      { "productId": 2, "quantity": 2 }
    ],
    "paymentMethod": "credit_card"
  },
  {
    "items": [
      { "productId": 3, "quantity": 1 }
    ],
    "paymentMethod": "cash"
  }
]
```

#### 9. **Uso de Token de Autenticação**
O token JWT é obtido no setup e reutilizado em todas as requisições de checkout em `test/k6/checkout.test.js`:

```javascript
export function setup() {
  const result = login(baseUrl, email, password, 5, 1);
  const token = result.token;
  return { token };
}

export default function (data) {
  const token = data.token;
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  
  const res = http.post(`${baseUrl}/checkout`, JSON.stringify(payload), params);
}
```

#### 10. **Reaproveitamento de Resposta**
O token obtido na função `setup()` é reutilizado em todas as iterações da função `default` em `test/k6/checkout.test.js`:

```javascript
export function setup() {
  const result = login(baseUrl, email, password, 5, 1);
  const token = result.token;
  
  // Health check para validar servidor
  const h = http.get(`${baseUrl}/health`);
  check(h, { 'health is 200': r => r.status === 200 });
  
  // Retorna token para ser usado em todas as VUs
  return { token };
}

export default function (data) {
  const token = data.token; // Reaproveitamento do token do setup
  // ... resto do teste
}
```

### Como Executar os Testes

Para rodar localmente (requer k6 instalado):

```bash
# executar aplicação
npm run dev

# executar teste k6 (gera report.json)
k6 run --out json=report.json test/k6/checkout.test.js

# gerar relatório HTML (com k6-to-html disponível via npm ou npx)
npx k6-to-html report.json -o report.html
```
