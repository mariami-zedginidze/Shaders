import { Color, Vector3, ShaderMaterial, DoubleSide } from "three";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

export const planeMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  side: DoubleSide,
  uniforms: {
    u_PivotPosition: { value: new Vector3(0.0, -1.7, 0.0) },
    diffuse: { value: new Color(0xffffff) },
    opacity: { value: 1 },
    matcap: { value: null },
    t_noise: { value: null },
    u_time: { value: 0 },
    u_FlameColor: { value: new Color(0.7, 0.0, 0.0) },
    u_AlphaFalloffStart: { value: 0.25 },
    u_AlphaFalloffEnd: { value: 0.4 },
    u_FlameFalloffStart: { value: 0.45 },
    u_FlameFalloffEnd: { value: 0.48 },
  },
});
