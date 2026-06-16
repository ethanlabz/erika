/**
 * Determines if a navigation link is currently active based on the browser pathname.
 * Supports exact equality checks as well as nested subdirectory matching.
 */
export function isActive(
  url: string,
  pathname: string,
  nested: boolean = false
): boolean {
  // Normalize both paths by removing trailing slashes for accurate comparison
  const cleanUrl = url.replace(/\/$/, "");
  const cleanPathname = pathname.replace(/\/$/, "");

  // 1. Exact match comparison
  if (cleanUrl === cleanPathname) return true;

  // 2. Nested sub-directory branch validation (e.g., /docs/core matching /docs/core/python)
  if (nested) {
    return cleanPathname.startsWith(cleanUrl + "/");
  }

  return false;
}
