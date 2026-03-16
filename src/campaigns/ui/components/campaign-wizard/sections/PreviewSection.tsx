/**
 * Preview Section
 * Shows preview of the campaign (WhatsApp or Email)
 */

import { H4, P, Card, Image, WhatsAppPreview } from "@beweco/aurora-ui";

interface PreviewSectionProps {
  selectedContentType: string;
  generatedImage: string;
  generatedCaption: string;
  ctaType: string;
  ctaValue: string;
  ctaLabel?: string;
}

export function PreviewSection({
  selectedContentType,
  generatedImage,
  generatedCaption,
  ctaType,
  ctaValue,
  ctaLabel,
}: PreviewSectionProps) {
  return (
    <Card className="p-3 lg:p-4 border border-gray-200 lg:sticky lg:top-4">
      <div className="space-y-3">
        <H4 className="text-center text-base">Vista Previa</H4>
        
        <div className="flex justify-center">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-[360px]">
            {/* WhatsApp Preview */}
            {selectedContentType === 'whatsapp' ? (
              <WhatsAppPreview
                imageUrl={generatedImage}
                caption={generatedCaption}
                variant="full"
                showHeader={true}
                ctaType={ctaType}
                ctaLabel={ctaLabel}
                ctaValue={ctaValue}
              />
            ) : (
              // Email Preview
              <div className="flex flex-col bg-white h-full overflow-y-auto" style={{ height: '640px' }}>
                {/* Email Header */}
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">TN</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">Tu Negocio</span>
                        <span className="text-xs text-gray-500">a</span>
                        <span className="text-xs text-gray-600">cliente@email.com</span>
                      </div>
                      <p className="text-xs text-gray-500">hace unos momentos</p>
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="p-6">
                  {/* Image if exists */}
                  {generatedImage && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <Image
                        src={generatedImage}
                        alt="Campaign preview"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}

                  {/* Email Content */}
                  <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
                    {generatedCaption}
                  </div>

                  {/* Email Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      © {new Date().getFullYear()} Tu Negocio. Todos los derechos reservados.
                    </p>
                    <p className="text-xs text-gray-400 text-center mt-2">
                      <a href="#" className="hover:text-gray-600 underline">Darse de baja</a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="pt-4 border-t">
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <div className="flex items-center gap-2">
              <P className="text-xs font-medium text-gray-600">Canal:</P>
              <P className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                {selectedContentType === 'whatsapp' ? 'WhatsApp' : 'Email'}
              </P>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
