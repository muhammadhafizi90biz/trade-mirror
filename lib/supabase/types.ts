export type Profile = {
  id: string;
  email: string | null;
  created_at: string;
  is_admin: boolean | null;
  is_super_admin: boolean | null;
};

export type Trade = {
  id: string;
  user_id: string;
  asset: string | null;
  ticks: number | null;
  trade_time: string | null;
  created_at: string;
};

export type MarketPost = {
  id: string;
  title: string;
  body: string;
  status: "draft" | "published";
  created_by: string;
  created_at: string;
};

export type SystemNotification = {
  id: string;
  title: string;
  message: string;
  audience: "all";
  created_by: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      trades: {
        Row: Trade;
        Insert: Partial<Trade> & { user_id: string };
        Update: Partial<Trade>;
        Relationships: [];
      };
      market_posts: {
        Row: MarketPost;
        Insert: Omit<MarketPost, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<MarketPost>;
        Relationships: [];
      };
      system_notifications: {
        Row: SystemNotification;
        Insert: Omit<SystemNotification, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<SystemNotification>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
