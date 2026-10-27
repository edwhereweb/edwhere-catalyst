type ClerkTokenGetter = () => Promise<string | null>;

let clerkTokenGetter: ClerkTokenGetter | undefined;

export function setClerkTokenGetter(getter: ClerkTokenGetter) {
  clerkTokenGetter = getter;
}

export function getClerkToken() {
  return clerkTokenGetter?.() ?? Promise.resolve(null);
}
