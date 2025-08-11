/// <reference types="vitest" />
import { getViteConfig } from 'astro/config'
import type { ViteUserConfig } from 'vitest/config'

const vitestConfig: ViteUserConfig = {
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
  }
}

export default getViteConfig(vitestConfig)
