<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"

  type IconProps = {
		path: string
		class?: string
    size?: number | string
    viewbox?: `${number} ${number} ${number} ${number}`
    flip?: string
    rotate?: number
  } & HTMLAttributes<SVGElement>

  const {
		path,
    size,
    viewbox,
    flip = 'none',
    rotate = 0,
    ...props
  }: IconProps = $props();

	const sizeValue = size ?? 20
	const viewboxValue = viewbox ?? '2 2 20 20'
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
