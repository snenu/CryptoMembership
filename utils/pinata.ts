import axios from 'axios'

const PINATA_API_KEY = process.env.PINATA_API_KEY || ''
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || ''

export async function uploadToPinata(file: File | Blob, fileName: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const metadata = JSON.stringify({
    name: fileName,
  })
  formData.append('pinataMetadata', metadata)

  const options = JSON.stringify({
    cidVersion: 0,
  })
  formData.append('pinataOptions', options)

  try {
    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    })
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
  } catch (error) {
    console.error('Error uploading to Pinata:', error)
    throw error
  }
}

export async function uploadJSONToPinata(data: any): Promise<string> {
  const json = JSON.stringify(data)

  try {
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      { pinataContent: data },
      {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    )
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error)
    throw error
  }
}


