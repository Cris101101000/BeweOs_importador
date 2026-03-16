/**
 * Edit Image Section
 * Collapsible section for editing or uploading images
 */

import { H4, Card, IconComponent, Button, Image } from "@beweco/aurora-ui";
import { UploadFileComponent } from '@shared/ui/components';

interface EditImageSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  imageEditMode: 'upload' | 'ai';
  onImageEditModeChange: (mode: 'upload' | 'ai') => void;
  generatedImage: string;
  onImageChange: (image: string) => void;
  editPrompt: string;
  onEditPromptChange: (prompt: string) => void;
  onGenerateImage: () => void;
  onEditImage: () => void;
  onImageUpload: (file: File) => void;
  isGenerating: boolean;
}

export function EditImageSection({
  isOpen,
  onToggle,
  imageEditMode,
  onImageEditModeChange,
  generatedImage,
  onImageChange,
  editPrompt,
  onEditPromptChange,
  onGenerateImage,
  onEditImage,
  onImageUpload,
  isGenerating,
}: EditImageSectionProps) {
  return (
    <Card className="shadow-sm">
      {/* Header clickeable */}
      <button
        onClick={onToggle}
        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        type="button"
      >
        <div className="flex items-center gap-2">
          <IconComponent icon="solar:gallery-edit-bold" className="text-lg text-primary-600" />
          <H4 className="text-sm">Editar Imagen</H4>
        </div>
        <IconComponent 
          icon="solar:alt-arrow-down-bold" 
          className={`text-lg text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-800 pt-3">
          
          {/* Mode selector: Upload or Generate with AI */}
          <div className="inline-flex gap-0.5 p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              type="button"
              onClick={() => onImageEditModeChange('upload')}
              className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md font-medium text-xs transition-all duration-200 ${
                imageEditMode === 'upload'
                  ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <IconComponent icon="solar:upload-bold" className="text-sm" />
              <span>Subir</span>
            </button>
            <button
              type="button"
              onClick={() => onImageEditModeChange('ai')}
              className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md font-medium text-xs transition-all duration-200 ${
                imageEditMode === 'ai'
                  ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <IconComponent icon="solar:magic-stick-bold" className="text-sm" />
              <span>Generar con IA</span>
            </button>
          </div>

          {/* Upload Mode */}
          {imageEditMode === 'upload' && (
            <div className="space-y-3 mt-5">
              {/* Upload area - always visible */}
              <div className="relative">
                {generatedImage ? (
                  /* Preview with delete button */
                  <div className="relative w-32 h-32">
                    <div className="w-full h-full rounded-xl overflow-hidden">
                      <Image
                        src={generatedImage}
                        alt="Imagen subida"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Delete button */}
                    <Button
                      isIconOnly
                      size="sm"
                      radius="full"
                      className="absolute -top-2 -right-2 z-10 shadow-md bg-danger-500 text-white min-w-8 w-8 h-8"
                      onPress={() => onImageChange("")}
                      aria-label="Eliminar imagen"
                    >
                      <IconComponent icon="solar:trash-bin-trash-bold" className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : (
                  <UploadFileComponent
                    acceptedFiles="image/*"
                    maxFiles={1}
                    size="large"
                    height={128}
                    text="Arrastra o haz clic para subir"
                    subText="PNG, JPG hasta 10MB"
                    onUpload={(files) => {
                      if (files.length > 0) {
                        onImageUpload(files[0]);
                      }
                    }}
                    onError={(error) => console.error('Upload error:', error)}
                  />
                )}
              </div>
            </div>
          )}

          {/* AI Generation Mode */}
          {imageEditMode === 'ai' && (
            <div className="space-y-3">
              {/* Input with integrated button */}
              <div className={`relative rounded-2xl overflow-hidden border transition-colors ${
                editPrompt.trim() 
                  ? 'bg-white dark:bg-gray-900 border-primary-300 dark:border-primary-600' 
                  : 'bg-default-100 dark:bg-default-50 border-default-200 dark:border-default-100'
              }`}>
                <textarea
                  value={editPrompt}
                  onChange={(e) => onEditPromptChange(e.target.value)}
                  placeholder="Describe la imagen que quieres crear..."
                  className="w-full px-4 pt-4 pb-14 text-sm bg-transparent resize-none focus:outline-none min-h-[100px] text-default-800 dark:text-default-200 placeholder:text-default-400"
                  rows={2}
                />
                
                {/* Buttons in bottom right corner */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onGenerateImage}
                    disabled={!editPrompt.trim() || isGenerating}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-100 text-primary-600 border border-primary-300 hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGenerating ? 'Generando...' : 'Generar nueva'}
                  </button>
                  {generatedImage && (
                    <button
                      type="button"
                      onClick={onEditImage}
                      disabled={!editPrompt.trim() || isGenerating}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Editar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
