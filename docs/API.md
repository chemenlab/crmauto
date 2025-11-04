# AutoHub API Documentation

## Base URL

```
http://localhost:4000/api/v1
```

## Authentication

Most endpoints require authentication using JWT tokens.

Include the token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

---

## Endpoints

### Health Check

#### GET /health
Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "AutoHub API is running",
  "timestamp": "2025-11-04T..."
}
```

---

### API Info

#### GET /api/v1
Get API version and available endpoints.

**Response:**
```json
{
  "success": true,
  "message": "AutoHub API v1",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/v1/auth",
    "users": "/api/v1/users",
    "services": "/api/v1/services",
    "reviews": "/api/v1/reviews",
    "cities": "/api/v1/cities",
    "categories": "/api/v1/categories"
  }
}
```

---

## Coming Soon

The following endpoints will be implemented:

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/services` - Get list of services
- `GET /api/v1/services/:id` - Get service details
- `POST /api/v1/reviews` - Create review
- And more...

For the full API specification, refer to the [Technical Specification](../TZ.md#api-endpoints).

---

## Rate Limiting

- **Global limit:** 100 requests per minute per IP
- **Auth endpoints:** 5 requests per minute per IP

Exceeded rate limit response:
```json
{
  "success": false,
  "error": {
    "message": "Too many requests from this IP, please try again later",
    "code": "RATE_LIMIT_EXCEEDED"
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Missing or invalid authentication |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid input data |
| `DUPLICATE_ENTRY` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [ /* array of items */ ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

## Filtering and Sorting

Most list endpoints support filtering and sorting through query parameters.

Example:
```
GET /api/v1/services?city=moscow&rating=4&sort=rating
```

Refer to specific endpoint documentation for available filters.
