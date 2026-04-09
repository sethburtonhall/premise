export interface ScopeInput {
  budget?: string;
  platform?: string;
  timeline?: string;
  description?: string;
  teamContext?: string;
}

export type Scope = {
  id: string;
  userId: string;
  input: ScopeInput;
  output: string;
  title: string | null;
  createdAt: Date;
};
