import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * ChildRoute — guards all /child/* routes.
 * - Unauthenticated → /login
 * - Parent role     → /parent-dashboard (parent area kept intact)
 * - Child role      → render children
 *
 * NOTE: Supabase RLS is assumed enabled on every child-facing table
 * with policy: user_id = auth.uid().
 */
export function ChildRoute({ children }: { children: JSX.Element }) {
  const { user, role, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0A1E]">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (role === "parent") return <Navigate to="/parent-dashboard" replace />;
  return children;
}

export default ChildRoute;
