import { NextRequest, NextResponse } from 'next/server'
import { uploadToPinata, uploadJSONToPinata } from '@/utils/pinata'

export async function POST(request: NextRequest) {
  try {
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


