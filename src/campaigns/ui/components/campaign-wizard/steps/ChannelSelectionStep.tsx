/**
 * Channel Selection Step (Step 1)
 * User selects the campaign channel (WhatsApp or Email)
 */

import { H3, P, Button, IconComponent } from "@beweco/aurora-ui";

interface ChannelSelectionStepProps {
  selectedContentType: string;
  onSelectContentType: (type: string) => void;
  onNext: () => void;
}

const contentTypes = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Campaña de mensajes de WhatsApp",
    icon: "solar:chat-round-bold",
    color: "from-green-500 to-green-600"
  },
  {
    id: "email",
    name: "Email",
    description: "Campaña de correo electrónico",
    icon: "solar:letter-bold",
    color: "from-blue-500 to-blue-600"
  }
];

export function ChannelSelectionStep({
  selectedContentType,
  onSelectContentType,
  onNext,
}: ChannelSelectionStepProps) {
  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <div className="text-center mb-6">
        <H3>Selecciona el canal de tu campaña</H3>
        <P className="text-center mt-2 text-gray-600">
          Elige el canal por donde enviarás tu campaña de marketing
        </P>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contentTypes.map((type) => (
          <Button
            key={type.id}
            onPress={() => {
              onSelectContentType(type.id);
              onNext(); // Auto-advance to next step
            }}
            variant={selectedContentType === type.id ? "flat" : "bordered"}
            color={selectedContentType === type.id ? "primary" : "default"}
            className="p-8 h-auto"
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r ${type.color}`}>
                <IconComponent icon={type.icon} className="text-white text-[32px]" />
              </div>
              <div className="text-center">
                <H3 className="mb-1">{type.name}</H3>
                <P className="text-xs text-gray-600">{type.description}</P>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
