import type { PageLoad } from './$types';

import { browser } from '$app/env';
import { getNotes } from '$lib/bullhorn';
import type { NoteResponse } from '$lib/types';


const emptyResponse = {
    data: [],
    total: 0,
    start: 0,
    count: 0
};

export const load = (async ({ url }) => {
    let candidateId = url.searchParams.get('EntityID');
    let filter = url.searchParams.get('filter')?.split(',') || [];

    if (!candidateId || !browser) {
        return emptyResponse;
    }

    let notes: NoteResponse = await getNotes(candidateId, filter);
    return notes;
}) satisfies PageLoad;
