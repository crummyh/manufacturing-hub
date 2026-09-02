<script lang="ts">
    import firsty from '$lib/assets/firsty.svg';
	import type { HTMLImgAttributes } from 'svelte/elements';

    interface Props extends HTMLImgAttributes {
      size?: number
    }

    let { size = 8, class: divClass, ...restProps }: Props = $props()
</script>

<div class={["dark:bg-white dark:rounded-lg dark:p-1", divClass]}>
    <img class="size-{size}" src={firsty} alt="firsty logo" {...restProps} />
</div>
