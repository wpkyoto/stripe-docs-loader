/**
 * Utility functions for URL filtering
 */

/**
 * Checks if a URL matches the specified resource path
 * @param url URL to check
 * @param resource Resource path (single or multiple path segments)
 * @returns true if matches, false otherwise
 */
export function matchesResource(url: string, resource: string): boolean {
  // Remove hostname from URL and get only the path
  const urlPath = new URL(url).pathname;
  // Remove leading slash and get the first path segment
  const pathSegments = urlPath.split('/').filter(Boolean);

  if (resource.includes('/')) {
    // If resource contains multiple path segments (e.g., 'get-started/account')
    const resourceSegments = resource.split('/').filter(Boolean);
    // Check if the specified resource path starts from the beginning of the URL
    return resourceSegments.every((segment, index) => pathSegments[index] === segment);
  } else {
    // If resource is a single path segment (e.g., 'connect')
    return pathSegments[0] === resource;
  }
}

/**
 * Checks if a URL matches any of the excluded resources
 * @param url URL to check
 * @param excludeResources Array of excluded resource paths
 * @returns true if excluded, false otherwise
 */
export function matchesExcludeResources(url: string, excludeResources: string[]): boolean {
  if (!excludeResources || excludeResources.length === 0) {
    return false;
  }

  // Remove hostname from URL and get only the path
  const urlPath = new URL(url).pathname;
  // Remove leading slash and get path segments
  const pathSegments = urlPath.split('/').filter(Boolean);

  for (const excludeResource of excludeResources) {
    if (excludeResource.includes('/')) {
      // If excludeResource contains multiple path segments (e.g., 'get-started/account')
      const excludeSegments = excludeResource.split('/').filter(Boolean);
      // Check if the specified exclude path starts from the beginning of the URL
      const matchesExclude = excludeSegments.every(
        (segment, index) => pathSegments[index] === segment
      );
      if (matchesExclude) {
        return true;
      }
    } else {
      // If excludeResource is a single path segment (e.g., 'connect')
      if (pathSegments[0] === excludeResource) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Function to filter URLs
 * @param urls Array of URLs to filter
 * @param resource Resource path to include (optional)
 * @param excludeResources Array of resource paths to exclude (optional)
 * @returns Filtered array of URLs
 */
export function filterUrls(
  urls: string[],
  resource?: string,
  excludeResources?: string[]
): string[] {
  if (!resource && (!excludeResources || excludeResources.length === 0)) {
    return urls;
  }

  return urls.filter(url => {
    // If resource is specified and URL doesn't match that resource
    if (resource && !matchesResource(url, resource)) {
      return false;
    }

    // If exclude resources are specified and URL matches any of the excluded resources
    if (excludeResources && matchesExcludeResources(url, excludeResources)) {
      return false;
    }

    return true;
  });
}
