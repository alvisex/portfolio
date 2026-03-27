type Company = {
    id: string;
    role: string;
    img: string;
    period: string;
    companyName: string;
    area: string;
    color: string;
    items: Array<{ title: string; description: string }>;
}

export type { Company }