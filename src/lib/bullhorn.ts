import type { NoteResponse } from './types';
import { browser } from '$app/env';

let bridge: import('@bullhorn/connect').AppBridge | null = null;

async function getBridge() {
    if (!browser) {
        throw new Error('AppBridge is only available in the browser');
    }

    if (!bridge) {
        const { AppBridge } = await import('@bullhorn/connect');
        bridge = new AppBridge();
    }

    return bridge;
}

export const getNotes = async (candidateId: string, filter: string[] = []) => {
    let filters = filter.map((i) => `'${i.toLowerCase().trim()}'`).join(" OR ")
    let query = `isDeleted:false AND candidateUserID:${candidateId}`;
    let fields =
        'id, dateAdded, commentingPerson(id, firstName, lastName), action, comments, clientContacts, candidates, jobOrders, placements(id, candidate, jobOrder), primaryDepartmentName, leads(firstName, lastName), opportunities(id, title), placementCertifications(id, certification(id, name)), candidateCertifications(id, name) ';
    if (filter.length > 0) {
        query += ` AND action:(${filters})`;
        // query += ` AND action:(plac*)`;
    }
    // console.log({ query });
    const records = await (await getBridge()).httpGET(`search/Note?query=${query}&fields=${fields}`);
    // console.log(records);
    return records.data as NoteResponse;
};
