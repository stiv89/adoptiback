"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

type UserAvatarProps = {
  userId: string;
  email: string | null;
  size?: number;
  className?: string;
};

export default function UserAvatar({ userId, email, size = 36, className = "" }: UserAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("avatar_url").eq("id", userId).single();
      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
      setLoading(false);
    })();
  }, [userId]);

  const initial = email?.[0]?.toUpperCase() ?? "?";

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand ${className}`}
        style={{ width: size, height: size }}
      >
        {initial}
      </div>
    );
  }

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={email || "Usuario"}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand ${className}`}
      style={{ width: size, height: size }}
    >
      {initial}
    </div>
  );
}

