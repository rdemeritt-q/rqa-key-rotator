const test = require("node:test");
const assert = require("node:assert");
const { rotateDataKey } = require("../src/rotate");

// A fake client: no network, no credentials.
function fakeClient() {
  const calls = [];
  return {
    calls,
    send: async (cmd) => {
      calls.push(cmd.input);
      return {
        KeyId: "key-1",
        Plaintext: new Uint8Array(32).fill(1),
        CiphertextBlob: new Uint8Array([1, 2, 3]),
      };
    },
  };
}

test("requests an AES-256 data key for the configured key id", async () => {
  const client = fakeClient();
  const key = await rotateDataKey(client, "key-1");
  assert.deepStrictEqual(client.calls, [{ KeyId: "key-1", KeySpec: "AES_256" }]);
  assert.strictEqual(key.plaintext.length, 32);
  assert.strictEqual(key.wrapped, "AQID");
});

test("fails without a key id", async () => {
  await assert.rejects(() => rotateDataKey(fakeClient(), ""), /KMS_KEY_ID/);
});
