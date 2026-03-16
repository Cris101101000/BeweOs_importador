import type { SocialMediaCarouselItem } from '@shared/ui/components';

/**
 * Mock data para items del carousel de campañas propuestas
 * Estos son contenidos generados por Linda para mostrar en el carousel 3D
 */
export const mockCarouselCampaigns: SocialMediaCarouselItem[] = [
  {
    id: 'carousel-campaign-1',
    title: 'Paquetes Quinceañeras 2024',
    caption: '🆕 ¡Nuevos paquetes para quinceañeras!\n\n👑 Paquetes disponibles:\n✓ Básico: $25,000\n  • Salón decorado\n  • DJ 4 horas\n  • Mesa dulces\n\n✓ Premium: $45,000\n  • Todo lo anterior +\n  • Fotografía profesional\n  • Video highlight\n\n✓ Elite: $70,000\n  • Todo lo anterior +\n  • Coreografía vals\n  • Ambientación temática\n\n🎁 Aparta tu fecha HOY y obtén 15% descuento\n\nPregunta por nuestros paquetes 💜',
    imageUrl: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=400&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #fda4af 0%, #fb7185 100%)',
    type: 'whatsapp',
    targetAudienceCount: 32,
    audienceReason: 'Familias con hijas entre 13-15 años que han asistido a eventos similares o consultado sobre XV años',
    requiredTags: ['XV Años', 'Familia', 'Adolescente']
  },
  {
    id: 'carousel-campaign-2',
    title: 'Bodas de Primavera Premium',
    caption: '💍✨ ¡Haz que tu boda de primavera sea inolvidable!\n\n🌸 Paquetes especiales con hasta 20% de descuento:\n✅ Decoración floral premium\n✅ DJ y sonido profesional\n✅ Iluminación ambiente\n✅ Coordinador del día\n✅ Fotografía y video\n\n🎁 Reserva antes del 31 de marzo y recibe:\n• Sesión de fotos pre-boda GRATIS\n• Decoración ceremonia incluida\n• 2 horas extras de fiesta\n\n📅 Fechas limitadas disponibles para primavera\n💬 Responde "INTERESADO" para más información',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #f0abfc 0%, #e879f9 100%)',
    type: 'whatsapp',
    targetAudienceCount: 45,
    audienceReason: 'Parejas comprometidas que planean casarse en los próximos 6 meses y han mostrado interés en servicios de eventos',
    requiredTags: ['Boda', 'Comprometido', 'Primavera']
  },
  {
    id: 'carousel-campaign-3',
    title: 'Eventos Corporativos Híbridos',
    caption: '🏢📹 ¿Tu empresa tiene equipos remotos?\n\n💼 Ofrecemos soluciones híbridas para eventos corporativos:\n📡 Streaming HD profesional\n🎥 Múltiples cámaras\n🎤 Sonido de alta calidad\n💬 Interacción en tiempo real\n📊 Grabación y post-producción incluida\n🎯 Soporte técnico 24/7\n\n🌐 Conecta a todo tu equipo sin importar donde estén\n\n✨ Eventos híbridos que funcionan:\n• Conferencias\n• Capacitaciones\n• Town halls\n• Lanzamientos de producto\n\n🎁 Precios especiales para empresas\n💬 Responde "QUIERO INFO" para cotizar',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)',
    type: 'whatsapp',
    targetAudienceCount: 28,
    audienceReason: 'Empresas que han contratado servicios en el pasado y tienen equipos distribuidos geográficamente',
    requiredTags: ['Empresa', 'Corporativo', 'Trabajo Remoto', 'Streaming']
  },
  {
    id: 'carousel-campaign-4',
    title: 'Graduaciones Universitarias',
    caption: '🎓✨ ¡Celebra tu graduación con estilo!\n\n🎉 Paquetes exclusivos para graduaciones:\n\n📚 GRADUADO: $35,000\n  • Salón hasta 80 personas\n  • Buffet completo\n  • DJ 5 horas\n  • Decoración elegante\n\n🏆 SUMMA: $55,000\n  • Todo lo del graduado +\n  • Open bar premium\n  • Iluminación profesional\n  • Fotógrafo 4 horas\n  • Video recap del evento\n\n👨‍🎓 Grupos de graduación: Descuentos especiales para reservas grupales\n\n🎊 Incluye área lounge para fotos profesionales\n\n📅 Reserva tu fecha de graduación\n💬 Responde "MI GRADUACIÓN" para más detalles',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    type: 'whatsapp',
    targetAudienceCount: 25,
    audienceReason: 'Estudiantes universitarios en último semestre y sus familias que han mostrado interés en eventos de celebración',
    requiredTags: ['Graduación', 'Universidad', 'Estudiante']
  },
  {
    id: 'carousel-campaign-5',
    title: 'Baby Shower Temáticos',
    caption: '👶💙💗 ¡Celebra la llegada de tu bebé de forma mágica!\n\n🎀 Baby Shower 100% personalizados\n\n🎨 Temáticas disponibles:\n  • Safari aventura 🦁\n  • Nubes y estrellas ⭐\n  • Bosque encantado 🌲\n  • Marinero ⚓\n  • Princess/Prince 👑\n  • Peter Pan 🧚\n\n✨ Todo incluido:\n🎈 Decoración completa temática\n🍰 Mesa dulces personalizada\n🎁 Juegos y actividades\n📸 Área de fotos instagrameable\n🎵 Música ambiental\n🎪 Animación (opcional)\n\n💝 Paquetes desde $18,000\n🌟 Diseño 100% personalizado con tus colores\n📅 Disponible fines de semana\n\n💬 Responde "BABY SHOWER" para cotizar tu evento soñado',
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)',
    type: 'whatsapp',
    targetAudienceCount: 22,
    audienceReason: 'Parejas embarazadas y familias que han consultado sobre eventos de celebración infantil',
    requiredTags: ['Baby Shower', 'Embarazo', 'Familia']
  },
  {
    id: 'carousel-campaign-6',
    title: 'After Office Empresarial',
    caption: '🎊🍹 ¡Celebra con tu equipo de manera diferente!\n\n🏢 Organizamos After Office inolvidables:\n\n💼 Servicios incluidos:\n🎵 DJ y música ambiental\n🍴 Catering de calidad\n🎮 Actividades de team building\n📸 Fotomatón profesional\n🎁 Decoración personalizada con branding\n🏆 Área de premiaciones\n🍻 Barra de bebidas\n\n✨ Ideal para:\n✅ Celebrar logros del equipo\n✅ Integración de nuevos colaboradores\n✅ Cierre de proyectos exitosos\n✅ Reconocimiento trimestral\n✅ Celebraciones corporativas\n\n🌟 Paquetes desde $15,000 para 30 personas\n📅 Disponibilidad viernes y sábados\n🎯 Cotizaciones para grupos grandes\n\n💬 Responde "COTIZACIÓN" para tu fecha',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)',
    type: 'whatsapp',
    targetAudienceCount: 18,
    audienceReason: 'Empresas medianas y grandes que han mostrado interés en actividades de integración de equipos',
    requiredTags: ['Empresa', 'Team Building', 'After Office']
  }
];

