export async function uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/upload`,
        {
            method: 'POST',
            body: formData
        }
    )

    if (!res.ok) {
        throw new Error('Upload failed')
    }

    const data = await res.json()
    return data.path
}
