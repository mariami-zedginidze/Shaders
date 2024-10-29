/*
 * MIT License
 * Copyright (c) 2020 Francesco Michelini
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 */

import { TextureLoader as ThreeTextureLoader } from 'three'

export class TextureLoader {
  constructor(manager) {
    this.loader = new ThreeTextureLoader(manager)
  }

  /**
   * Load a single texture or an array of textures.
   *
   * @param {String|String[]} resources Single URL or array of URLs of the texture(s) to load.
   * @returns Texture|Texture[]
   */
  async load(resources) {
    if (Array.isArray(resources)) {
      const promises = resources.map(url => this.#loadTexture(url))
      return await Promise.all(promises)
    } else {
      return await this.#loadTexture(resources)
    }
  }

  /**
   * Load a single texture.
   *
   * @param {String} url The URL of the texture to load
   * @returns Promise
   */
  #loadTexture(url) {
    return new Promise(resolve => {
      this.loader.load(url, texture => {
        resolve(texture)
      })
    })
  }
}
