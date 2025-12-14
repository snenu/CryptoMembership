import { NextRequest, NextResponse } from 'next/server'
import { uploadToPinata, uploadJSONToPinata } from '@/utils/pinata'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Check if Pinata credentials are configured
    if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Pinata API credentials not configured. Please check environment variables.' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (type === 'json') {
      const data = JSON.parse(formData.get('data') as string)
      const uri = await uploadJSONToPinata(data)
      return NextResponse.json({ uri })
    } else {
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }
      const uri = await uploadToPinata(file, file.name)
      return NextResponse.json({ uri })
    }
  } catch (error: any) {
    console.error('Pinata upload error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to upload to Pinata',
        details: error.response?.data || null
      },
      { status: 500 }
    )
  }
}


