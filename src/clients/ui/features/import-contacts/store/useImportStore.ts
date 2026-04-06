import { create } from "zustand";
import type {
  IFieldMapping,
  IImportContact,
  IDuplicateContact,
  IInvalidRecord,
  ILogEntry,
  IImportResult,
  EnumDuplicateAction,
  EnumLogEntryType,
  ICustomProperty,
} from "@clients/domain/interfaces/import-contact.interface";
import type {
  EnumImportStep,
  EnumProcessStatus,
} from "@clients/domain/enums/import-status.enum";
import {
  EnumImportStep as ImportStepValues,
  EnumProcessStatus as ProcessStatusValues,
} from "@clients/domain/enums/import-status.enum";

interface ImportState {
  currentStep: EnumImportStep;
  file: File | null;
  pastedText: string;
  sourceType: "file" | "text" | null;
  rawData: string[][];
  detectedHeaders: string[];
  hasHeaders: boolean;
  extractionSource: "parser" | "ai";
  totalRecords: number;
  fieldMappings: IFieldMapping[];
  validRecords: IImportContact[];
  duplicateRecords: IDuplicateContact[];
  invalidRecords: IInvalidRecord[];
  processStatus: EnumProcessStatus;
  progress: number;
  logEntries: ILogEntry[];
  result: IImportResult | null;
  customProperties: ICustomProperty[];
}

interface ImportActions {
  setFile: (file: File) => void;
  clearFile: () => void;
  setPastedText: (text: string) => void;
  setRawData: (data: string[][], headers: string[]) => void;
  setHasHeaders: (hasHeaders: boolean) => void;
  setExtractionSource: (source: "parser" | "ai") => void;
  setFieldMappings: (mappings: IFieldMapping[]) => void;
  setValidationResults: (valid: IImportContact[], invalid: IInvalidRecord[]) => void;
  setDuplicateRecords: (duplicates: IDuplicateContact[]) => void;
  setDuplicateAction: (email: string, action: EnumDuplicateAction) => void;
  setBulkDuplicateAction: (action: EnumDuplicateAction) => void;
  setProcessStatus: (status: EnumProcessStatus) => void;
  setProgress: (progress: number) => void;
  addLogEntry: (message: string, type: EnumLogEntryType) => void;
  setResult: (result: IImportResult) => void;
  addCustomProperty: (property: ICustomProperty) => void;
  removeCustomProperty: (key: string) => void;
  goToStep: (step: EnumImportStep) => void;
  reset: () => void;
}

const initialState: ImportState = {
  currentStep: ImportStepValues.UPLOAD,
  file: null,
  pastedText: "",
  sourceType: null,
  rawData: [],
  detectedHeaders: [],
  hasHeaders: true,
  extractionSource: "parser",
  totalRecords: 0,
  fieldMappings: [],
  validRecords: [],
  duplicateRecords: [],
  invalidRecords: [],
  processStatus: ProcessStatusValues.IDLE,
  progress: 0,
  logEntries: [],
  result: null,
  customProperties: [],
};

export const useImportStore = create<ImportState & ImportActions>((set) => ({
  ...initialState,

  setFile: (file) => set({ file, sourceType: "file", pastedText: "" }),
  clearFile: () => set({ file: null, sourceType: null }),
  setPastedText: (text) => set({ pastedText: text, sourceType: text ? "text" : null, file: null }),
  setRawData: (data, headers) => set({ rawData: data, detectedHeaders: headers, totalRecords: data.length }),
  setHasHeaders: (hasHeaders) => set({ hasHeaders }),
  setExtractionSource: (source) => set({ extractionSource: source }),
  setFieldMappings: (mappings) => set({ fieldMappings: mappings }),
  setValidationResults: (valid, invalid) => set({ validRecords: valid, invalidRecords: invalid }),
  setDuplicateRecords: (duplicates) => set({ duplicateRecords: duplicates }),

  setDuplicateAction: (email, action) =>
    set((state) => ({
      duplicateRecords: state.duplicateRecords.map((d) =>
        d.record.email.toLowerCase() === email.toLowerCase() ? { ...d, action } : d,
      ),
    })),

  setBulkDuplicateAction: (action) =>
    set((state) => ({
      duplicateRecords: state.duplicateRecords.map((d) => ({ ...d, action })),
    })),

  setProcessStatus: (status) => set({ processStatus: status }),
  setProgress: (progress) => set({ progress }),

  addLogEntry: (message, type) =>
    set((state) => ({
      logEntries: [...state.logEntries, { timestamp: new Date(), message, type }],
    })),

  setResult: (result) => set({ result }),

  addCustomProperty: (property) =>
    set((state) => ({
      customProperties: [...state.customProperties, property],
    })),

  removeCustomProperty: (key) =>
    set((state) => ({
      customProperties: state.customProperties.filter((p) => p.key !== key),
      fieldMappings: state.fieldMappings.map((m) =>
        m.beweField === key ? { ...m, beweField: null, isCustomProperty: false, customPropertyType: undefined } : m,
      ),
    })),

  goToStep: (step) => set({ currentStep: step }),
  reset: () => set(initialState),
}));
