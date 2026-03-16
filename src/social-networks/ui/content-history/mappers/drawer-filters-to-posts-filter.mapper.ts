import type {
	EnumChannel,
	EnumPostState,
	EnumPostType,
} from "@social-networks/domain";

/**
 * Maps DrawerFilters format to Posts Filter format
 * Handles both string and array values from DrawerFilters component
 *
 * @param drawerFilters - Raw filters from DrawerFilters component
 * @returns Processed filters ready for API
 */
export const mapDrawerFiltersToPostsFilter = (
	drawerFilters: Record<string, any>
): {
	state?: EnumPostState | EnumPostState[];
	channel?: EnumChannel | EnumChannel[];
	postType?: EnumPostType | EnumPostType[];
} => {
	const filters: {
		state?: EnumPostState | EnumPostState[];
		channel?: EnumChannel | EnumChannel[];
		postType?: EnumPostType | EnumPostType[];
	} = {};

	// Map state filter
	if (drawerFilters.state) {
		if (typeof drawerFilters.state === "string") {
			// Single state - keep as string
			filters.state = drawerFilters.state as EnumPostState;
		} else if (Array.isArray(drawerFilters.state)) {
			// Multiple states
			if (drawerFilters.state.length === 1) {
				// Single element array - convert to string
				filters.state = drawerFilters.state[0] as EnumPostState;
			} else if (drawerFilters.state.length > 1) {
				// Multiple elements - keep as array
				filters.state = drawerFilters.state as EnumPostState[];
			}
		}
	}

	// Map channel filter
	if (drawerFilters.channel) {
		if (typeof drawerFilters.channel === "string") {
			// Single channel - keep as string
			filters.channel = drawerFilters.channel as EnumChannel;
		} else if (Array.isArray(drawerFilters.channel)) {
			// Multiple channels
			if (drawerFilters.channel.length === 1) {
				// Single element array - convert to string
				filters.channel = drawerFilters.channel[0] as EnumChannel;
			} else if (drawerFilters.channel.length > 1) {
				// Multiple elements - keep as array
				filters.channel = drawerFilters.channel as EnumChannel[];
			}
		}
	}

	// Map postType filter
	if (drawerFilters.postType) {
		if (typeof drawerFilters.postType === "string") {
			// Single postType - keep as string
			filters.postType = drawerFilters.postType as EnumPostType;
		} else if (Array.isArray(drawerFilters.postType)) {
			// Multiple postTypes
			if (drawerFilters.postType.length === 1) {
				// Single element array - convert to string
				filters.postType = drawerFilters.postType[0] as EnumPostType;
			} else if (drawerFilters.postType.length > 1) {
				// Multiple elements - keep as array
				filters.postType = drawerFilters.postType as EnumPostType[];
			}
		}
	}

	console.log("🔄 Mapper Output:", filters);
	return filters;
};

/**
 * Maps Posts Filter to DrawerFilters format
 * This is used to pre-populate the DrawerFilters with existing filter values
 *
 * @param postsFilters - Posts filters from internal state
 * @returns Record<string, any> - DrawerFilters format (always arrays)
 */
export const mapPostsFilterToDrawerFilters = (postsFilters: {
	state?: EnumPostState | EnumPostState[];
	channel?: EnumChannel | EnumChannel[];
	postType?: EnumPostType | EnumPostType[];
}): Record<string, any> => {
	const drawerFilters: Record<string, any> = {};

	// Map state - DrawerFilters expects arrays for multiselect
	if (postsFilters.state) {
		drawerFilters.state = Array.isArray(postsFilters.state)
			? postsFilters.state
			: [postsFilters.state];
	}

	// Map channel - DrawerFilters expects arrays for multiselect
	if (postsFilters.channel) {
		drawerFilters.channel = Array.isArray(postsFilters.channel)
			? postsFilters.channel
			: [postsFilters.channel];
	}

	// Map postType - DrawerFilters expects arrays for multiselect
	if (postsFilters.postType) {
		drawerFilters.postType = Array.isArray(postsFilters.postType)
			? postsFilters.postType
			: [postsFilters.postType];
	}

	return drawerFilters;
};
