import SvgLoader from 'vite-svg-loader'

// https://github.com/JohnCampionJr/vite-plugin-vue-layouts
export function svgLoader() {
  return SvgLoader({ defaultImport: 'url' })
}
