/// <reference types="vitest" />
import { getViteConfig } from 'astro/config'
import type { ViteUserConfig } from 'vitest/config'

const vitestConfig: ViteUserConfig = {
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
  }
}

export default getViteConfig(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- astroのvite依存が古いため
  vitestConfig as any
)
