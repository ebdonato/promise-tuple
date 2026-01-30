# Promise Tuple

A lightweight utility function for handling promises with Go-like error handling pattern. Instead of using try/catch blocks, `promiseTuple` returns a tuple containing either an error or a result.

## Features

- 🎯 Simple and intuitive error handling
- 📦 TypeScript support with full type safety
- 🔄 Go-style error handling pattern
- ⚡ Zero dependencies
- 🌐 Works in Node.js and browsers

## Installation

```bash
npm install promise-tuple
```

or with yarn:

```bash
yarn add promise-tuple
```

or with pnpm:

```bash
pnpm add promise-tuple
```

## How to Use

### Import

**ES Module:**

```typescript
import promiseTuple from 'promise-tuple';
```

**CommonJS:**

```javascript
const promiseTuple = require('promise-tuple');
```

### Basic Usage

```typescript
import promiseTuple from 'promise-tuple';

// Example with a fetch request
const [error, data] = await promiseTuple(fetch('/api/data'));

if (error) {
  console.error('Error:', error);
} else {
  console.log('Data:', data);
}
```

### With Custom Types

You can specify the type of the resolved value and error:

```typescript
import promiseTuple from 'promise-tuple';

interface User {
  id: number;
  name: string;
}

const [error, user] = await promiseTuple<User>(
  fetch('/api/user').then(res => res.json())
);

if (error) {
  console.error('Failed to fetch user:', error);
} else {
  console.log('User:', user?.name);
}
```

### In async/await Functions

```typescript
async function getUser(userId: string) {
  const [error, response] = await promiseTuple(
    fetch(`/api/users/${userId}`)
  );

  if (error) {
    throw new Error(`Failed to fetch user: ${error}`);
  }

  const [parseError, user] = await promiseTuple(
    response.json()
  );

  if (parseError) {
    throw new Error(`Failed to parse user data: ${parseError}`);
  }

  return user;
}
```

### With Custom Error Types

```typescript
import promiseTuple from 'promise-tuple';

interface CustomError {
  code: string;
  message: string;
}

const [error, data] = await promiseTuple<string, CustomError>(
  someAsyncOperation()
);
```

## API

### `promiseTuple<R, E>(promise)`

Handles a promise and returns a tuple with error and result.

**Parameters:**

- `promise: Promise<R>` - The promise to handle

**Returns:**

- `Promise<[E | undefined, R | undefined]>` - A promise that resolves to a tuple containing either an error or a result

**Type Parameters:**

- `R` (default: `unknown`) - The type of the resolved value
- `E` (default: `unknown`) - The type of the error

**Behavior:**

- If the promise resolves: returns `[undefined, result]`
- If the promise rejects: returns `[error, undefined]`

## Examples

### Database Query

```typescript
import promiseTuple from 'promise-tuple';
import db from './database';

async function getUserById(id: number) {
  const [error, user] = await promiseTuple(
    db.users.findById(id)
  );

  if (error) {
    return { success: false, message: 'User not found' };
  }

  return { success: true, user };
}
```

### File Operations

```typescript
import promiseTuple from 'promise-tuple';
import fs from 'fs/promises';

async function readConfigFile(path: string) {
  const [error, content] = await promiseTuple(
    fs.readFile(path, 'utf-8')
  );

  if (error) {
    console.error('Failed to read config:', error);
    return null;
  }

  return JSON.parse(content);
}
```

## License

ISC
