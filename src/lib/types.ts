export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          cnic: string | null;
          cnic_front_url: string | null;
          cnic_back_url: string | null;
          selfie_url: string | null;
          cnic_verified: boolean;
          city: string | null;
          whatsapp_number: string | null;
          whatsapp_chat_only: boolean;
          google_id: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at" | "cnic_verified" | "is_admin" | "whatsapp_chat_only"> & Partial<Pick<Database["public"]["Tables"]["users"]["Row"], "cnic_verified" | "is_admin" | "whatsapp_chat_only">>;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      ads: {
        Row: {
          id: number;
          seller_id: string;
          title: string;
          description: string | null;
          price: number;
          category: string;
          subcategory: string | null;
          condition: string | null;
          city: string | null;
          area: string | null;
          status: "pending" | "active" | "rejected" | "sold" | "expired";
          ownership_proof_url: string | null;
          views: number;
          created_at: string;
          expires_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["ads"]["Row"], "id" | "created_at" | "expires_at" | "views" | "status"> & Partial<Pick<Database["public"]["Tables"]["ads"]["Row"], "status" | "views">>;
        Update: Partial<Database["public"]["Tables"]["ads"]["Insert"]>;
      };
      ad_photos: {
        Row: { id: number; ad_id: number; url: string; order_index: number };
        Insert: Omit<Database["public"]["Tables"]["ad_photos"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["ad_photos"]["Insert"]>;
      };
      chats: {
        Row: { id: number; ad_id: number; buyer_id: string; seller_id: string; phone_revealed: boolean; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["chats"]["Row"], "id" | "created_at" | "phone_revealed">;
        Update: Partial<Database["public"]["Tables"]["chats"]["Insert"]>;
      };
      messages: {
        Row: { id: number; chat_id: number; sender_id: string; content: string; is_blocked: boolean; block_reason: string | null; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "created_at" | "is_blocked" | "block_reason"> & Partial<Pick<Database["public"]["Tables"]["messages"]["Row"], "is_blocked" | "block_reason">>;
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      reviews: {
        Row: { id: number; reviewer_id: string; seller_id: string; chat_id: number | null; rating: number; comment: string | null; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      reports: {
        Row: { id: number; reporter_id: string; ad_id: number; reason: string; status: string; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["reports"]["Row"], "id" | "created_at" | "status">;
        Update: Partial<Database["public"]["Tables"]["reports"]["Insert"]>;
      };
      support_tickets: {
        Row: {
          id: number;
          user_id: string | null;
          type: string | null;
          name: string | null;
          email: string | null;
          subject: string | null;
          message: string;
          metadata: Record<string, unknown> | null;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["support_tickets"]["Row"], "id" | "created_at" | "status">;
        Update: Partial<Database["public"]["Tables"]["support_tickets"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
  };
}

// Convenience types
export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type AdRow = Database["public"]["Tables"]["ads"]["Row"];
export type AdPhotoRow = Database["public"]["Tables"]["ad_photos"]["Row"];
export type ChatRow = Database["public"]["Tables"]["chats"]["Row"];
export type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

export type AdWithPhotos = AdRow & {
  ad_photos: AdPhotoRow[];
  users: Pick<UserRow, "id" | "full_name" | "city" | "cnic_verified" | "whatsapp_number">;
};
