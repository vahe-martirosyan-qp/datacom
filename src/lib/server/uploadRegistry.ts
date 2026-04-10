/** In-memory registry of uploaded files (replace with DB table when moving off the mock store). */

export interface UploadRecord {
  id: string;
  /** Relative URL path, e.g. `/uploads/projects/abc.jpg` */
  url: string;
  /** Filename on disk under `public/` */
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAtIso: string;
}

const records: UploadRecord[] = [];

export function registerUpload(record: UploadRecord): void {
  records.push(record);
}

export function listUploadRecords(): readonly UploadRecord[] {
  return records;
}
