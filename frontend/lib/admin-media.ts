import { getApiGatewayUrl, requireAdminToken } from "@/lib/auth"

export async function uploadAdminImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) {
    return null
  }

  const token = await requireAdminToken()
  if (!token) {
    return null
  }

  const body = new FormData()
  body.append("file", file)

  const response = await fetch(`${getApiGatewayUrl()}/api/admin/uploads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(await readMediaError(response))
  }

  const data = (await response.json()) as { url: string }
  return data.url
}

export function mediaUrl(url?: string | null) {
  if (!url) {
    return null
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  return `${getApiGatewayUrl()}${url}`
}

async function readMediaError(response: Response) {
  try {
    const data = (await response.json()) as { message?: string }
    return data.message ?? "Unable to upload image."
  } catch {
    return "Unable to upload image."
  }
}
