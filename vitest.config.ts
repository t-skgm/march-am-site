/// <reference types="vitest" />
import { getViteConfig } from 'astro/config'
import type { UserConfig as VitestUserConfig } from 'vitest/config'

const vitestConfig: VitestUserConfig = {
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
  }
}

export default getViteConfig(vitestConfig)
