import type { DtoGetUserData, GetUserOutput } from "../dtos/get-init-user.dto";

export const mockInitialData: DtoGetUserData = {
	agency: {
		id: "370a5c02-c06b-4646-9a4b-1f2033e1a5cc",
		name: "Bewe Smbs",
		logo: "https://static.dezeen.com/uploads/2025/05/sq-google-g-logo-update_dezeen_2364_col_0-852x852.jpg",
		configuration: {
			primaryColor: ["blue"],
			secondaryColor: ["purple"],
		},
	},
	user: {
		id: "user-123456789",
		isAdmin: true,
		roles: ["admin"],
		name: "John Doe",
		imageProfile: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
		email: "john.doe@example.com",
		language: "es",
		theme: "light",
		phones: [],
		platformType: "agency",
	},
	subscription: {
		id: "subscription-123",
		plan: "pro",
		status: "active",
		endDate: "2025-01-01",
	},
	// news: [
	// 	{
	// 		title: "Upgrade to Pro 🚀",
	// 		description:
	// 			"Get 1 month free and unlock all the features of the pro plan.",
	// 		action: {
	// 			type: "redirect",
	// 			value: "/new-feature-page",
	// 			label: "Upgrade",
	// 		},
	// 	},
	// ], ///TODO V2
	permissions: [{ contact: ["create", "update"] }, { company: ["read"] }],
	group: [
		{
			name: "menu_group_overview",
			modules: [
				{
					id: "chatbot",
					name: "menu_chatbot",
					icon: "solar:chat-round-call-outline",
					type: "module",
					order: 1,
					labels: [
						{
							id: "ai",
							title: "AI",
							color: "primary",
						},
					],
					enabled: true,
					resources: [],
					children: [],
				},
				{
					id: "social-networks",
					name: "menu_social_networks",
					icon: "solar:magic-stick-3-outline",
					type: "module",
					order: 2,
					labels: [
						{
							id: "ai",
							title: "AI",
							color: "primary",
						},
					],
					enabled: true,
					resources: [],
					children: [],
				},
				{
					id: "campaigns",
					name: "menu_campaigns",
					icon: "solar:chat-round-dots-outline",
					type: "module",
					order: 3,
					labels: [
						{
							id: "ai",
							title: "AI",
							color: "primary",
						},
					],
					enabled: true,
					resources: [],
					children: [],
				},
			],
		},
		{
			name: "menu_manage_your_business",
			modules: [
				{
					id: "automatic-notifications",
					name: "menu_automatic_notifications",
					icon: "solar:bell-bing-outline",
					type: "module",
					order: 0,
					labels: [],
					enabled: true,
					resources: [],
					children: [],
				},
				{
					id: "clients",
					name: "menu_clients",
					icon: "solar:users-group-rounded-outline",
					type: "module",
					order: 1,
					labels: [
						// {
						// 	id: "new",
						// 	title: "New",
						// 	color: "primary",
						// },
					],
					enabled: true,
					resources: [],
					children: [],
				},
				{
					id: "catalog",
					name: "menu_catalog",
					icon: "solar:box-outline",
					type: "module",
					order: 2,
					labels: [],
					enabled: true,
					resources: [],
					children: [
						{
							id: "catalog-products",
							name: "menu_catalog_products",
							type: "item",
							order: 1,
							labels: [],
							enabled: true,
							resources: [],
						},
						{
							id: "catalog-services",
							name: "menu_catalog_services",
							type: "item",
							order: 2,
							labels: [],
							enabled: true,
							resources: [],
						},
					],
				},
				{
					id: "intelligent-tags",
					name: "menu_smart_labels",
					icon: "solar:tag-outline",
					type: "module",
					order: 4,
					labels: [
						{
							id: "ai",
							title: "AI",
							color: "primary",
						},
					],
					enabled: true,
					resources: [],
					children: [],
				},
				{
					id: "integrations",
					name: "Integraciones",
					icon: "solar:link-minimalistic-2-outline",
					type: "module",
					order: 3,
					labels: [],
					enabled: true,
					resources: [],
					children: [],
				},
				{
					id: "pricing",
					name: "Pricing",
					icon: "solar:dollar-minimalistic-outline",
					type: "module",
					order: 4,
					labels: [
						{
							id: "ai",
							title: "AI",
							color: "primary",
						},
					],
					enabled: true,
					resources: [],
					children: [],
				},
				{
					id: "dashboard",
					name: "menu_dashboard",
					icon: "solar:chart-outline",
					type: "module",
					order: 5,
					labels: [],
					enabled: true,
					resources: [],
				},
			],
		},
		{
			name: "menu_group_integrations",
			modules: [
				{
					id: "integrations",
					name: "menu_integrations",
					icon: "solar:link-minimalistic-2-outline",
					type: "module",
					order: 0,
					labels: [],
					enabled: true,
					resources: [],
					children: [],
				},
			],
		},
		{
			name: "menu_group_coming_soon",
			modules: [
				{
					id: "agenda",
					name: "menu_agenda",
					icon: "solar:calendar-outline",
					type: "module",
					order: 0,
					labels: [],
					enabled: true,
					resources: [],
					children: [],
				},
			],
		},
	],
};

export const mockInitialDataResponse: GetUserOutput = {
	success: true,
	message: "Initial data fetched successfully",
	data: mockInitialData,
	timestamp: new Date().toISOString(),
};
