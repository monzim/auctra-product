import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// --- Data Types ---
interface Submission {
    id: string;
    companyId: string;
    name: string;
    registrationNumber: string;
    contact: string;
    documentPath: string;
    submittedAt: string;
    status: 'pending';
}

// --- DB Paths ---
const dbDir = path.join(process.cwd(), 'db');
const pendingDbPath = path.join(dbDir, 'pending.json');
const verifiedDbPath = path.join(dbDir, 'verified.json');
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

// --- Helpers ---
const readDb = async (filePath: string): Promise<any[]> => {
    try {
        await fs.promises.access(filePath);
        const data = await fs.promises.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

const ensureDbFile = async (filePath: string) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        await mkdir(dir, { recursive: true });
    }
    try {
        await fs.promises.access(filePath);
    } catch {
        await fs.promises.writeFile(filePath, JSON.stringify([]));
    }
};

const validateFile = (file: File): string | null => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) return "Invalid file type. Only PDF, JPG, and PNG are allowed.";
    const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSizeInBytes) return `File is too large. Maximum size is 10 MB.`;
    return null;
};

// --- API Handler ---
export async function POST(req: NextRequest) {
    try {
        await mkdir(uploadsDir, { recursive: true });
        await ensureDbFile(pendingDbPath);
        await ensureDbFile(verifiedDbPath);

        const formData = await req.formData();
        const companyId = formData.get('companyId') as string;
        const name = formData.get('name') as string;
        const registrationNumber = formData.get('registrationNumber') as string;
        const contact = formData.get('contact') as string;
        const file = formData.get('documents') as File | null;

        // --- Validation ---
        if (!companyId || !name || !registrationNumber || !contact || !file) {
            return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
        }
        const fileError = validateFile(file);
        if (fileError) {
            return NextResponse.json({ message: fileError }, { status: 400 });
        }

        // --- Check for Duplicates ---
        const pendingSubmissions = await readDb(pendingDbPath);
        if (pendingSubmissions.some(s => s.companyId === companyId)) {
             return NextResponse.json({ message: "An update for this Company ID is already pending review." }, { status: 409 });
        }

        // A company can submit an update if they are already verified. The logic does not need to check verified.json here,
        // as a new submission will simply create a new version on-chain. The check for pending is sufficient to prevent duplicate work.

        // --- File and Data Handling ---
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const documentPath = path.join(uploadsDir, filename);
        await writeFile(documentPath, buffer);

        const newSubmission: Submission = {
            id: crypto.randomUUID(),
            companyId,
            name,
            registrationNumber,
            contact,
            documentPath: `/uploads/${filename}`,
            submittedAt: new Date().toISOString(),
            status: 'pending',
        };

        pendingSubmissions.push(newSubmission);
        await fs.promises.writeFile(pendingDbPath, JSON.stringify(pendingSubmissions, null, 2));

        const message = pendingSubmissions.some(s => s.companyId === companyId && s.id !== newSubmission.id)
            ? "Update submission successful! Your application is pending review."
            : "Submission successful! Your application is pending review.";

        return NextResponse.json({ message }, { status: 201 });

    } catch (error) {
        console.error("Submission API Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
