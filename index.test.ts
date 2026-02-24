import { describe, expect, test } from "vitest";
import promiseTuple from "./index";

describe("promiseTuple", () => {
  test("Basic Success Case", async () => {
    const [error, result] = await promiseTuple(Promise.resolve("success"));
    expect(error).toBeUndefined();
    expect(result).toBe("success");
  });

  test("Basic Error Case", async () => {
    const testError = new Error("test error");
    const [error, result] = await promiseTuple(Promise.reject(testError));
    expect(error).toBe(testError);
    expect(result).toBeUndefined();
  });

  test("With Object Result", async () => {
    const data = { id: 1, name: "John" };
    const [error, result] = await promiseTuple(Promise.resolve(data));
    expect(error).toBeUndefined();
    expect(result).toEqual(data);
  });

  test("With Array Result", async () => {
    const data = [1, 2, 3];
    const [error, result] = await promiseTuple(Promise.resolve(data));
    expect(error).toBeUndefined();
    expect(result).toEqual(data);
  });

  test("With Null Result", async () => {
    const [error, result] = await promiseTuple(Promise.resolve(null));
    expect(error).toBeUndefined();
    expect(result).toBeNull();
  });

  test("With Undefined Result", async () => {
    const [error, result] = await promiseTuple(Promise.resolve(undefined));
    expect(error).toBeUndefined();
    expect(result).toBeUndefined();
  });

  test("With Custom Error Object", async () => {
    const customError = { code: "ERR_001", message: "Custom error" };
    const [error, result] = await promiseTuple(Promise.reject(customError));
    expect(error).toEqual(customError);
    expect(result).toBeUndefined();
  });

  test("With String Error", async () => {
    const errorMessage = "string error";
    const [error, result] = await promiseTuple(Promise.reject(errorMessage));
    expect(error).toBe(errorMessage);
    expect(result).toBeUndefined();
  });

  test("With Number Error", async () => {
    const errorCode = 42;
    const [error, result] = await promiseTuple(Promise.reject(errorCode));
    expect(error).toBe(errorCode);
    expect(result).toBeUndefined();
  });

  test("With Async Function", async () => {
    const asyncFunc = async () => "async result";
    const [error, result] = await promiseTuple(asyncFunc());
    expect(error).toBeUndefined();
    expect(result).toBe("async result");
  });

  test("With Failing Async Function", async () => {
    const asyncFunc = async () => {
      throw new Error("async error");
    };
    const [error, result] = await promiseTuple(asyncFunc());
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe("async error");
    expect(result).toBeUndefined();
  });

  test("With Fetch-like API (resolved)", async () => {
    const mockFetch = () => Promise.resolve(new Response('{"data": "test"}'));
    const [error, response] = await promiseTuple(mockFetch());
    expect(error).toBeUndefined();
    expect(response).toBeInstanceOf(Response);
  });

  test("With Fetch-like API (rejected)", async () => {
    const mockFetch = () => Promise.reject(new TypeError("Network error"));
    const [error, response] = await promiseTuple(mockFetch());
    expect(error).toBeInstanceOf(TypeError);
    expect(response).toBeUndefined();
  });

  test("Chaining with .then()", async () => {
    const [error, result] = await promiseTuple(
      Promise.resolve(10).then((x) => x * 2),
    );
    expect(error).toBeUndefined();
    expect(result).toBe(20);
  });

  test("Complex Promise Chain", async () => {
    const promise = Promise.resolve(5)
      .then((x) => x * 2)
      .then((x) => x + 3)
      .then((x) => x * 2);

    const [error, result] = await promiseTuple(promise);
    expect(error).toBeUndefined();
    expect(result).toBe(26); // (5 * 2 + 3) * 2 = 26
  });

  test("Type inference with Generics", async () => {
    interface User {
      id: number;
      name: string;
    }

    const user: User = { id: 1, name: "Alice" };
    const [error, result] = await promiseTuple<User>(Promise.resolve(user));
    expect(error).toBeUndefined();
    expect(result).toEqual(user);
  });

  test("Type inference with Error Generic", async () => {
    interface CustomError {
      code: string;
      message: string;
    }

    const error: CustomError = { code: "ERR_001", message: "Error" };
    const [err, result] = await promiseTuple<string, CustomError>(
      Promise.reject(error),
    );
    expect(err).toEqual(error);
    expect(result).toBeUndefined();
  });

  test("Sequential Operations", async () => {
    const [err1, result1] = await promiseTuple(Promise.resolve(10));
    expect(err1).toBeUndefined();
    expect(result1).toBe(10);

    const [err2, result2] = await promiseTuple(
      Promise.resolve((result1 as number) * 2),
    );
    expect(err2).toBeUndefined();
    expect(result2).toBe(20);
  });

  test("Multiple Parallel Operations", async () => {
    const promises = [
      promiseTuple(Promise.resolve("first")),
      promiseTuple(Promise.resolve("second")),
      promiseTuple(Promise.resolve("third")),
    ];

    const results = await Promise.all(promises);
    expect(results).toHaveLength(3);
    expect(results[0]).toEqual([undefined, "first"]);
    expect(results[1]).toEqual([undefined, "second"]);
    expect(results[2]).toEqual([undefined, "third"]);
  });

  test("Handles TypeError", async () => {
    const [error, result] = await promiseTuple(
      Promise.reject(new TypeError("Invalid type")),
    );
    expect(error).toBeInstanceOf(TypeError);
    expect((error as TypeError).message).toBe("Invalid type");
    expect(result).toBeUndefined();
  });

  test("Handles RangeError", async () => {
    const [error, result] = await promiseTuple(
      Promise.reject(new RangeError("Out of range")),
    );
    expect(error).toBeInstanceOf(RangeError);
    expect((error as RangeError).message).toBe("Out of range");
    expect(result).toBeUndefined();
  });

  test("Handles Boolean Result", async () => {
    const [error1, result1] = await promiseTuple(Promise.resolve(true));
    expect(error1).toBeUndefined();
    expect(result1).toBe(true);

    const [error2, result2] = await promiseTuple(Promise.resolve(false));
    expect(error2).toBeUndefined();
    expect(result2).toBe(false);
  });

  test("Handles Zero Result", async () => {
    const [error, result] = await promiseTuple(Promise.resolve(0));
    expect(error).toBeUndefined();
    expect(result).toBe(0);
  });

  test("Handles Empty String Result", async () => {
    const [error, result] = await promiseTuple(Promise.resolve(""));
    expect(error).toBeUndefined();
    expect(result).toBe("");
  });

  test("Default type parameters", async () => {
    // When no type parameters are specified, both should default to unknown
    const [error, result] = await promiseTuple(Promise.resolve(42));
    expect(error).toBeUndefined();
    expect(result).toBe(42);
  });

  test("Success callback is called on resolution", async () => {
    let callbackCalled = false;
    const successCallback = () => {
      callbackCalled = true;
    };

    const [error, result] = await promiseTuple(
      Promise.resolve("success"),
      successCallback,
    );
    expect(callbackCalled).toBe(true);
    expect(error).toBeUndefined();
    expect(result).toBe("success");
  });

  test("Failure callback is called on rejection", async () => {
    let callbackCalled = false;
    const failureCallback = () => {
      callbackCalled = true;
    };

    const testError = new Error("test error");
    const [error, result] = await promiseTuple(
      Promise.reject(testError),
      undefined,
      failureCallback,
    );
    expect(callbackCalled).toBe(true);
    expect(error).toBe(testError);
    expect(result).toBeUndefined();
  });

  test("Both callbacks with success", async () => {
    let successCalled = false;
    let failureCalled = false;

    const successCallback = () => {
      successCalled = true;
    };
    const failureCallback = () => {
      failureCalled = true;
    };

    const [error, result] = await promiseTuple(
      Promise.resolve("success"),
      successCallback,
      failureCallback,
    );
    expect(successCalled).toBe(true);
    expect(failureCalled).toBe(false);
    expect(error).toBeUndefined();
    expect(result).toBe("success");
  });

  test("Both callbacks with failure", async () => {
    let successCalled = false;
    let failureCalled = false;

    const successCallback = () => {
      successCalled = true;
    };
    const failureCallback = () => {
      failureCalled = true;
    };

    const testError = new Error("test error");
    const [error, result] = await promiseTuple(
      Promise.reject(testError),
      successCallback,
      failureCallback,
    );
    expect(successCalled).toBe(false);
    expect(failureCalled).toBe(true);
    expect(error).toBe(testError);
    expect(result).toBeUndefined();
  });

  test("Success callback with complex result", async () => {
    const expectedData = { id: 1, name: "Alice", active: true };
    let callbackData: unknown;
    const successCallback = () => {
      callbackData = expectedData;
    };

    const [error, result] = await promiseTuple(
      Promise.resolve(expectedData),
      successCallback,
    );
    expect(error).toBeUndefined();
    expect(result).toEqual(expectedData);
    expect(callbackData).toEqual(expectedData);
  });

  test("Failure callback with custom error", async () => {
    const customError = { code: "ERR_500", message: "Internal Server Error" };
    let errorCaptured: unknown;

    const failureCallback = () => {
      errorCaptured = customError;
    };

    const [error, result] = await promiseTuple(
      Promise.reject(customError),
      undefined,
      failureCallback,
    );
    expect(error).toEqual(customError);
    expect(result).toBeUndefined();
    expect(errorCaptured).toEqual(customError);
  });

  test("Callback with async operation", async () => {
    let sideEffectValue = 0;

    const successCallback = () => {
      sideEffectValue = 42;
    };

    const [error, result] = await promiseTuple(
      Promise.resolve(10),
      successCallback,
    );
    expect(sideEffectValue).toBe(42);
    expect(error).toBeUndefined();
    expect(result).toBe(10);
  });

  test("Success callback with null result", async () => {
    let callbackInvoked = false;
    const successCallback = () => {
      callbackInvoked = true;
    };

    const [error, result] = await promiseTuple(
      Promise.resolve(null),
      successCallback,
    );
    expect(callbackInvoked).toBe(true);
    expect(error).toBeUndefined();
    expect(result).toBeNull();
  });

  test("Failure callback with string error", async () => {
    let callbackInvoked = false;
    const failureCallback = () => {
      callbackInvoked = true;
    };

    const [error, result] = await promiseTuple(
      Promise.reject("string error"),
      undefined,
      failureCallback,
    );
    expect(callbackInvoked).toBe(true);
    expect(error).toBe("string error");
    expect(result).toBeUndefined();
  });
});
