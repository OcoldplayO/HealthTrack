export {};

declare global {
  var Chart: any;

  interface HealthTrackBridge {
    openDownloads?: () => void;
    copyText?: (text: string) => void;
    hasStepPermission?: () => boolean;
    requestStepPermission?: () => void;
    getTodaySteps?: () => number;
    refreshSteps?: () => void;
    getStepDebugInfo?: () => string;
    isStepSensorAvailable?: () => boolean;
  }

  interface ExportResultPayload {
    ok: boolean;
    filename?: string;
    size?: number | null;
    location?: string;
    message?: string;
  }

  interface Window {
    HealthTrack?: HealthTrackBridge;
    onExportResult?: (result: ExportResultPayload) => void;
    onStepPermissionResult?: (granted: boolean) => void;
    onNativeStepsUpdated?: (rawSteps: number) => void;
    handleNativeBack?: () => boolean;
  }
}
