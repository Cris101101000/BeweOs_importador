/**
 * Array manipulation utilities for common operations
 *
 * These utilities provide reusable functions for common array operations
 * like toggling elements, adding/removing items, etc.
 */

/**
 * Generic function to toggle an element in an array
 *
 * @param array - The array to modify
 * @param item - The item to toggle (add if not present, remove if present)
 * @param compareFn - Optional comparison function for complex objects (default: strict equality)
 * @returns New array with the item toggled
 *
 * @example
 * ```typescript
 * // Simple string/number arrays
 * const tags = ["tag1", "tag2"];
 * const newTags = toggleArrayItem(tags, "tag3"); // ["tag1", "tag2", "tag3"]
 * const removedTags = toggleArrayItem(newTags, "tag1"); // ["tag2", "tag3"]
 *
 * // Complex objects with custom comparison
 * const users = [{ id: 1, name: "John" }, { id: 2, name: "Jane" }];
 * const newUsers = toggleArrayItem(
 *   users,
 *   { id: 3, name: "Bob" },
 *   (a, b) => a.id === b.id
 * );
 * ```
 */
export const toggleArrayItem = <T>(
	array: T[],
	item: T,
	compareFn: (a: T, b: T) => boolean = (a, b) => a === b
): T[] => {
	const index = array.findIndex((existingItem) =>
		compareFn(existingItem, item)
	);

	if (index >= 0) {
		// Item exists, remove it
		return array.filter((_, i) => i !== index);
	}

	// Item doesn't exist, add it
	return [...array, item];
};

/**
 * Adds an item to an array if it doesn't already exist
 *
 * @param array - The array to modify
 * @param item - The item to add
 * @param compareFn - Optional comparison function for complex objects (default: strict equality)
 * @returns New array with the item added (or original array if item already exists)
 *
 * @example
 * ```typescript
 * const tags = ["tag1", "tag2"];
 * const newTags = addArrayItem(tags, "tag3"); // ["tag1", "tag2", "tag3"]
 * const sameTags = addArrayItem(newTags, "tag1"); // ["tag1", "tag2", "tag3"] (no change)
 * ```
 */
export const addArrayItem = <T>(
	array: T[],
	item: T,
	compareFn: (a: T, b: T) => boolean = (a, b) => a === b
): T[] => {
	const exists = array.some((existingItem) => compareFn(existingItem, item));
	return exists ? array : [...array, item];
};

/**
 * Removes an item from an array
 *
 * @param array - The array to modify
 * @param item - The item to remove
 * @param compareFn - Optional comparison function for complex objects (default: strict equality)
 * @returns New array with the item removed
 *
 * @example
 * ```typescript
 * const tags = ["tag1", "tag2", "tag3"];
 * const newTags = removeArrayItem(tags, "tag2"); // ["tag1", "tag3"]
 * ```
 */
export const removeArrayItem = <T>(
	array: T[],
	item: T,
	compareFn: (a: T, b: T) => boolean = (a, b) => a === b
): T[] => {
	return array.filter((existingItem) => !compareFn(existingItem, item));
};

/**
 * Removes all items from an array that match the given predicate
 *
 * @param array - The array to modify
 * @param predicate - Function that returns true for items to remove
 * @returns New array with matching items removed
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const evenRemoved = removeArrayItemsWhere(numbers, n => n % 2 === 0); // [1, 3, 5]
 * ```
 */
export const removeArrayItemsWhere = <T>(
	array: T[],
	predicate: (item: T) => boolean
): T[] => {
	return array.filter((item) => !predicate(item));
};

/**
 * Moves an item from one position to another in an array
 *
 * @param array - The array to modify
 * @param fromIndex - The index of the item to move
 * @param toIndex - The target index to move the item to
 * @returns New array with the item moved
 *
 * @example
 * ```typescript
 * const items = ["a", "b", "c", "d"];
 * const reordered = moveArrayItem(items, 1, 3); // ["a", "c", "d", "b"]
 * ```
 */
export const moveArrayItem = <T>(
	array: T[],
	fromIndex: number,
	toIndex: number
): T[] => {
	if (
		fromIndex < 0 ||
		fromIndex >= array.length ||
		toIndex < 0 ||
		toIndex >= array.length
	) {
		return array; // Invalid indices, return original array
	}

	const newArray = [...array];
	const [movedItem] = newArray.splice(fromIndex, 1);
	newArray.splice(toIndex, 0, movedItem);

	return newArray;
};

/**
 * Checks if two arrays have the same items (regardless of order)
 *
 * @param array1 - First array to compare
 * @param array2 - Second array to compare
 * @param compareFn - Optional comparison function for complex objects (default: strict equality)
 * @returns True if arrays contain the same items
 *
 * @example
 * ```typescript
 * const arr1 = ["a", "b", "c"];
 * const arr2 = ["c", "a", "b"];
 * const isSame = arraysEqual(arr1, arr2); // true
 * ```
 */
export const arraysEqual = <T>(
	array1: T[],
	array2: T[],
	compareFn: (a: T, b: T) => boolean = (a, b) => a === b
): boolean => {
	if (array1.length !== array2.length) return false;

	return array1.every((item1) =>
		array2.some((item2) => compareFn(item1, item2))
	);
};
