import { Student } from "../types";
import rawData from "./extractedStudents.json";

export const officialExtractedStudents: Student[] = rawData as unknown as Student[];
