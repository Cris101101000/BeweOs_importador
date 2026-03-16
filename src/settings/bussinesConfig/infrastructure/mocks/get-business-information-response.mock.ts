import type { GetBusinessInformationResponseDto } from "../dto/get-business-information.dto";

export const getBusinessInformationResponseMock: GetBusinessInformationResponseDto =
	{
		basicInfo: {
			name: "EventosMágicos",
			webDomain: "https://www.eventosmagicos.es/",
		},
		businessInfo: {
			vertical: "Eventos Corporativos y Sociales",
			taxInfo: {
				nit: "A87654321",
			},
			currency: "EUR",
		},
		brandConfig: {
			brandName: "EventosMágicos",
			logo: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop",
			favicon: "https://eventosmagicos.es/favicon.ico",
			description:
				"Agencia especializada en la planificación y ejecución de eventos corporativos, bodas y celebraciones sociales en Madrid.",
			slogan: "Convertimos tus ideas en experiencias inolvidables",
		},
		contactInfo: {
			phones: [
				{
					id: "1",
					code: "+34",
					country: "ES",
					number: "611234567",
					type: "main",
					isVisible: true,
					channels: ["phone", "whatsapp"],
				},
				{
					id: "2",
					code: "+34",
					country: "ES",
					number: "611234567",
					type: "customerService",
					isVisible: true,
					channels: ["phone"],
				},
			],
			emails: [
				{
					id: "1",
					email: "contacto@eventosmagicos.es",
					type: "main",
					isVisible: true,
					createdBy: "user",
				},
			],
			socialNetwork: {
				instagram: "https://www.instagram.com/eventosmagicos/",
				facebook: "https://www.facebook.com/EventosMagicosES/",
				tiktok: "https://www.tiktok.com/@eventosmagicos",
				twitter: "https://www.twitter.com/EventosMagicos",
				linkedin: "https://www.linkedin.com/company/eventosmagicos/",
				youtube: "EventosMagicosTV",
			},
			address: {
				address: "Paseo de la Castellana 150",
				urlGoogleMaps: "https://maps.google.com/eventosmagicos",
				country: "ES",
				city: "Madrid",
				zip: "28046",
			},
		},
		schedules: [
			{
				day: 0,
				timezone: "Europe/Madrid",
				times: [],
				isEnabled: false,
			},
			{
				day: 1,
				timezone: "Europe/Madrid",
				times: [
					{
						start: "09:00",
						end: "19:00",
						isEnabled: true,
					},
				],
				isEnabled: true,
			},
			{
				day: 2,
				timezone: "Europe/Madrid",
				times: [
					{
						start: "09:00",
						end: "19:00",
						isEnabled: true,
					},
				],
				isEnabled: true,
			},
			{
				day: 3,
				timezone: "Europe/Madrid",
				times: [
					{
						start: "09:00",
						end: "19:00",
						isEnabled: true,
					},
				],
				isEnabled: true,
			},
			{
				day: 4,
				timezone: "Europe/Madrid",
				times: [
					{
						start: "09:00",
						end: "19:00",
						isEnabled: true,
					},
				],
				isEnabled: true,
			},
			{
				day: 5,
				timezone: "Europe/Madrid",
				times: [
					{
						start: "09:00",
						end: "19:00",
						isEnabled: true,
					},
				],
				isEnabled: true,
			},
			{
				day: 6,
				timezone: "Europe/Madrid",
				times: [],
				isEnabled: false,
			},
		],
		holidays: [
			{
				startDate: new Date("2025-05-01"),
				title: "Día del Trabajo",
			},
			{
				startDate: new Date("2025-10-12"),
				title: "Fiesta Nacional de España",
			},
		],
	};
