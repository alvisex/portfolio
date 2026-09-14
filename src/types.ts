type Company = {
    id: string;
    role: string;
    img: string;
    period: string;
    companyName: string;
    area: string;
    color: string;
    rotate: 'left' | 'right';
    /** HTML strings, rendered with v-html */
    items: string[];
}

export type { Company }
