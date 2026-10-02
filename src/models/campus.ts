export interface ICampus {
  id: string;
  name: string;
  universityId: string;
  universityName?: string;
  university?: {
    id: string;
    name: string;
  };
  description?: string;
  majorCount?: number;
  createdAt: string;
  updatedAt?: string | null;
}
