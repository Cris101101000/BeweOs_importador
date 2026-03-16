/**
 * Audience Reach Step (Step 6)
 * Define campaign audience with filters and logic
 */

import {
  H3,
  P,
  Button,
  IconComponent,
  Checkbox,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "@beweco/aurora-ui";
import type { AudienceData, ProposedCampaignState, ReachType } from '../types';

interface AudienceReachStepProps {
  selectedReachType: ReachType;
  onReachTypeChange: (type: ReachType) => void;
  selectedView: string;
  selectedStatuses: string[];
  selectedTags: string[];
  logicOperator: "and" | "or";
  onViewChange: (view: string) => void;
  onStatusesChange: (statuses: string[]) => void;
  onTagsChange: (tags: string[]) => void;
  onLogicOperatorChange: (operator: "and" | "or") => void;
  estimatedReach: number;
  audienceData: AudienceData;
  editState?: ProposedCampaignState;
  onBack: () => void;
  onPublish: () => void;
}

export function AudienceReachStep({
  selectedReachType,
  onReachTypeChange,
  selectedView,
  selectedStatuses,
  selectedTags,
  logicOperator,
  onViewChange,
  onStatusesChange,
  onTagsChange,
  onLogicOperatorChange,
  estimatedReach,
  audienceData,
  editState,
  onBack,
  onPublish,
}: AudienceReachStepProps) {
  const { tags, statuses, savedViews, totalClientsCount } = audienceData;

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <H3>Define el alcance de tu campaña</H3>
        <P className="mt-2 text-default-500">
          Selecciona a qué clientes quieres dirigir esta campaña
        </P>
      </div>

      {/* Reach Options */}
      <div className="space-y-3">
        {/* Option 1: All Clients */}
        <div
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
            selectedReachType === "all"
              ? "border-primary bg-primary-50 dark:bg-primary-950/20"
              : "border-default-200 hover:border-default-300 hover:bg-default-50"
          }`}
          onClick={() => onReachTypeChange("all")}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              isSelected={selectedReachType === "all"}
              onValueChange={() => onReachTypeChange("all")}
              size="sm"
              color="primary"
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <IconComponent icon="solar:users-group-rounded-bold" className="text-lg text-primary" />
                  <p className="font-medium text-foreground">Todos los clientes</p>
                </div>
                <Chip size="sm" variant="flat" color="primary">
                  {totalClientsCount} clientes
                </Chip>
              </div>
              <p className="text-xs text-default-500">
                Enviar la campaña a todos tus clientes registrados en el CRM
              </p>
            </div>
          </div>
        </div>

        {/* Option 2: Saved View */}
        <div
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
            selectedReachType === "saved-view"
              ? "border-primary bg-primary-50 dark:bg-primary-950/20"
              : "border-default-200 hover:border-default-300 hover:bg-default-50"
          }`}
          onClick={() => onReachTypeChange("saved-view")}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              isSelected={selectedReachType === "saved-view"}
              onValueChange={() => onReachTypeChange("saved-view")}
              size="sm"
              color="primary"
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <IconComponent icon="solar:bookmark-bold" className="text-lg text-primary" />
                  <p className="font-medium text-foreground">Vista guardada</p>
                </div>
                {selectedView && (
                  <Chip size="sm" variant="flat" color="primary">
                    Vista seleccionada
                  </Chip>
                )}
              </div>
              <p className="text-xs text-default-500 mb-3">
                Selecciona una de tus vistas pregardadas del CRM
              </p>

              {/* Views Dropdown - Only visible when selected */}
              {selectedReachType === "saved-view" && (
                <div onClick={(e) => e.stopPropagation()}>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button 
                        variant="bordered" 
                        className="w-full justify-between"
                        size="sm"
                        endContent={<IconComponent icon="solar:alt-arrow-down-outline" className="w-4 h-4" />}
                      >
                        {selectedView ? (
                          <span className="text-left flex-1 text-sm">
                            {savedViews.find(v => v.id === selectedView)?.name}
                          </span>
                        ) : (
                          <span className="text-default-400 text-sm">Selecciona una vista</span>
                        )}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu 
                      aria-label="Vistas guardadas"
                      onAction={(key) => onViewChange(key as string)}
                      selectedKeys={selectedView ? new Set([selectedView]) : new Set()}
                      selectionMode="single"
                    >
                      {savedViews.map((view) => (
                        <DropdownItem 
                          key={view.id}
                          description={view.description}
                          startContent={<IconComponent icon="solar:bookmark-outline" />}
                          endContent={
                            <Chip size="sm" variant="flat" color="success">
                              CRM
                            </Chip>
                          }
                        >
                          {view.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Option 3: Custom Logic */}
        <div
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
            selectedReachType === "custom-logic"
              ? "border-primary bg-primary-50 dark:bg-primary-950/20"
              : "border-default-200 hover:border-default-300 hover:bg-default-50"
          }`}
          onClick={() => onReachTypeChange("custom-logic")}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              isSelected={selectedReachType === "custom-logic"}
              onValueChange={() => onReachTypeChange("custom-logic")}
              size="sm"
              color="primary"
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <IconComponent icon="solar:filter-bold" className="text-lg text-primary" />
                  <p className="font-medium text-foreground">Lógica combinada</p>
                </div>
                {selectedReachType === "custom-logic" && estimatedReach > 0 && (
                  <div className="flex items-center gap-2">
                    <Chip size="sm" variant="flat" color="primary">
                      {estimatedReach} clientes
                    </Chip>
                    {editState?.isProposedCampaign && (
                      <Tooltip
                        content={
                          <div className="max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <IconComponent icon="solar:magic-stick-bold" className="text-sm text-purple-600" />
                              <span className="font-semibold text-gray-900">Propuesta de Linda</span>
                            </div>
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center gap-2">
                                <IconComponent icon="solar:users-group-rounded-bold" className="text-sm text-purple-600" />
                                <span className="text-gray-900">
                                  {estimatedReach > 0 ? estimatedReach.toLocaleString('es-ES') : (editState.targetAudienceCount?.toLocaleString('es-ES') || '0')} clientes aplican a esta campaña
                                </span>
                              </div>
                              {editState.audienceReason && (
                                <div className="bg-gray-50 rounded p-2 mt-2 border border-gray-200">
                                  <p className="text-gray-700 text-xs font-semibold mb-1">Razón:</p>
                                  <p className="text-gray-800 text-xs leading-relaxed">
                                    {editState.audienceReason}
                                  </p>
                                </div>
                              )}
                              {editState.requiredTags && editState.requiredTags.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-gray-700 text-xs font-semibold mb-1">Tags requeridos:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {editState.requiredTags.map((tag, idx) => (
                                      <span 
                                        key={idx}
                                        className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-300"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        }
                        placement="top"
                        showArrow
                        closeDelay={0}
                      >
                        <Chip 
                          size="sm" 
                          variant="flat" 
                          color="secondary"
                          className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 cursor-help"
                        >
                          <div className="flex items-center gap-1">
                            <IconComponent icon="solar:magic-stick-bold" className="text-sm" />
                            <span>Propuesto por Linda</span>
                          </div>
                        </Chip>
                      </Tooltip>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-default-500 mb-3">
                Crea reglas personalizadas con estados y etiquetas
              </p>

              {/* Custom Logic Area - Only visible when selected */}
              {selectedReachType === "custom-logic" && (
                <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                  {/* Logic Operator */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-default-600">Los clientes deben cumplir:</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={logicOperator === "or" ? "solid" : "flat"}
                        color={logicOperator === "or" ? "primary" : "default"}
                        onPress={() => onLogicOperatorChange("or")}
                        className="h-7 px-3 min-w-0"
                      >
                        <span className="text-xs">Cualquiera (O)</span>
                      </Button>
                      <Button
                        size="sm"
                        variant={logicOperator === "and" ? "solid" : "flat"}
                        color={logicOperator === "and" ? "primary" : "default"}
                        onPress={() => onLogicOperatorChange("and")}
                        className="h-7 px-3 min-w-0"
                      >
                        <span className="text-xs">Todas (Y)</span>
                      </Button>
                    </div>
                  </div>

                  {/* Statuses */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-default-700 flex items-center gap-1">
                      <IconComponent icon="solar:shield-check-bold" className="text-sm" />
                      Estados
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {statuses.map((status) => {
                        const isSelected = selectedStatuses.includes(status.value);
                        return (
                          <div
                            key={status.value}
                            className={`${
                              isSelected ? status.color : "bg-default-50"
                            } py-2 px-3 rounded-lg flex items-center gap-2 transition-colors`}
                          >
                            <Checkbox
                              isSelected={isSelected}
                              onValueChange={() => {
                                const newStatuses = selectedStatuses.includes(status.value)
                                  ? selectedStatuses.filter(s => s !== status.value)
                                  : [...selectedStatuses, status.value];
                                onStatusesChange(newStatuses);
                              }}
                              size="sm"
                              color="primary"
                              classNames={{
                                wrapper: "bg-white",
                              }}
                            />
                            <span className="text-xs font-medium">{status.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-default-700 flex items-center gap-1">
                      <IconComponent icon="solar:tag-bold" className="text-sm" />
                      Etiquetas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => {
                        const isSelected = selectedTags.includes(tag.value);
                        return (
                          <Chip
                            key={tag.value}
                            variant={isSelected ? "solid" : "flat"}
                            color={isSelected ? "primary" : "default"}
                            size="sm"
                            onClick={() => {
                              const newTags = selectedTags.includes(tag.value)
                                ? selectedTags.filter(t => t !== tag.value)
                                : [...selectedTags, tag.value];
                              onTagsChange(newTags);
                            }}
                            className="cursor-pointer"
                            startContent={
                              isSelected ? (
                                <IconComponent icon="solar:check-circle-bold" className="text-xs" />
                              ) : null
                            }
                          >
                            {tag.label}
                          </Chip>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selection Summary */}
                  {(selectedStatuses.length > 0 || selectedTags.length > 0) && (
                    <div className="p-3 bg-primary-50 dark:bg-primary-950/20 rounded-lg border border-primary-200 dark:border-primary-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <IconComponent icon="solar:check-circle-bold" className="text-sm text-primary" />
                          <p className="text-xs font-medium text-primary">
                            Alcance definido
                          </p>
                        </div>
                        <Chip size="sm" variant="solid" color="primary">
                          {estimatedReach} clientes
                        </Chip>
                      </div>
                      <p className="text-xs text-default-700 mb-2">
                        Clientes con {logicOperator === "or" ? "cualquiera" : "todos"} de los siguientes criterios:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedStatuses.map(statusValue => {
                          const status = statuses.find(s => s.value === statusValue);
                          return status ? (
                            <span key={statusValue} className={`text-xs px-2.5 py-1 rounded-md font-medium ${status.color}`}>
                              {status.label}
                            </span>
                          ) : null;
                        })}
                        {selectedTags.map(tagValue => {
                          const tag = tags.find(t => t.value === tagValue);
                          return tag ? (
                            <span key={tagValue} className={`text-xs px-2.5 py-1 rounded-md font-medium ${tag.color}`}>
                              {tag.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="light"
          size="md"
          onPress={onBack}
        >
          Atrás
        </Button>
        <Button
          color="primary"
          variant="solid"
          size="md"
          onPress={onPublish}
          isDisabled={
            selectedReachType === "saved-view" ? !selectedView :
            selectedReachType === "custom-logic" ? (selectedStatuses.length === 0 && selectedTags.length === 0) :
            false
          }
          endContent={<IconComponent icon="solar:plain-3-bold" />}
        >
          Publicar Campaña
        </Button>
      </div>
    </div>
  );
}
