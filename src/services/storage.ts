interface Profile {
  name: string;
  education: string;
  interests: string[];
  skills: string[];
  location: string;
}

interface Resume {
  id: string;
  createdAt: string;
  isDefault: boolean;
  name: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills?: string;
  education?: string;
  projects?: string;
}

interface Application {
  jobId: string;
  title: string;
  company: string;
  status: string;
}

interface ATSResult {
  score: number;
  categories: [string, number][];
  matched: string[];
  missing: string[];
  suggestions: string[];
}

const read = <T>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: any): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const profileService = {
  get: (): Profile =>
    read("cc-profile", {
      name: "Aanya Sharma",
      education: "Class 12",
      interests: [],
      skills: [],
      location: "",
    }),
  save: (profile: Profile): void => write("cc-profile", profile),
};

export const resumeService = {
  getAll: (): Resume[] => read("cc-resumes", []),
  saveAll: (items: Resume[]): void => write("cc-resumes", items),
  create: (resume: Partial<Resume>): Resume => {
    const items = resumeService.getAll();
    const next: Resume = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isDefault: !items.length,
      name: resume.name || "Untitled Resume",
      email: resume.email,
      phone: resume.phone,
      summary: resume.summary,
      skills: resume.skills,
      education: resume.education,
      projects: resume.projects,
    };
    resumeService.saveAll([...items, next]);
    return next;
  },
  remove: (id: string): void =>
    resumeService.saveAll(resumeService.getAll().filter((item) => item.id !== id)),
  duplicate: (id: string): Resume | null => {
    const item = resumeService.getAll().find((resume) => resume.id === id);
    if (!item) return null;
    return resumeService.create({
      ...item,
      name: `${item.name} copy`,
      isDefault: false,
    });
  },
  setDefault: (id: string): void =>
    resumeService.saveAll(
      resumeService.getAll().map((item) => ({
        ...item,
        isDefault: item.id === id,
      }))
    ),
};

export const applicationService = {
  getAll: (): Application[] => read("cc-applications", []),
  saveAll: (items: Application[]): void => write("cc-applications", items),
  upsert: (job: { id: string; title: string; company: string }, status = "Saved"): void => {
    const items = applicationService.getAll();
    const exists = items.find((item) => item.jobId === job.id);
    applicationService.saveAll(
      exists
        ? items.map((item) =>
            item.jobId === job.id ? { ...item, status } : item
          )
        : [...items, { jobId: job.id, title: job.title, company: job.company, status }]
    );
  },
};

export const atsService = {
  analyse: (resume: Partial<Resume>, description = ""): ATSResult => {
    const content = `${resume?.summary || ""} ${resume?.skills || ""} ${resume?.projects || ""}`.toLowerCase();
    const words = description.toLowerCase().match(/[a-z][a-z+#.]{2,}/g) || [];
    const unique = [...new Set(words)].filter(
      (word) => !["with", "from", "that", "this", "will", "have", "your", "role", "team"].includes(word)
    );

    const matched = unique.filter((word) => content.includes(word));
    const missing = unique.filter((word) => !content.includes(word)).slice(0, 8);

    const completeness = [
      resume?.email,
      resume?.phone,
      resume?.summary,
      resume?.skills,
      resume?.education,
      resume?.projects,
    ].filter(Boolean).length;

    const score = Math.min(
      96,
      Math.round(
        35 + completeness * 8 + (description ? (matched.length / Math.max(unique.length, 1)) * 17 : 10)
      )
    );

    return {
      score,
      categories: [
        ["Section completeness", Math.round((completeness / 6) * 100)],
        ["Skills & keywords", description ? Math.round((matched.length / Math.max(unique.length, 1)) * 100) : 60],
        ["Readability", resume?.summary ? 75 : 45],
        ["Projects", resume?.projects ? 75 : 35],
      ],
      matched,
      missing,
      suggestions: [
        !resume?.summary && "Add a short summary based only on your real goals and strengths.",
        !resume?.projects && "Add projects you have actually completed, with your contribution.",
        missing.length && `Review whether these job-description terms genuinely describe your experience: ${missing.slice(0, 3).join(", ")}.`,
      ].filter(Boolean) as string[],
    };
  },
};
