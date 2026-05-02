import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import Avatar from "../Avatar";
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

const TabletLayout: React.FC<{
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
    {/* Nav */}
    <nav
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 58, background: "var(--white)",
        borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 10,
      }}
    >
      <Logo />
      <div style={{ display: "flex", gap: 4 }}>
        {(["Planner", "Recipes", "Shopping"] as const).map((label, i) => (
          <Link
            key={label}
            to={i === 0 ? "/" : "#"}
            style={{
              padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: i === 1 ? "var(--olive-pale)" : "transparent",
              color: i === 1 ? "var(--olive)" : "var(--text-soft)",
            }}
          >
            {label}
          </Link>
        ))}
      </div>
      <Avatar />
    </nav>

    {/* Sub-header */}
    <div
      style={{
        background: "var(--white)", borderBottom: "1px solid var(--border)",
        padding: "14px 24px 12px", position: "sticky", top: 58, zIndex: 9,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h1
          style={{
            fontFamily: "DM Serif Display, serif", fontSize: 26, fontWeight: 400,
            color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1,
          }}
        >
          Recipes
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ViewToggle mode={viewMode} onChange={setViewMode} />
          <button
            onClick={() => setFilterOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "6px 12px", borderRadius: 8,
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
              display: "flex", alignItems: "center", gap: 5, padding: "7px 14px",
              background: "var(--olive)", borderRadius: 9, color: "#fff",
              fontSize: 13, fontWeight: 600,
            }}
          >
            <IcoPlus /> New
          </button>
        </div>
      </div>
      <SearchBar value={search} onChange={setSearch} />
    </div>

    {/* Content */}
    <div style={{ flex: 1, padding: "16px 24px 100px" }}>
      <p style={{ fontSize: 13, color: "var(--text-soft)", marginBottom: 14 }}>
        <span style={{ color: "var(--text)", fontWeight: 700 }}>{filtered.length}</span>{" "}
        recipe{filtered.length !== 1 ? "s" : ""}
      </p>
      {viewMode === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
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
        </div>
      )}
    </div>

    <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} sortBy={sortBy} onSort={setSortBy} />
    <BottomNav />
  </div>
);

export default TabletLayout;
