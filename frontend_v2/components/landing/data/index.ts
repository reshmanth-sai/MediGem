import raw from "./capture.json";
import { Capture, type CaptureData } from "./schema";

// Parsed once at module load. A shape mismatch fails the build rather than
// rendering a page that misdescribes the backend.
export const capture: CaptureData = Capture.parse(raw);
