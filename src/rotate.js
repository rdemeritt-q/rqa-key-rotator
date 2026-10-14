const { KMSClient, GenerateDataKeyCommand } = require("@aws-sdk/client-kms");

// Asks KMS for a fresh AES-256 data key and returns both forms.
async function rotateDataKey(client, keyId) {
  if (!keyId) throw new Error("KMS_KEY_ID is not set");
  const out = await client.send(
    new GenerateDataKeyCommand({ KeyId: keyId, KeySpec: "AES_256" })
  );
  return {
    keyId: out.KeyId,
    plaintext: Buffer.from(out.Plaintext),
    wrapped: Buffer.from(out.CiphertextBlob).toString("base64"),
  };
}

async function main() {
  const client = new KMSClient({ region: process.env.AWS_REGION });
  const key = await rotateDataKey(client, process.env.KMS_KEY_ID);
  // Only the wrapped key is printed; the plaintext stays in memory.
  console.log(JSON.stringify({ keyId: key.keyId, wrapped: key.wrapped }));
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = { rotateDataKey };
