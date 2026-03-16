import type { IProposedCampaign } from '@campaigns/domain';
import { EnumCampaignContentType } from '@campaigns/domain';

/**
 * Mock data para campañas propuestas por Linda
 */
export const mockProposedCampaigns: IProposedCampaign[] = [
  {
    id: 'proposed-1',
    proposalId: 'prop-001',
    companyId: 'company-123',
    title: 'Promoción Especial Bodas de Primavera',
    description: 'Campaña dirigida a parejas que se casarán en primavera, ofreciendo paquetes con descuento',
    suggestedText: '💍✨ ¡Haz que tu boda de primavera sea inolvidable!\n\n🌸 Paquetes especiales con hasta 20% de descuento:\n✅ Decoración floral premium\n✅ DJ y sonido profesional\n✅ Iluminación ambiente\n✅ Coordinador del día\n\n🎁 Reserva antes del 31 de marzo y recibe un servicio de fotografía GRATIS\n\n📅 Fechas limitadas disponibles\n💬 Responde "INTERESADO" para más información',
    contentType: EnumCampaignContentType.WHATSAPP,
    targetAudienceCount: 45,
    audienceReason: 'Parejas comprometidas que planean casarse en los próximos 6 meses y han mostrado interés en servicios de eventos',
    requiredTags: ['Boda', 'Comprometido', 'Primavera'],
    evaluationScore: 92,
    scoringBreakdown: {
      relevance: 95,
      timing: 90,
      engagement: 88,
      conversion: 95
    },
    evaluationRationale: 'Alta probabilidad de conversión debido a la temporada y el perfil de los destinatarios. El descuento por tiempo limitado genera urgencia.',
    priority: 1,
    suggestedDate: new Date('2024-03-15'),
    expiresAt: new Date('2024-04-01'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: 'proposed-2',
    proposalId: 'prop-002',
    companyId: 'company-123',
    title: 'Eventos Corporativos con Streaming',
    description: 'Solución híbrida para empresas con equipos remotos',
    suggestedText: '🏢📹 ¿Tu empresa tiene equipos remotos?\n\n💼 Ofrecemos soluciones híbridas para eventos corporativos:\n📡 Streaming HD profesional\n🎥 Múltiples cámaras\n🎤 Sonido de alta calidad\n💬 Interacción en tiempo real\n📊 Grabación incluida\n\n🌐 Conecta a todo tu equipo sin importar donde estén\n\n✨ Soporte técnico completo\n🎯 Precios especiales para empresas\n\n💬 Responde "QUIERO INFO" para cotizar',
    contentType: EnumCampaignContentType.WHATSAPP,
    targetAudienceCount: 28,
    audienceReason: 'Empresas que han contratado servicios en el pasado y tienen equipos distribuidos geográficamente',
    requiredTags: ['Empresa', 'Corporativo', 'Trabajo Remoto'],
    evaluationScore: 88,
    scoringBreakdown: {
      relevance: 90,
      timing: 85,
      engagement: 88,
      conversion: 90
    },
    evaluationRationale: 'Tendencia creciente de trabajo híbrido hace que esta oferta sea muy relevante. Audiencia calificada.',
    priority: 2,
    suggestedDate: new Date('2024-03-18'),
    expiresAt: new Date('2024-04-15'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: 'proposed-3',
    proposalId: 'prop-003',
    companyId: 'company-123',
    title: 'Paquetes XV Años Temporada Alta',
    description: 'Campaña para familias con hijas próximas a cumplir 15 años',
    suggestedText: '👑💜 ¡Sus XV años serán mágicos!\n\n🎉 Paquetes exclusivos disponibles:\n✨ BÁSICO: $25,000\n  • Salón decorado\n  • DJ 4 horas\n  • Mesa dulces\n\n💎 PREMIUM: $45,000\n  • Todo lo del básico +\n  • Iluminación especial\n  • Fotografía profesional\n  • Video highlight\n\n👸 ELITE: $70,000\n  • Todo lo del premium +\n  • Coreografía vals\n  • Ambientación temática\n  • Album digital\n\n🎁 Aparta tu fecha HOY y obtén 15% descuento\n\n📅 Solo 3 fechas disponibles en mayo\n💬 Responde "QUIERO COTIZAR" para personalizar tu paquete',
    contentType: EnumCampaignContentType.WHATSAPP,
    targetAudienceCount: 32,
    audienceReason: 'Familias con hijas entre 13-15 años que han asistido a eventos similares o han consultado sobre servicios de XV años',
    requiredTags: ['XV Años', 'Familia', 'Adolescente'],
    evaluationScore: 90,
    scoringBreakdown: {
      relevance: 93,
      timing: 92,
      engagement: 85,
      conversion: 90
    },
    evaluationRationale: 'Momento perfecto para planificar XV años. Familias identificadas tienen alta capacidad de pago y necesidad inminente.',
    priority: 1,
    suggestedDate: new Date('2024-03-20'),
    expiresAt: new Date('2024-04-10'),
    createdAt: new Date('2024-03-11'),
    updatedAt: new Date('2024-03-11')
  },
  {
    id: 'proposed-4',
    proposalId: 'prop-004',
    companyId: 'company-123',
    title: 'After Office Empresarial',
    description: 'Eventos casuales para empresas que buscan integración de equipos',
    suggestedText: '🎊🍹 ¡Celebra con tu equipo!\n\n🏢 Organizamos After Office inolvidables:\n🎵 DJ y música ambiental\n🍴 Catering incluido\n🎮 Actividades de team building\n📸 Fotomatón profesional\n🎁 Decoración personalizada\n\n💼 Ideal para:\n✅ Celebrar logros del equipo\n✅ Integración de nuevos colaboradores\n✅ Cierre de proyectos exitosos\n✅ Reconocimiento trimestral\n\n🌟 Paquetes desde $15,000 para 30 personas\n\n📅 Disponibilidad viernes y sábados\n💬 Responde "COTIZACIÓN" para tu fecha',
    contentType: EnumCampaignContentType.WHATSAPP,
    targetAudienceCount: 18,
    audienceReason: 'Empresas medianas y grandes que han mostrado interés en actividades de integración de equipos',
    requiredTags: ['Empresa', 'Team Building', 'After Office'],
    evaluationScore: 85,
    scoringBreakdown: {
      relevance: 88,
      timing: 80,
      engagement: 85,
      conversion: 87
    },
    evaluationRationale: 'Las empresas buscan constantemente opciones para integrar equipos. Buena oportunidad con audiencia corporativa.',
    priority: 3,
    suggestedDate: new Date('2024-03-22'),
    expiresAt: new Date('2024-04-22'),
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-03-12')
  },
  {
    id: 'proposed-5',
    proposalId: 'prop-005',
    companyId: 'company-123',
    title: 'Graduaciones Universitarias Premium',
    description: 'Paquetes para graduaciones universitarias con servicios completos',
    suggestedText: '🎓✨ ¡Celebra tu graduación con estilo!\n\n🎉 Paquetes exclusivos para graduaciones:\n📚 GRADUADO: $35,000\n  • Salón hasta 80 personas\n  • Buffet completo\n  • DJ 5 horas\n  • Decoración elegante\n\n🏆 SUMMA: $55,000\n  • Todo lo del graduado +\n  • Open bar\n  • Iluminación profesional\n  • Fotógrafo 4 horas\n  • Video recap\n\n👨‍🎓 Grupos de graduación: Descuentos especiales\n🎊 Incluye área lounge para fotos\n\n📅 Reserva tu fecha de graduación\n💬 Responde "MI GRADUACIÓN" para más detalles',
    contentType: EnumCampaignContentType.WHATSAPP,
    targetAudienceCount: 25,
    audienceReason: 'Estudiantes universitarios en último semestre y sus familias que han mostrado interés en eventos de celebración',
    requiredTags: ['Graduación', 'Universidad', 'Estudiante'],
    evaluationScore: 87,
    scoringBreakdown: {
      relevance: 90,
      timing: 88,
      engagement: 82,
      conversion: 88
    },
    evaluationRationale: 'Temporada de graduaciones genera demanda constante. Familias dispuestas a invertir en este evento especial.',
    priority: 2,
    suggestedDate: new Date('2024-03-25'),
    expiresAt: new Date('2024-05-30'),
    createdAt: new Date('2024-03-13'),
    updatedAt: new Date('2024-03-13')
  },
  {
    id: 'proposed-6',
    proposalId: 'prop-006',
    companyId: 'company-123',
    title: 'Baby Shower Temático',
    description: 'Paquetes personalizados para celebrar la llegada del bebé',
    suggestedText: '👶💙💗 ¡Celebra la llegada de tu bebé!\n\n🎀 Baby Shower mágicos y personalizados:\n🎨 Temáticas disponibles:\n  • Safari\n  • Nubes y estrellas\n  • Bosque encantado\n  • Marinero\n  • Princess/Prince\n\n✨ Incluye:\n🎈 Decoración completa\n🍰 Mesa dulces personalizada\n🎁 Juegos y actividades\n📸 Área de fotos instagrameable\n🎵 Música ambiental\n\n💝 Paquetes desde $18,000\n\n🌟 Diseño 100% personalizado\n📅 Disponible fines de semana\n\n💬 Responde "BABY SHOWER" para cotizar',
    contentType: EnumCampaignContentType.WHATSAPP,
    targetAudienceCount: 22,
    audienceReason: 'Parejas embarazadas y familias que han consultado sobre eventos de celebración infantil',
    requiredTags: ['Baby Shower', 'Embarazo', 'Familia'],
    evaluationScore: 86,
    scoringBreakdown: {
      relevance: 88,
      timing: 85,
      engagement: 84,
      conversion: 87
    },
    evaluationRationale: 'Los baby showers son eventos con alta demanda. Audiencia identificada muestra interés activo en planificación.',
    priority: 3,
    suggestedDate: new Date('2024-03-28'),
    expiresAt: new Date('2024-05-15'),
    createdAt: new Date('2024-03-14'),
    updatedAt: new Date('2024-03-14')
  },
  {
    id: 'proposed-7',
    proposalId: 'prop-007',
    companyId: 'company-123',
    title: 'Aniversario Empresarial',
    description: 'Celebración de aniversarios corporativos con clientes e invitados',
    suggestedText: '🎊🏢 ¡Celebra el éxito de tu empresa!\n\n🥂 Eventos de aniversario empresarial:\n🌟 Servicios incluidos:\n  • Venue exclusivo\n  • Catering gourmet\n  • Show en vivo\n  • Iluminación espectacular\n  • Pantallas LED\n  • Fotografía y video profesional\n  • Valet parking\n\n💼 Ideal para:\n✅ Aniversarios empresariales\n✅ Lanzamientos de producto\n✅ Premiaciones\n✅ Eventos de networking\n\n🎯 Hasta 200 invitados\n💎 Paquetes desde $80,000\n\n📅 Planificación completa incluida\n💬 Responde "ANIVERSARIO" para agendar una cita',
    contentType: EnumCampaignContentType.WHATSAPP,
    targetAudienceCount: 12,
    audienceReason: 'Empresas establecidas que próximamente celebran aniversarios o han realizado eventos corporativos de gran escala',
    requiredTags: ['Empresa', 'Aniversario', 'Corporativo', 'Premium'],
    evaluationScore: 84,
    scoringBreakdown: {
      relevance: 86,
      timing: 82,
      engagement: 83,
      conversion: 85
    },
    evaluationRationale: 'Eventos de alto valor con audiencia corporativa selecta. Menor volumen pero mayor ticket promedio.',
    priority: 2,
    suggestedDate: new Date('2024-04-01'),
    expiresAt: new Date('2024-06-30'),
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15')
  }
];
