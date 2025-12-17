export interface Program {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  status: "PENDING" | "PUBLISHED" | "REJECTED";
}

export interface Article {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  status?: 'PENDING' | 'PUBLISHED' | 'REJECTED';
}

export interface Work {
  id: string;
  title: string;
  studentName: string;
  content: string;
  createdAt: string;
  status?: 'PENDING' | 'PUBLISHED' | 'REJECTED';
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  image?: string;
  moduleId: string;
  status?: 'PENDING' | 'PUBLISHED' | 'REJECTED';
}

export interface Module {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  createdAt: string;
  status?: 'PENDING' | 'PUBLISHED' | 'REJECTED';
}

export interface Achievement {
  id: string;
  title: string;
  event: string;
  image: string;
  link?: string;
  createdAt: string;
  status?: 'PENDING' | 'PUBLISHED' | 'REJECTED';
}

export interface Portfolio {
  id: string;
  title: string;
  studentName: string;
  image: string;
  link?: string; 
  createdAt: string;
  status?: 'PENDING' | 'PUBLISHED' | 'REJECTED';
}
