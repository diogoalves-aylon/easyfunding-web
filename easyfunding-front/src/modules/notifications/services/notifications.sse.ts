import api from "@/core/api"
import { useAuthStore } from "@/stores/authStore"

let es: EventSource | null = null
let lastToken: string | null = null

function buildSseUrl(token: string) {
  const base = api.defaults.baseURL || "http://localhost:8000"
  const u = new URL(base)

  const basePath = u.pathname.replace(/\/+$/, "")
  const hasApi = basePath.endsWith("/api")
  u.pathname = (hasApi ? "/api" : "") + "/api/notifications/stream/"
  u.pathname = u.pathname.replace(/\/api\/api\//g, "/api/")

  u.searchParams.set("token", token)
  return u.toString()
}

export function startNotificationsSSE(options?: { onMessage?: (payload: any) => void }) {
  const auth = useAuthStore()
  const token = auth.token
  if (!token) return

  if (es && lastToken === token) return

  stopNotificationsSSE()
  lastToken = token

  const url = buildSseUrl(token)
  console.log("[SSE] connecting:", url)

  es = new EventSource(url)

  es.addEventListener("ready", () => {
    console.log("[SSE] ready")
  })

  es.addEventListener("notification.created", (evt: MessageEvent) => {
    try {
      const payload = JSON.parse(evt.data)
      options?.onMessage?.(payload)
    } catch {
      options?.onMessage?.(evt.data)
    }
  })

  es.addEventListener("error", (evt) => {
    console.warn("[SSE] error", evt)
  })
}

export function stopNotificationsSSE() {
  if (es) {
    console.log("[SSE] close")
    es.close()
    es = null
  }
  lastToken = null
}