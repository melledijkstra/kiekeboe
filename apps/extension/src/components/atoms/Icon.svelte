<script lang="ts">
  interface IconProps extends Partial<HTMLOrSVGElement> {
		path: string
		class?: string
    size?: number
    viewbox?: `${number} ${number} ${number} ${number}`
    flip?: string
    rotate?: number
  }

  const {
		path,
    size,
    viewbox,
    flip = 'none',
    rotate = 0,
    ...props
  }: IconProps = $props();

	const sizeValue = size ?? 24
	const viewboxValue = viewbox ?? '0 0 24 24'
	const sx = ['both', 'horizontal'].includes(flip) ? '-1' : '1'
	const sy = ['both', 'vertical'].includes(flip) ? '-1' : '1'
	const r = isNaN(rotate) ? rotate : rotate + 'deg'
</script>

<style>
	svg {
		transform: rotate(var(--r, 0deg)) scale(var(--sx, 1), var(--sy, 1));
	}

	path {
		fill: currentColor;
	}
</style>

<svg width={sizeValue} height={sizeValue} viewBox={viewboxValue} style="--sx: {sx}; --sy: {sy}; --r: {r}" {...props}>
	<path d={path} />
</svg>
