import {strict as assert} from "assert"
import test from "node:test"
import promiseTuple from "./index"

test("promiseTuple - Basic Success Case", async () => {
    const [error, result] = await promiseTuple(Promise.resolve("success"))
    assert.equal(error, undefined)
    assert.equal(result, "success")
})

test("promiseTuple - Basic Error Case", async () => {
    const testError = new Error("test error")
    const [error, result] = await promiseTuple(Promise.reject(testError))
    assert.equal(error, testError)
    assert.equal(result, undefined)
})

test("promiseTuple - With Object Result", async () => {
    const data = {id: 1, name: "John"}
    const [error, result] = await promiseTuple(Promise.resolve(data))
    assert.equal(error, undefined)
    assert.deepEqual(result, data)
})

test("promiseTuple - With Array Result", async () => {
    const data = [1, 2, 3]
    const [error, result] = await promiseTuple(Promise.resolve(data))
    assert.equal(error, undefined)
    assert.deepEqual(result, data)
})

test("promiseTuple - With Null Result", async () => {
    const [error, result] = await promiseTuple(Promise.resolve(null))
    assert.equal(error, undefined)
    assert.equal(result, null)
})

test("promiseTuple - With Undefined Result", async () => {
    const [error, result] = await promiseTuple(Promise.resolve(undefined))
    assert.equal(error, undefined)
    assert.equal(result, undefined)
})

test("promiseTuple - With Custom Error Object", async () => {
    const customError = {code: "ERR_001", message: "Custom error"}
    const [error, result] = await promiseTuple(Promise.reject(customError))
    assert.deepEqual(error, customError)
    assert.equal(result, undefined)
})

test("promiseTuple - With String Error", async () => {
    const errorMessage = "string error"
    const [error, result] = await promiseTuple(Promise.reject(errorMessage))
    assert.equal(error, errorMessage)
    assert.equal(result, undefined)
})

test("promiseTuple - With Number Error", async () => {
    const errorCode = 42
    const [error, result] = await promiseTuple(Promise.reject(errorCode))
    assert.equal(error, errorCode)
    assert.equal(result, undefined)
})

test("promiseTuple - With Async Function", async () => {
    const asyncFunc = async () => "async result"
    const [error, result] = await promiseTuple(asyncFunc())
    assert.equal(error, undefined)
    assert.equal(result, "async result")
})

test("promiseTuple - With Failing Async Function", async () => {
    const asyncFunc = async () => {
        throw new Error("async error")
    }
    const [error, result] = await promiseTuple(asyncFunc())
    assert(error instanceof Error)
    assert.equal((error as Error).message, "async error")
    assert.equal(result, undefined)
})

test("promiseTuple - With Fetch-like API (resolved)", async () => {
    const mockFetch = () => Promise.resolve(new Response('{"data": "test"}'))
    const [error, response] = await promiseTuple(mockFetch())
    assert.equal(error, undefined)
    assert(response instanceof Response)
})

test("promiseTuple - With Fetch-like API (rejected)", async () => {
    const mockFetch = () => Promise.reject(new TypeError("Network error"))
    const [error, response] = await promiseTuple(mockFetch())
    assert(error instanceof TypeError)
    assert.equal(response, undefined)
})

test("promiseTuple - Chaining with .then()", async () => {
    const [error, result] = await promiseTuple(Promise.resolve(10).then((x) => x * 2))
    assert.equal(error, undefined)
    assert.equal(result, 20)
})

test("promiseTuple - Complex Promise Chain", async () => {
    const promise = Promise.resolve(5)
        .then((x) => x * 2)
        .then((x) => x + 3)
        .then((x) => x * 2)

    const [error, result] = await promiseTuple(promise)
    assert.equal(error, undefined)
    assert.equal(result, 26) // (5 * 2 + 3) * 2 = 26
})

test("promiseTuple - Type inference with Generics", async () => {
    interface User {
        id: number
        name: string
    }

    const user: User = {id: 1, name: "Alice"}
    const [error, result] = await promiseTuple<User>(Promise.resolve(user))
    assert.equal(error, undefined)
    assert.deepEqual(result, user)
})

test("promiseTuple - Type inference with Error Generic", async () => {
    interface CustomError {
        code: string
        message: string
    }

    const error: CustomError = {code: "ERR_001", message: "Error"}
    const [err, result] = await promiseTuple<string, CustomError>(Promise.reject(error))
    assert.deepEqual(err, error)
    assert.equal(result, undefined)
})

test("promiseTuple - Sequential Operations", async () => {
    const [err1, result1] = await promiseTuple(Promise.resolve(10))
    assert.equal(err1, undefined)
    assert.equal(result1, 10)

    const [err2, result2] = await promiseTuple(Promise.resolve((result1 as number) * 2))
    assert.equal(err2, undefined)
    assert.equal(result2, 20)
})

test("promiseTuple - Multiple Parallel Operations", async () => {
    const promises = [
        promiseTuple(Promise.resolve("first")),
        promiseTuple(Promise.resolve("second")),
        promiseTuple(Promise.resolve("third")),
    ]

    const results = await Promise.all(promises)
    assert.equal(results.length, 3)
    assert.deepEqual(results[0], [undefined, "first"])
    assert.deepEqual(results[1], [undefined, "second"])
    assert.deepEqual(results[2], [undefined, "third"])
})

test("promiseTuple - Handles TypeError", async () => {
    const [error, result] = await promiseTuple(Promise.reject(new TypeError("Invalid type")))
    assert(error instanceof TypeError)
    assert.equal((error as TypeError).message, "Invalid type")
    assert.equal(result, undefined)
})

test("promiseTuple - Handles RangeError", async () => {
    const [error, result] = await promiseTuple(Promise.reject(new RangeError("Out of range")))
    assert(error instanceof RangeError)
    assert.equal((error as RangeError).message, "Out of range")
    assert.equal(result, undefined)
})

test("promiseTuple - Handles Boolean Result", async () => {
    const [error1, result1] = await promiseTuple(Promise.resolve(true))
    assert.equal(error1, undefined)
    assert.equal(result1, true)

    const [error2, result2] = await promiseTuple(Promise.resolve(false))
    assert.equal(error2, undefined)
    assert.equal(result2, false)
})

test("promiseTuple - Handles Zero Result", async () => {
    const [error, result] = await promiseTuple(Promise.resolve(0))
    assert.equal(error, undefined)
    assert.equal(result, 0)
})

test("promiseTuple - Handles Empty String Result", async () => {
    const [error, result] = await promiseTuple(Promise.resolve(""))
    assert.equal(error, undefined)
    assert.equal(result, "")
})

test("promiseTuple - Default type parameters", async () => {
    // When no type parameters are specified, both should default to unknown
    const [error, result] = await promiseTuple(Promise.resolve(42))
    assert.equal(error, undefined)
    assert.equal(result, 42)
})
