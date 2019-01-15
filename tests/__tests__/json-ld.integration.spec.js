const fs = require("fs");
const path = require("path");
const parser = require("xml2json");
const jsonld = require("jsonld");
const jsigs = require("jsonld-signatures");

const jsonLDString = fs
  .readFileSync(path.resolve(__dirname, "../../app/public/json/get.jsonld"))
  .toString();

const doc = JSON.parse(jsonLDString);

// required context extensions:

// "scriptFormat": "https://www.w3.org/ns/activitystreams#Group",
// "sourceRef": "https://www.w3.org/ns/activitystreams#Group",
// "targetRef": "https://www.w3.org/ns/activitystreams#Group",
// "isExecutable": "https://www.w3.org/ns/activitystreams#Group",
// "bpmnElement": "https://www.w3.org/ns/activitystreams#Group",
// "x":  "https://www.w3.org/ns/activitystreams#Group",
// "y":  "https://www.w3.org/ns/activitystreams#Group",
// "height":  "https://www.w3.org/ns/activitystreams#Group",
// "width":  "https://www.w3.org/ns/activitystreams#Group",
// "targetNamespace":  "https://www.w3.org/ns/activitystreams#Group",

const passphrase = "correct horse battery staple";
const keypair = {
  publicKey:
    "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nxk8EXDT/8hMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAzRMiYWxpY2VA\r\nZXhhbXBsZS5jb20iwncEEBMIAB8FAlw0//IGCwkHCAMCBBUICgIDFgIBAhkB\r\nAhsDAh4BAAoJEEp6Ac0q7g1gohoBAP0pOtmgx6TSpL94tCTFL8jxjphNBfSG\r\neugvsDf/huzyAP9tSDRRCA6src6v/orOChQ0BbcM8zXVQw8K33I2yxAWRM5T\r\nBFw0//ISBSuBBAAKAgMENtibiizsNERI4B9yj5Xb6UC8j23rzup3f77P4VMg\r\nYEQxYQeunmptCoNCv2xbKXexKgUH+bIODI7VtoPlJTDbgAMBCAfCYQQYEwgA\r\nCQUCXDT/8gIbDAAKCRBKegHNKu4NYPkTAQDXNkA3BUEQEOVZ4MGMU3K1Z+Kp\r\n4jnuQCtaX6fQDMseBAEA8iIId8uCS7KXkQhxD9hPCZQ52ttDZI8S2/IRx/+S\r\nZF8=\r\n=/os5\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n",
  privateKey:
    "-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nxaIEXDT/8hMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuA/gkDCAAAAAAA\r\nAAAA4AAAAAAAAAAAAAAAAAAAAAB5UQ0maxamLRPs6EDvbJQVSBQYKcsF4adJ\r\njaxjHC3SQTnfNNLDsH5gegr1GDP5F6QjmSB2/AHNEyJhbGljZUBleGFtcGxl\r\nLmNvbSLCdwQQEwgAHwUCXDT/8gYLCQcIAwIEFQgKAgMWAgECGQECGwMCHgEA\r\nCgkQSnoBzSruDWCiGgEA/Sk62aDHpNKkv3i0JMUvyPGOmE0F9IZ66C+wN/+G\r\n7PIA/21INFEIDqytzq/+is4KFDQFtwzzNdVDDwrfcjbLEBZEx6YEXDT/8hIF\r\nK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/hUyBgRDFhB66e\r\nam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAAwEIB/4JAwgAAAAAAAAAAOAA\r\nAAAAAAAAAAAAAAAAAAAAeVENJmsWpi0T7OhA72yUFUgUGCnLBeGnSY2sYxwt\r\n0kE53zTSw7B+YHoK9Rgz+RekI5kgdvwBwmEEGBMIAAkFAlw0//ICGwwACgkQ\r\nSnoBzSruDWD5EwEA1zZANwVBEBDlWeDBjFNytWfiqeI57kArWl+n0AzLHgQB\r\nAPIiCHfLgkuyl5EIcQ/YTwmUOdrbQ2SPEtvyEcf/kmRf\r\n=uotq\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n"
};

const publicKeyPem =
  "-----BEGIN PUBLIC KEY-----\n" +
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAj+uWAsdsMZhH+DE9d0Je\n" +
  "keJ6GVlb8C0tnvT+wW9vNJhg/Zb3qsT0ENli7GLFvm8wSEt61Ng8Xt8M+ytCnqQP\n" +
  "+SqKGx5fdrCeEwR0G2tzsUo2B4/H3DEp45656hBKtu0ZeTl8ZgfCKlYdDttoDWmq\n" +
  "CH3SHrqcmzlVcX3pnE0ARkP2trHODQDpX1gFF7Ct/uRyEppplK2c/SkElVuAD5c3\n" +
  "JX2wx81dv7Ujhse7ZKX9UEJ1FmrSa/O3JjdOSa5/hK0/oRHmBDK46RMdr94S7/GU\n" +
  "z1I2akGMkSxzBMJEw9wXd01GJXw+Xv8TkFF5ae+iQ0I7hkrww8x+G9EQCRKylV8w\n" +
  "cwIDAQAB\n" +
  "-----END PUBLIC KEY-----";

const privateKeyPem =
  "-----BEGIN RSA PRIVATE KEY-----\n" +
  "MIIEowIBAAKCAQEAj+uWAsdsMZhH+DE9d0JekeJ6GVlb8C0tnvT+wW9vNJhg/Zb3\n" +
  "qsT0ENli7GLFvm8wSEt61Ng8Xt8M+ytCnqQP+SqKGx5fdrCeEwR0G2tzsUo2B4/H\n" +
  "3DEp45656hBKtu0ZeTl8ZgfCKlYdDttoDWmqCH3SHrqcmzlVcX3pnE0ARkP2trHO\n" +
  "DQDpX1gFF7Ct/uRyEppplK2c/SkElVuAD5c3JX2wx81dv7Ujhse7ZKX9UEJ1FmrS\n" +
  "a/O3JjdOSa5/hK0/oRHmBDK46RMdr94S7/GUz1I2akGMkSxzBMJEw9wXd01GJXw+\n" +
  "Xv8TkFF5ae+iQ0I7hkrww8x+G9EQCRKylV8wcwIDAQABAoIBAFBNy65RR/WEWuQJ\n" +
  "1Zot1kbgb/ClA7/H9aS0X1Hfs9VNERFuo1MOAoFESwZLNrtDn1U3iJoq7cSiAMRF\n" +
  "Jy8NrDwDmHv5PpsjgZBq8744/pz2I5+kgohChnUTo/kOjiHzujsB8H+d5KFq21vm\n" +
  "4PBa/R0v14Z96dRS8XIaJ7em33hUradmuYQYNn9IgP5Y334DebTaTE4+yeFkR0z5\n" +
  "KLm78o/3uoH7+a2C2u2ERimaLO4mpqQXHtmzhulbW2aBIQsR8wGzrBH/AnIej+h/\n" +
  "FJ2CF1XrChq6a2k+Nu9mLRDKxHYN4uQq9qSB7js6p8ZSUC7HkOT6tge69uNn1jZZ\n" +
  "lpKLNQECgYEAwNtNRphFMA6oYLS5FaUY8l/Th66ToDMzVGK3DWXnoHA3vBU/1LW2\n" +
  "VPwV/PJVdTY5mXoERAI75QHCrLcdH07ppHusc6pFdzdVvO8Q5XnwUTfb6dcG7Ips\n" +
  "vniDd3AMWUFgbK2qNOOOeM7Qe0OPXNWzHHcmtL2uLOno8Y4J32cBwqMCgYEAvwqT\n" +
  "ECUjQmtoWHOWcO5M0SCv6YMBrigBY3Y8zFztDWltFhCKUT9WLAMOIHh5CKGnfLgG\n" +
  "4PV9kjTLEefxtUCqBm00SifkfRujfUQyZjfZIV9UBhSDceiM9phAK8JsTAKbop/h\n" +
  "FTDkknyqzsM7biLZjflGNWXvuwASKu0ssJjRh/ECgYBvsNJhNyCiw2pqj1+9lF8N\n" +
  "R8gXBVkD54MrtPv0q3bo6PSuXdQY2aAeOdx2INazSlMzeoHr7StI5qsbIfWgwy/3\n" +
  "DZUDa7JNZ+OkxwOPEv7F2sbm95xP858k9GCXFHJiYsV4S1+Ov9csSgJd0PO/PRg9\n" +
  "PRhShqPP6Sv6cVtwYZSYZwKBgHMa7Pb6WV9IletNYaSTgEc02ajpnVaQlh2WfRVp\n" +
  "HA9LqUV1G9HORp5oDNf1nn9b3y1fOA3M/Cbelkgop1LdLlSG8c2IcbwLrhrovzEl\n" +
  "jzbzWA39yCEWy/A8VdXH5DZ8D8gRaq248s9sPAIuUZ2Pc+N+ARZlX+cdKNUiaB3T\n" +
  "RdQRAoGBAIc/UaN3A8ya1+dZ5orrQkjuPQXB7+UzR128vzsKb3F8nt4F92bRMu3D\n" +
  "vBHZCT4QDhv4CCyYlu//LqVBQDdUo4BNayZmjK8J0XUQ/YY77CE35YRRqQAphvvz\n" +
  "fCwRbNd/EW88Pg8ioO1WWcIgmA0296qEBv079qOWqPQq/BbUjH/3\n" +
  "-----END RSA PRIVATE KEY-----";

// specify the public key object
const publicKey = {
  "@context": jsigs.SECURITY_CONTEXT_URL,
  type: "RsaVerificationKey2018",
  id: "https://example.com/i/alice/keys/1",
  controller: "https://example.com/i/alice",
  publicKeyPem
};

// specify the public key controller object
const controller = {
  "@context": jsigs.SECURITY_CONTEXT_URL,
  id: "https://example.com/i/alice",
  publicKey: [publicKey],
  // this authorizes this key to be used for making assertions
  assertionMethod: [publicKey.id]
};

const testDocumentLoader = url => {
  if (url === "https://example.com/i/alice/keys/1") {
    return {
      contextUrl: null,
      document: publicKey,
      documentUrl: url
    };
  }
};

const openpgp = require("openpgp");
const { sign, verify } = require("@transmute/openpgpsignature2019");

describe("jsonld", () => {
  it("can cannonized converted", done => {
    jsonld.canonize(
      doc,
      {
        algorithm: "URDNA2015",
        format: "application/n-quads"
      },
      (err, canonized) => {
        if (err) {
          throw err;
        }
        // console.log(canonized);
        done();
        // canonized is a string that is a canonical representation of the document
        // that can be used for hashing, comparison, etc.
      }
    );
  });

  it("can sign converted with openpgp", async () => {
    const privateKey = (await openpgp.key.readArmored(keypair.privateKey))
      .keys[0];
    await privateKey.decrypt(passphrase);
    const signed = await sign({
      data: doc,
      privateKey,
      creator: "yolo",
      signatureAttribute: "proof",
      domain: "bpmn.demo"
    });
    // console.log(signed);
    const verified = await verify({
      data: signed,
      publicKey: keypair.publicKey,
      signatureAttribute: "proof"
    });
    expect(verified).toBe(true);
  }, 10 * 1000);

  it("can sign converted jsonld-signatures", async () => {
    const { RsaSignature2018 } = jsigs.suites;
    const { AssertionProofPurpose } = jsigs.purposes;
    const { RSAKeyPair } = jsigs;
    const key = new RSAKeyPair({ ...publicKey, privateKeyPem });
    const signed = await jsigs.sign(doc, {
      suite: new RsaSignature2018({ key }),
      purpose: new AssertionProofPurpose()
    });

    // console.log("Signed document:", signed);

    // verify the signed document
    const result = await jsigs.verify(signed, {
      suite: new RsaSignature2018(key),
      purpose: new AssertionProofPurpose({ controller }),
      documentLoader: testDocumentLoader
    });
    expect(result.verified).toBe(true);
  });
});
