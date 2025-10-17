import { useMemo, useRef } from 'react';
import { generateStableId } from './generateStableId';

/**
 * React Hook: Generate a stable ID that persists across renders
 *
 * This hook ensures that IDs remain consistent between server and client renders,
 * preventing React hydration mismatch errors in SSR environments like Next.js.
 *
 * The ID is generated once during the first render and persists for the lifetime
 * of the component instance.
 *
 * @param prefix - Component or element type prefix
 * @param identifier - Optional unique identifier (accessor, column ID, etc.)
 * @param index - Optional numeric index for lists
 * @returns Stable ID string that persists across renders
 *
 * @example
 * function FilterInput({ columnId }) {
 *   const filterId = useStableId('filter', columnId);
 *   const labelId = useStableId('filter-label', columnId);
 *
 *   return (
 *     <div>
 *       <label id={labelId} htmlFor={filterId}>Filter {columnId}</label>
 *       <input id={filterId} aria-labelledby={labelId} />
 *     </div>
 *   );
 * }
 *
 * @example
 * function RadioGroup({ options }) {
 *   return options.map((option, index) => {
 *     const radioId = useStableId('radio', option.value, index);
 *     return <input key={radioId} id={radioId} type="radio" />;
 *   });
 * }
 */
export function useStableId(
  prefix: string,
  identifier?: string | number,
  index?: number
): string {
  // Use ref to ensure ID is generated only once
  const idRef = useRef<string | null>(null);

  // Generate ID on first render only
  if (idRef.current === null) {
    idRef.current = generateStableId(prefix, identifier, index);
  }

  return idRef.current;
}

/**
 * React Hook: Generate multiple stable IDs with a shared scope
 *
 * Useful for components that need to generate several related IDs
 * (e.g., input, label, description, error message).
 *
 * @param componentName - Name of the component
 * @param instanceId - Optional instance identifier
 * @returns Object containing ID generation functions
 *
 * @example
 * function FormField({ name, label }) {
 *   const ids = useScopedIds('form-field', name);
 *
 *   return (
 *     <div>
 *       <label id={ids.label()} htmlFor={ids.input()}>
 *         {label}
 *       </label>
 *       <input
 *         id={ids.input()}
 *         aria-labelledby={ids.label()}
 *         aria-describedby={ids.description()}
 *       />
 *       <span id={ids.description()}>Help text</span>
 *       {error && <span id={ids.error()}>{error}</span>}
 *     </div>
 *   );
 * }
 */
export function useScopedIds(
  componentName: string,
  instanceId?: string
): {
  generate: (element: string, identifier?: string | number, index?: number) => string;
  input: () => string;
  label: () => string;
  description: () => string;
  error: () => string;
  list: () => string;
} {
  // Create scoped ID generators
  const generateInput = useStableId(`${componentName}-${instanceId}`, 'input');
  const generateLabel = useStableId(`${componentName}-${instanceId}`, 'label');
  const generateDescription = useStableId(`${componentName}-${instanceId}`, 'description');
  const generateError = useStableId(`${componentName}-${instanceId}`, 'error');
  const generateList = useStableId(`${componentName}-${instanceId}`, 'list');

  return useMemo(
    () => ({
      generate: (element: string, identifier?: string | number, index?: number) =>
        generateStableId(`${componentName}-${instanceId}-${element}`, identifier, index),
      input: () => generateInput,
      label: () => generateLabel,
      description: () => generateDescription,
      error: () => generateError,
      list: () => generateList,
    }),
    [componentName, instanceId, generateInput, generateLabel, generateDescription, generateError, generateList]
  );
}
