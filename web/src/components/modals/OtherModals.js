/**
 * 通用弹窗协调入口 (导出、导入、备忘录导入、批次历史)
 */
import modalsHtml from './other-modals.html?raw';
import { initExportModal, openExportModal, closeExport, downloadFile } from './ExportModal.js';
import { initImportModal, openImportModal, closeImport, openMemoImportModal, closeMemo } from './ImportModal.js';
import { initImportBatchesModal, openImportBatchesModal, closeBatches } from './ImportBatchesModal.js';

export function renderOtherModals(container) {
  container.insertAdjacentHTML('beforeend', modalsHtml);
  initExportModal();
  initImportModal();
  initImportBatchesModal();
}

export {
  openExportModal,
  closeExport,
  downloadFile,
  openImportModal,
  closeImport,
  openMemoImportModal,
  closeMemo,
  openImportBatchesModal,
  closeBatches,
};
