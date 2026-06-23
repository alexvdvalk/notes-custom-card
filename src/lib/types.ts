export interface NoteResponse {
    total: number
    start: number
    count: number
    data: Note[]
    query: string
    elasticQuery: any
    fieldsFromIndex: boolean
}

export interface Note {
    id: number
    dateAdded: number
    commentingPerson: CommentingPerson
    action: string
    comments: string
    clientContacts: ClientContacts
    candidates: Candidates
    jobOrders: JobOrders
    placements: Placements
    primaryDepartmentName?: string[]
    leads: Leads
    opportunities: Opportunities
    placementCertifications: PlacementCertifications
    candidateCertifications: CandidateCertifications
    _score: number
}

export interface CommentingPerson {
    id: number
    _subtype: string
    firstName: string
    lastName: string
}

export interface ClientContacts {
    total: number
    data: Daum2[]
}

export interface Daum2 {
    id: number
    firstName: string
    lastName: string
}

export interface Candidates {
    total: number
    data: Daum3[]
}

export interface Daum3 {
    id: number
    firstName: string
    lastName: string
}

export interface JobOrders {
    total: number
    data: Daum4[]
}

export interface Daum4 {
    id: number
    title: string
}

export interface Placements {
    total: number
    data: any[]
}

export interface Leads {
    total: number
    data: any[]
}

export interface Opportunities {
    total: number
    data: any[]
}

export interface PlacementCertifications {
    total: number
    data: any[]
}

export interface CandidateCertifications {
    total: number
    data: any[]
}
