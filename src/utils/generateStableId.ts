/**
 * Stable ID Generation Utility for SSR Compatibility
 *
 * This utility provides deterministic ID generation that works correctly
 * with Server-Side Rendering (SSR) frameworks like Next.js, avoiding
 * React hydration mismatch errors.
 *
 * @module generateStableId
 */

/**
 * Counter for generating sequential IDs within a session
 * Reset on each server render
 */
let idCounter = 0;

/**
 * Reset the ID counter (useful for testing and server-side rendering)
 */
export function resetIdCounter(): void {
  idCounter = 0;
}

/**
 * Simple hash function for generating deterministic IDs from strings
 * Uses djb2 algorithm - fast and good distribution
 *
 * @param str - String to hash
 * @returns Numeric hash value
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); // hash * 33 + c
  }
  return Math.abs(hash);
}

/**
 * Generate a stable, deterministic ID based on provided parameters
 *
 * This function creates IDs that are:
 * - Stable across server and client renders (SSR compatible)
 * - Unique within the component tree
 * - Human-readable for debugging
 * - Deterministic based on input parameters
 *
 * @param prefix - Component or element type prefix
 * @param identifier - Optional unique identifier (accessor, column ID, etc.)
 * @param index - Optional numeric index for lists
 * @returns Stable ID string
 *
 * @example
 * // Simple usage with prefix only
 * generateStableId('datepicker'); // 'datepicker-1'
 *
 * @example
 * // With column accessor for table cells
 * generateStableId('filter', 'name'); // 'filter-name-2'
 *
 * @example
 * // With numeric index for list items
 * generateStableId('option', 'status', 0); // 'option-status-0-3'
 *
 * @example
 * // Complex identifier with special characters
 * generateStableId('collection', 'user.email'); // 'collection-user-email-4'
 */
export function generateStableId(
  prefix: string,
  identifier?: string | number,
  index?: number
): string {
  const parts: string[] = [prefix];

  // Add identifier if provided
  if (identifier !== undefined && identifier !== null) {
    const identifierStr = String(identifier)
      .replace(/[^a-zA-Z0-9]/g, '-') // Replace special chars with dash
      .replace(/-+/g, '-') // Collapse multiple dashes
      .replace(/^-|-$/g, ''); // Remove leading/trailing dashes

    if (identifierStr) {
      parts.push(identifierStr);
    }
  }

  // Add index if provided
  if (index !== undefined && index !== null) {
    parts.push(String(index));
  }

  // Add sequential counter for uniqueness
  idCounter++;
  parts.push(String(idCounter));

  return parts.join('-');
}

/**
 * Generate a stable ID with hash-based suffix for deterministic uniqueness
 *
 * This variant uses a hash of the inputs instead of a counter,
 * making it fully deterministic across renders.
 *
 * @param prefix - Component or element type prefix
 * @param identifier - Optional unique identifier
 * @param index - Optional numeric index
 * @returns Stable ID string with hash suffix
 *
 * @example
 * generateStableIdWithHash('filter', 'name'); // 'filter-name-a1b2c3'
 */
export function generateStableIdWithHash(
  prefix: string,
  identifier?: string | number,
  index?: number
): string {
  const parts: string[] = [prefix];

  // Build the base ID
  if (identifier !== undefined && identifier !== null) {
    const identifierStr = String(identifier)
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (identifierStr) {
      parts.push(identifierStr);
    }
  }

  if (index !== undefined && index !== null) {
    parts.push(String(index));
  }

  // Generate hash for deterministic suffix
  const hashInput = parts.join('-');
  const hash = hashString(hashInput);
  const hashSuffix = hash.toString(36).substring(0, 6); // Base36 for shorter IDs

  parts.push(hashSuffix);

  return parts.join('-');
}

/**
 * Create a scoped ID generator for a specific component instance
 *
 * Useful for components that need to generate multiple related IDs
 *
 * @param componentName - Name of the component
 * @param instanceId - Optional instance identifier (e.g., viewConfig.id)
 * @returns Function that generates scoped IDs
 *
 * @example
 * const generateId = createScopedIdGenerator('table', 'users-view');
 * generateId('filter'); // 'table-users-view-filter-1'
 * generateId('sort', 'name'); // 'table-users-view-sort-name-2'
 */
export function createScopedIdGenerator(
  componentName: string,
  instanceId?: string
): (element: string, identifier?: string | number, index?: number) => string {
  const sanitizedInstance = instanceId
    ? instanceId
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    : '';

  const scope = sanitizedInstance
    ? `${componentName}-${sanitizedInstance}`
    : componentName;

  return (element: string, identifier?: string | number, index?: number) => {
    return generateStableId(`${scope}-${element}`, identifier, index);
  };
}

/**
 * React Hook: Generate a stable ID that persists across renders
 *
 * This hook should be used in React components to ensure IDs
 * remain stable during the component lifecycle.
 *
 * Note: This is exported separately to avoid React dependency
 * in the utility functions.
 *
 * @param prefix - Component or element type prefix
 * @param identifier - Optional unique identifier
 * @param index - Optional numeric index
 * @returns Stable ID that persists across renders
 *
 * @example
 * function MyComponent({ columnId }) {
 *   const filterId = useStableId('filter', columnId);
 *   return <input id={filterId} />;
 * }
 */
export { useStableId } from './useStableId';
