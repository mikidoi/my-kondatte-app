import React from "react";
import Logo from "../Logo";
import SearchBar from "../SearchBar";
import ViewToggle from "../buttons/ViewToggle";
import BottomNav from "../BottomNav";
import IcoFilter from "../icons/IcoFilter";
import IcoPlus from "../icons/IcoPlus";
import FilterSheet from "./FilterSheet";
import RecipeGridCard from "../../pages/recipes/components/RecipeGridCard";
import RecipeListRow from "../../pages/recipes/components/RecipeListRow";

interface Recipe {
  id: number;
  name: string;
  ingredients: string;
  instructions: string;
  imagePath?: string;
}

type ViewMode = "grid" | "list";
type SortBy = "Recent" | "Rating" | "Quickest";

const MobileLayout: React.FC<{
  filtered: Recipe[];
  search: string;
  setSearch: (v: string) => void;
  sortBy: SortBy;
  setSortBy: (s: SortBy) => void;
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  filterOpen: boolean;
  setFilterOpen: (o: boolean) => void;
  likedIds: Set<number>;
  toggleLike: (id: number) => void;
  deleteRecipe: (id: number) => void;
  onNewRecipe: () => void;
}> = ({
  filtered,
  search,
  setSearch,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  filterOpen,
  setFilterOpen,
  likedIds,
  toggleLike,
  deleteRecipe,
  onNewRecipe,
}) => (
  <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
    {/* Status bar */}
    <div
      style={{
        height: 44, flexShrink: 0, background: "var(--white)",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px",
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>9:41</span>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <svg width="16" height="12" viewBox="0 0 16 12">
          <rect x="0" y="4" width="3" height="8" fill="var(--text)" rx="1" />
          <rect x="4.5" y="2.5" width="3" height="9.5" fill="var(--text)" rx="1" />
          <rect x="9" y="0.5" width="3" height="11.5" fill="var(--text)" rx="1" />
        </svg>
        <svg width="18" height="12" viewBox="0 0 18 12">
          <rect x="0.5" y="0.5" width="15" height="11" rx="2" stroke="var(--text-soft)" strokeWidth="1" fill="none" />
          <rect x="1.5" y="1.5" width="11" height="9" rx="1.5" fill="var(--text)" />
        </svg>
      </div>
    </div>

    {/* Sticky header */}
    <header style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 50 }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setFilterOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "6px 11px", borderRadius: 8,
              border: `1px solid ${sortBy !== "Recent" ? "var(--olive)" : "var(--border)"}`,
              background: sortBy !== "Recent" ? "var(--olive)" : "var(--olive-faint)",
              color: sortBy !== "Recent" ? "#fff" : "var(--text-mid)",
              fontSize: 12, fontWeight: 600,
            }}
          >
            <IcoFilter /> Filter
          </button>
          <button
            onClick={onNewRecipe}
            style={{
              width: 34, height: 34, borderRadius: 9, background: "var(--olive)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
            }}
          >
            <IcoPlus />
          </button>
        </div>
      </div>
      <div style={{ padding: "0 16px 10px" }}>
        <SearchBar value={search} onChange={setSearch} />
      </div>
    </header>

    {/* Content */}
    <div style={{ flex: 1, padding: "14px 16px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ fontSize: 13, color: "var(--text-soft)" }}>
          <span style={{ color: "var(--text)", fontWeight: 700 }}>{filtered.length}</span>{" "}
          recipe{filtered.length !== 1 ? "s" : ""}
        </p>
        <ViewToggle mode={viewMode} onChange={setViewMode} small />
      </div>

      {viewMode === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {filtered.map((r, i) => (
            <RecipeGridCard
              key={r.id} recipe={r} idx={i} compact
              liked={likedIds.has(r.id)}
              onToggleLike={() => toggleLike(r.id)}
              onDelete={() => deleteRecipe(r.id)}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((r, i) => (
            <RecipeListRow
              key={r.id} recipe={r} idx={i}
              liked={likedIds.has(r.id)}
              onToggleLike={() => toggleLike(r.id)}
              onDelete={() => deleteRecipe(r.id)}
            />
          ))}
        </div>
      )}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px 0", color: "var(--text-soft)" }}>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: "var(--text-mid)" }}>
            No recipes found
          </p>
          <p style={{ fontSize: 12 }}>Try a different search</p>
        </div>
      )}
    </div>

    <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} sortBy={sortBy} onSort={setSortBy} />
    <BottomNav />
  </div>
);

export default MobileLayout;
