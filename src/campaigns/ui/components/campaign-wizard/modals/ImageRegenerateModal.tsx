/**
 * Image Regenerate Modal
 * Loading modal shown during AI image generation
 */

import { H4, P, Modal, ModalContent, ModalBody, IconComponent } from "@beweco/aurora-ui";

interface ImageRegenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  regenerateType: 'create' | 'edit';
  loadingMessageIndex: number;
}

const createLoadingMessages = [
  "Analizando tus instrucciones...",
  "Linda está pensando en el diseño perfecto...",
  "Generando composición visual...",
  "Aplicando estilos y colores...",
  "Refinando los detalles de la imagen...",
  "Optimizando la calidad...",
  "Agregando los toques finales...",
  "¡Casi listo! Preparando tu imagen..."
];

const editLoadingMessages = [
  "Analizando la imagen actual...",
  "Procesando tus cambios...",
  "Linda está aplicando las modificaciones...",
  "Ajustando colores y tonos...",
  "Refinando los detalles...",
  "Mejorando la composición...",
  "Optimizando el resultado...",
  "¡Casi listo! Finalizando edición..."
];

export function ImageRegenerateModal({
  isOpen,
  onClose,
  regenerateType,
  loadingMessageIndex,
}: ImageRegenerateModalProps) {
  const messages = regenerateType === 'create' ? createLoadingMessages : editLoadingMessages;
  const currentMessage = messages[loadingMessageIndex] || messages[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      placement="center"
    >
      <ModalContent>
        <ModalBody className="py-10 px-8">
          <div className="flex flex-col items-center gap-6">
            {/* Animated Icon */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-lg">
                <IconComponent 
                  icon="solar:magic-stick-bold" 
                  className="text-primary-600 text-4xl animate-pulse" 
                />
              </div>
              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
            </div>
            
            {/* Text Content */}
            <div className="text-center space-y-3">
              <H4 className="text-default-900">
                {regenerateType === 'create' ? 'Creando tu imagen' : 'Editando tu imagen'}
              </H4>
              
              {/* Dynamic loading message with typewriter animation */}
              <div className="min-h-[48px] flex items-center justify-center overflow-hidden">
                <P 
                  key={loadingMessageIndex}
                  className="text-primary-600 font-medium text-sm"
                  style={{
                    animation: 'fadeSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                  }}
                >
                  {currentMessage.split('').map((char, index) => (
                    <span 
                      key={index}
                      style={{
                        opacity: 0,
                        animation: `typewriter 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) forwards`,
                        animationDelay: `${index * 45}ms`
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </P>
              </div>

              {/* Loading dots */}
              <div className="flex gap-2 justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2.5 h-2.5 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>

              <P className="text-default-400 text-xs">
                Este proceso puede tardar hasta 5 segundos
              </P>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
