/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAINNET_GATEWAY_TOKEN_API: string
  readonly VITE_TESTNET_GATEWAY_TOKEN_API: string
  readonly VITE_MAINNET_GATEWAY_PUBLIC_KEY_API: string
  readonly VITE_TESTNET_GATEWAY_PUBLIC_KEY_API: string
  readonly VITE_GALASWAP_API: string
  readonly VITE_FAUCET_MULTIPLIER: string
  readonly VITE_FAUCET_ADMIN_PRIVATE_KEY: string
  readonly VITE_FAUCET_ADMIN_PUBLIC_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}