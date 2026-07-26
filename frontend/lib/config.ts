export function getApiGatewayUrl() {
  return process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? process.env.API_GATEWAY_URL ?? "http://localhost:8080"
}
