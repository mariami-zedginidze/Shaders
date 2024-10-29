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

import { LoadingManager } from 'three'
import { TextureLoader } from './TextureLoader'
import { GLTFLoader } from './GLTFLoader'

/**
 * Loading manager
 */
const loadingManager = new LoadingManager()

loadingManager.onProgress = (url, loaded, total) => {
  // In case the progress count is not correct, see this:
  // https://discourse.threejs.org/t/gltf-file-loaded-twice-when-loading-is-initiated-in-loadingmanager-inside-onprogress-callback/27799/2
  console.log(`Loaded ${loaded} resources out of ${total} -> ${url}`)
}

/**
 * Texture Loader
 */
export const textureLoader = new TextureLoader(loadingManager)

/**
 * GLTF Models
 */
export const gltfLoader = new GLTFLoader(loadingManager)
