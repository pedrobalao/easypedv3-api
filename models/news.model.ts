export interface News {
  id: number;
  title: string;
  description: string;
  coverUrl: string;
  type: string;
  url: string;
  expiringDate: Date;
  owner: string;
  email: string;
}
