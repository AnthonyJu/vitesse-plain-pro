import SvgLoader from 'vite-svg-loader'

// https://github.com/jpkleemans/vite-svg-loader#readme
export function svgLoader() {
  return SvgLoader({ defaultImport: 'url' })
}
