<script lang="ts">
	import type { PageProps } from './$types';
	import NoteCard from './NoteCard.svelte';

	let { data }: PageProps = $props();
</script>

<div class="flex flex-col gap-2 p-2">
	{#each data.data ?? [] as note (note.id)}
		<NoteCard {note} />
	{:else}
		<div class="flex items-center justify-center h-full">
			<p class="text-sm text-muted-foreground">No notes found</p>
		</div>
	{/each}
</div>
