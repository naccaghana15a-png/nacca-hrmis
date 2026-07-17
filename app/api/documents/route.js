import { NextResponse } from 'next/server';

// In-memory storage (replace with database)
let documents = [];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    // If no staffId, return all documents (for HR/Admin)
    if (!staffId) {
      return NextResponse.json(documents);
    }

    const userDocs = documents.filter(doc => doc.staffId === staffId);
    return NextResponse.json(userDocs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, fileName, fileSize, fileType, staffId, uploadedBy, downloadUrl } = body;

    const newDoc = {
      id: Date.now(),
      title: title || fileName,
      category: category || 'others',
      fileName,
      fileSize,
      fileType,
      staffId,
      uploadedBy: uploadedBy || 'Staff',
      uploadedAt: new Date().toISOString(),
      downloadUrl,
    };

    documents.push(newDoc);
    return NextResponse.json({ success: true, document: newDoc });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    documents = documents.filter(doc => doc.id !== parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}