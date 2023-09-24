import { createHash } from "crypto";

export function getHash(source) {
  return createHash("sha1").update(source).digest("hex");
}
