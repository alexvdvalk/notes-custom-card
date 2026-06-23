<script lang="ts">
	import { format, formatDistance } from 'date-fns';
	import User from '@lucide/svelte/icons/user';
	import Clock from '@lucide/svelte/icons/clock';
	import Zap from '@lucide/svelte/icons/zap';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import * as Card from '$lib/components/ui/card';
	import type { Note } from '$lib/types';

	let { note }: { note: Note } = $props();

	const addedDate = $derived(new Date(note.dateAdded));
	const relativeDate = $derived(formatDistance(addedDate, new Date(), { addSuffix: true }));
	const absoluteDate = $derived(format(addedDate, 'PPpp'));
	const authorName = $derived(
		[note.commentingPerson?.firstName, note.commentingPerson?.lastName].filter(Boolean).join(' ') ||
			'Unknown'
	);
</script>

<Card.Root size="sm" class="gap-0 py-2 shadow-none">
	<Card.Content class="flex flex-col gap-1.5 px-3 py-0">
		<div class="flex items-start gap-1.5">
			<User class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
			<p class="min-w-0 text-xs leading-snug">
				<span class="font-medium text-muted-foreground">Author:</span>
				{authorName}
			</p>
		</div>

		<div class="flex items-start gap-1.5">
			<Clock class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
			<p class="min-w-0 text-xs leading-snug" title={absoluteDate}>
				<span class="font-medium text-muted-foreground">Added:</span>
				{relativeDate}
			</p>
		</div>

		<div class="flex items-start gap-1.5">
			<Zap class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
			<div class="min-w-0 text-xs leading-snug">
				<span class="font-medium text-muted-foreground">Action:</span>
				<span class="action-html">{note.action}</span>
			</div>
		</div>

		{#if note.comments}
			<div class="flex items-start gap-1.5">
				<MessageSquare class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
				<div class="min-w-0 text-xs leading-snug">
					<span class="font-medium text-muted-foreground">Comments:</span>
					<div class="whitespace-pre-wrap">{@html note.comments}</div>
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>

<style>
	.action-html :global(a) {
		color: var(--primary);
		text-decoration: underline;
	}
</style>
